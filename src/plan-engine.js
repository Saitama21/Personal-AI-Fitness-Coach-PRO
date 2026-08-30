import { exercises } from "./exercises.js";
import {
  CYCLE_WEEKS,
  GOALS,
  PLAN_REVISION,
  SESSION_LIBRARY,
  WEEK_RULES,
  selectProgramScheme
} from "./program-rules.js";

const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const LEVEL_RANK = { beginner: 1, intermediate: 2, advanced: 3 };
const GYM_EQUIPMENT = ["bodyweight", "dumbbells", "barbell", "cable", "machine"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hashUnit(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function normalizeEquipment(profile = {}) {
  const selected = new Set(Array.isArray(profile.equipment) ? profile.equipment : []);
  selected.delete("gym");
  selected.delete("home");
  if (profile.equipment?.includes("gym")) {
    for (const item of GYM_EQUIPMENT) selected.add(item);
  }
  selected.add("bodyweight");
  return selected;
}

function compatibleEquipmentOptions(exercise, profile = {}) {
  const available = normalizeEquipment(profile);
  const options = Array.isArray(exercise?.requiredEquipmentOptions) ? exercise.requiredEquipmentOptions : [["bodyweight"]];
  return options.filter((option) => option.every((required) => available.has(required)));
}

export function canPerformExercise(exercise, profile = {}) {
  if (!exercise?.productionReady) return false;
  return compatibleEquipmentOptions(exercise, profile).length > 0;
}

function canUseExternalLoad(exercise, profile = {}) {
  const loadBearing = new Set(["dumbbells", "barbell", "cable", "machine"]);
  return compatibleEquipmentOptions(exercise, profile).some((option) => option.some((item) => loadBearing.has(item)));
}

function levelAllows(exercise, level) {
  const userRank = LEVEL_RANK[level] || 1;
  const exerciseRank = LEVEL_RANK[exercise.difficulty] || 1;
  return exerciseRank <= userRank;
}

function focusScore(exercise, focus) {
  const groups = exercise.muscleGroups || [];
  if (focus === "glutes" && groups.some((item) => item.includes("Ягод"))) return 10;
  if (focus === "upper" && groups.some((item) => ["Грудные", "Широчайшие", "Ромбовидные", "Средняя дельта", "Задняя дельта", "Трицепс", "Бицепс"].includes(item))) return 8;
  if (focus === "posture" && ["horizontal_pull", "vertical_pull", "scapular_pull", "horizontal_abduction"].includes(exercise.movementPattern)) return 12;
  return 0;
}

function roleScore(exercise, role) {
  if (role === "primary" && exercise.exerciseType === "compound") return 16;
  if (role === "secondary" && ["compound", "accessory"].includes(exercise.exerciseType)) return 10;
  if (role === "accessory" && ["isolation", "accessory", "core"].includes(exercise.exerciseType)) return 12;
  if (role === "core" && exercise.exerciseType === "core") return 20;
  return 0;
}

function scoreCandidate(exercise, slot, context) {
  const patternIndex = slot.patterns.indexOf(exercise.movementPattern);
  const patternScore = patternIndex >= 0 ? 70 - patternIndex * 8 : 0;
  const muscleScore = (slot.targets || []).reduce((score, target) => {
    const matches = exercise.primaryMuscle === target || (exercise.muscleGroups || []).includes(target);
    return score + (matches ? 9 : 0);
  }, 0);
  const reusePenalty = (context.usedInWeek.get(exercise.id) || 0) * 18;
  // Visual readiness is a ranking preference, not a physiology constraint.
  // A valid exercise may still be prescribed with an explicit placeholder when
  // its media pack is quarantined, but ready visuals win when mechanics match.
  const visualReadyBonus = exercise.visualReady ? 22 : 0;
  const seed = `${context.cycleNumber}:${context.variationBlock}:${context.sessionIndex}:${context.slotIndex}:${exercise.id}`;
  return patternScore + muscleScore + roleScore(exercise, slot.role) + focusScore(exercise, context.profile.focus) + visualReadyBonus - reusePenalty + hashUnit(seed) * 5;
}

function chooseExercise(slot, context, selectedIds) {
  // Pattern is a hard constraint. Muscle targets only rank candidates inside the
  // requested pattern; they never justify substituting a different movement.
  const pool = Object.values(exercises).filter((exercise) => (
    !selectedIds.has(exercise.id)
    && slot.patterns.includes(exercise.movementPattern)
    && canPerformExercise(exercise, context.profile)
    && levelAllows(exercise, context.level)
  ));
  if (!pool.length) return null;

  return pool
    .map((exercise) => ({ exercise, score: scoreCandidate(exercise, slot, context) }))
    .sort((a, b) => b.score - a.score || a.exercise.id.localeCompare(b.exercise.id))[0].exercise;
}

export function findExerciseAlternatives({ exerciseId, profile = {}, excludeIds = [], limit = 6 } = {}) {
  const current = exercises[exerciseId];
  if (!current?.productionReady) return [];

  const excluded = new Set([exerciseId, ...(Array.isArray(excludeIds) ? excludeIds : [])]);
  const currentGroups = new Set(current.muscleGroups || []);
  const currentRank = LEVEL_RANK[current.difficulty] || 1;

  return Object.values(exercises)
    .filter((candidate) => (
      !excluded.has(candidate.id)
      && candidate.productionReady
      && candidate.movementPattern === current.movementPattern
      && canPerformExercise(candidate, profile)
      && levelAllows(candidate, profile.level || "beginner")
    ))
    .map((candidate) => {
      const overlap = (candidate.muscleGroups || []).filter((muscle) => currentGroups.has(muscle)).length;
      const candidateRank = LEVEL_RANK[candidate.difficulty] || 1;
      const score =
        (candidate.primaryMuscle === current.primaryMuscle ? 40 : 0)
        + overlap * 9
        + (candidate.exerciseType === current.exerciseType ? 16 : 0)
        + (candidate.laterality === current.laterality ? 8 : 0)
        + (candidate.visualReady ? 8 : 0)
        - Math.abs(candidateRank - currentRank) * 5;
      return { candidate, score, overlap };
    })
    .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id))
    .slice(0, clamp(Number(limit) || 6, 1, 8))
    .map(({ candidate, overlap }) => ({
      id: candidate.id,
      name: candidate.name,
      muscle: candidate.muscle,
      primaryMuscle: candidate.primaryMuscle,
      movementPattern: candidate.movementPattern,
      exerciseType: candidate.exerciseType,
      laterality: candidate.laterality,
      difficulty: candidate.difficulty,
      unit: candidate.unit,
      rest: candidate.rest,
      visual: candidate.visual || null,
      visualReady: Boolean(candidate.visualReady && candidate.visual),
      muscleOverlap: overlap,
      reason: overlap > 0
        ? "Та же механика движения и близкая мышечная задача"
        : "Та же механика движения и совместимое оборудование"
    }));
}

function baseSets(level, goal, role) {
  const primary = level === "advanced" ? 4 : level === "intermediate" ? 3 : 2;
  let sets = role === "primary" ? primary : Math.max(2, primary - 1);
  if (goal === "strength" && role === "primary") sets += 1;
  if (goal === "return") sets = Math.min(sets, 2);
  return clamp(sets, 2, 5);
}

function allocateSetBudget(chosen, level, goal, weekRule) {
  const base = chosen.map(({ slot }) => baseSets(level, goal, slot.role));
  const totalBase = base.reduce((sum, value) => sum + value, 0);
  if (!totalBase) return [];

  // Volume is prescribed at the workout level, then distributed across exercises.
  // This avoids the large jumps caused by adding/removing a set on every exercise.
  const targetTotal = clamp(Math.round(totalBase * weekRule.volume), chosen.length, chosen.length * 5);
  const result = [...base];
  const floorFor = (role) => (weekRule.phase === "deload" ? 1 : role === "primary" ? 2 : 1);
  const addPriority = { primary: 0, secondary: 1, accessory: 2, core: 3 };
  const removePriority = { accessory: 0, core: 1, secondary: 2, primary: 3 };

  let current = result.reduce((sum, value) => sum + value, 0);
  if (current < targetTotal) {
    const order = chosen
      .map(({ slot }, index) => ({ index, role: slot.role }))
      .sort((a, b) => (addPriority[a.role] ?? 9) - (addPriority[b.role] ?? 9) || a.index - b.index);
    while (current < targetTotal) {
      let changed = false;
      for (const item of order) {
        if (current >= targetTotal) break;
        if (result[item.index] >= 5) continue;
        result[item.index] += 1;
        current += 1;
        changed = true;
      }
      if (!changed) break;
    }
  } else if (current > targetTotal) {
    const order = chosen
      .map(({ slot }, index) => ({ index, role: slot.role }))
      .sort((a, b) => (removePriority[a.role] ?? 9) - (removePriority[b.role] ?? 9) || b.index - a.index);
    while (current > targetTotal) {
      let changed = false;
      for (const item of order) {
        if (current <= targetTotal) break;
        const floor = floorFor(item.role);
        if (result[item.index] <= floor) continue;
        result[item.index] -= 1;
        current -= 1;
        changed = true;
      }
      if (!changed) break;
    }
  }

  return result;
}

function repRangeFor(goal, exercise, phase) {
  if (exercise.unit === "сек.") {
    if (phase === "deload") return { min: 20, max: 30, label: "20–30 сек." };
    return { min: 25, max: 45, label: "25–45 сек." };
  }
  if (exercise.exerciseType === "core") return { min: 6, max: 12, label: "6–12/сторона" };

  const primary = exercise.exerciseType === "compound";
  const isolation = ["isolation", "accessory"].includes(exercise.exerciseType);
  const ranges = {
    strength: primary ? [3, 6] : isolation ? [8, 12] : [6, 10],
    muscle: primary ? [6, 10] : isolation ? [12, 20] : [8, 12],
    fat_loss: primary ? [8, 12] : [12, 18],
    wellness: primary ? [8, 12] : [10, 15],
    endurance: primary ? [12, 18] : [15, 25],
    functional: primary ? [6, 12] : [10, 16],
    posture: primary ? [8, 12] : [12, 20],
    return: [8, 12]
  };
  let [min, max] = ranges[goal] || ranges.wellness;

  if (phase === "adaptation") {
    min += 2;
    max += 2;
  } else if (phase === "intensity" || phase === "peak") {
    if (primary) {
      min = Math.max(3, min - 2);
      max = Math.max(min + 2, max - 2);
    }
  } else if (phase === "deload") {
    min = Math.max(5, min);
    max = Math.max(min + 3, max);
  }
  return { min, max, label: `${min}–${max}` };
}

function chooseRest(goal, exercise, role, phase) {
  let rest = GOALS[goal]?.baseRest || 90;
  if (exercise.exerciseType === "isolation" || role === "accessory" || role === "core") rest = Math.min(rest, 75);
  if (goal === "strength" && role === "primary") rest = 180;
  if (phase === "peak" && role === "primary") rest += 30;
  return clamp(Math.round(rest / 15) * 15, 45, 240);
}

function roundLoad(value, increment = 0.5) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.max(increment, Math.round(value / increment) * increment);
}

function estimateStartingLoad(profile, exercise) {
  if (exercise.unit !== "кг" || !canUseExternalLoad(exercise, profile)) return 0;
  const weight = Number(profile.weight) || 65;
  const levelFactor = profile.level === "advanced" ? 0.24 : profile.level === "intermediate" ? 0.17 : 0.1;
  const patternFactor = {
    squat: 0.8,
    hip_hinge: 1,
    hip_extension: 0.95,
    unilateral_knee_dominant: 0.5,
    horizontal_push: 0.35,
    vertical_push: 0.3,
    horizontal_pull: 0.45,
    vertical_pull: 0.5,
    scapular_pull: 0.25,
    horizontal_abduction: 0.2,
    shoulder_abduction: 0.16,
    hip_abduction: 0.22,
    plantar_flexion: 0.35,
    anti_extension: 0
  }[exercise.movementPattern] ?? 0.3;
  const ageFactor = Number(profile.age) >= 60 ? 0.88 : Number(profile.age) >= 50 ? 0.94 : 1;
  return roundLoad(weight * levelFactor * patternFactor * ageFactor, exercise.exerciseType === "isolation" ? 0.5 : 1);
}

function buildWorkout({ sessionKey, sessionIndex, dayIndex, weekRule, profile, goal, level, cycleNumber, usedInWeek }) {
  const blueprint = SESSION_LIBRARY[sessionKey] || SESSION_LIBRARY.full_a;
  const duration = Number(profile.duration) || 45;
  const maxExercises = duration <= 35 ? 4 : 5;
  const selectedIds = new Set();
  const chosen = [];
  const missingRequiredSlots = [];
  const orderedSlots = [
    ...blueprint.slots.map((slot, slotIndex) => ({ slot, slotIndex })).filter(({ slot }) => slot.required),
    ...blueprint.slots.map((slot, slotIndex) => ({ slot, slotIndex })).filter(({ slot }) => !slot.required)
  ];

  for (const { slot, slotIndex } of orderedSlots) {
    if (chosen.length >= maxExercises) {
      if (slot.required) missingRequiredSlots.push({ slotIndex, role: slot.role, patterns: slot.patterns, targets: slot.targets, reason: "duration_capacity" });
      continue;
    }
    const exercise = chooseExercise(slot, {
      profile,
      goal,
      level,
      cycleNumber,
      variationBlock: weekRule.variationBlock,
      sessionIndex,
      slotIndex,
      usedInWeek
    }, selectedIds);
    if (!exercise) {
      if (slot.required) missingRequiredSlots.push({ slotIndex, role: slot.role, patterns: slot.patterns, targets: slot.targets, reason: "no_compatible_exercise" });
      continue;
    }
    selectedIds.add(exercise.id);
    usedInWeek.set(exercise.id, (usedInWeek.get(exercise.id) || 0) + 1);
    chosen.push({ exercise, slot, slotIndex });
  }

  const setBudget = allocateSetBudget(chosen, level, goal, weekRule);
  const exercisesForWorkout = chosen.map(({ exercise, slot, slotIndex }, exerciseIndex) => {
    const reps = repRangeFor(goal, exercise, weekRule.phase);
    const sets = setBudget[exerciseIndex] ?? baseSets(level, goal, slot.role);
    const suggestedWeight = estimateStartingLoad({ ...profile, level }, exercise);
    const externalLoadAvailable = canUseExternalLoad(exercise, profile);
    const plannedWeight = exercise.unit === "кг" && externalLoadAvailable ? roundLoad(suggestedWeight * weekRule.intensity, exercise.exerciseType === "isolation" ? 0.5 : 1) : 0;

    return {
      id: exercise.id,
      order: exerciseIndex + 1,
      slotIndex,
      name: exercise.name,
      muscle: exercise.muscle,
      movementPattern: exercise.movementPattern,
      exerciseType: exercise.exerciseType,
      sets,
      target: reps.label,
      repRange: { min: reps.min, max: reps.max },
      rest: chooseRest(goal, exercise, slot.role, weekRule.phase),
      suggestedWeight,
      plannedWeight,
      loadMode: exercise.unit === "кг" ? (externalLoadAvailable ? "external" : "bodyweight") : "none",
      loadMultiplier: weekRule.intensity,
      unit: exercise.unit,
      rpeTarget: weekRule.rpe,
      role: slot.role
    };
  });

  return {
    id: `c${cycleNumber}-w${weekRule.week}-d${sessionIndex + 1}`,
    dayIndex,
    dayName: DAY_NAMES[dayIndex],
    title: blueprint.title,
    duration,
    focus: blueprint.focus,
    focusKey: sessionKey,
    accent: blueprint.accent,
    phase: weekRule.phase,
    phaseLabel: weekRule.phaseLabel,
    status: "planned",
    coverage: {
      status: missingRequiredSlots.length ? "limited" : "complete",
      requiredSlots: blueprint.slots.filter((slot) => slot.required).length,
      resolvedRequiredSlots: blueprint.slots.filter((slot) => slot.required).length - missingRequiredSlots.length,
      missingRequiredSlots
    },
    exercises: exercisesForWorkout
  };
}

function normalizeTrainingDays(profile, daysPerWeek) {
  const requested = Array.isArray(profile.trainingDays)
    ? [...new Set(profile.trainingDays.map(Number).filter((day) => day >= 0 && day <= 6))]
    : [];
  const defaults = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 2, 4, 5]
  }[daysPerWeek];
  const result = requested.slice(0, daysPerWeek);
  for (const day of defaults) {
    if (result.length >= daysPerWeek) break;
    if (!result.includes(day)) result.push(day);
  }
  return result.sort((a, b) => a - b);
}

const COVERAGE_GROUPS = Object.freeze({
  knee_dominant: { label: "Коленно-доминантное движение", patterns: ["squat", "unilateral_knee_dominant"] },
  hip_dominant: { label: "Тазобедренное разгибание / hinge", patterns: ["hip_hinge", "hip_extension"] },
  push: { label: "Жим верхней части тела", patterns: ["horizontal_push", "vertical_push"] },
  pull: { label: "Тяга верхней части тела", patterns: ["horizontal_pull", "vertical_pull"] },
  posterior_shoulder: { label: "Лопатки / задняя дельта", patterns: ["scapular_pull", "horizontal_abduction"] },
  core: { label: "Стабилизация корпуса", patterns: ["anti_extension", "anti_rotation", "anti_lateral_flexion"] }
});

function requiredCoverageGroups(profile = {}) {
  if (profile.focus === "glutes") return ["knee_dominant", "hip_dominant"];
  if (profile.focus === "upper") return ["push", "pull"];
  if (profile.focus === "posture" || profile.goal === "posture") return ["pull", "posterior_shoulder", "core"];
  return ["knee_dominant", "hip_dominant", "push", "pull"];
}

function equipmentSuggestionsForPatterns(patterns, profile, level) {
  const available = normalizeEquipment(profile);
  const suggestions = new Set();
  for (const exercise of Object.values(exercises)) {
    if (!exercise.productionReady || !levelAllows(exercise, level)) continue;
    if (!patterns.includes(exercise.movementPattern)) continue;
    for (const option of exercise.requiredEquipmentOptions || []) {
      const missing = option.filter((item) => !available.has(item));
      if (missing.length === 1) suggestions.add(missing[0]);
    }
  }
  return [...suggestions].sort();
}

function summarizeWeekPrescription(workouts = []) {
  const entries = workouts.flatMap((workout) => workout.exercises || []);
  const totalSets = entries.reduce((sum, entry) => sum + Number(entry.sets || 0), 0);
  const avgRpeTarget = entries.length ? entries.reduce((sum, entry) => sum + Number(entry.rpeTarget || 0), 0) / entries.length : 0;
  const avgRest = entries.length ? entries.reduce((sum, entry) => sum + Number(entry.rest || 0), 0) / entries.length : 0;
  const avgRepMin = entries.length ? entries.reduce((sum, entry) => sum + Number(entry.repRange?.min || 0), 0) / entries.length : 0;
  const avgRepMax = entries.length ? entries.reduce((sum, entry) => sum + Number(entry.repRange?.max || 0), 0) / entries.length : 0;
  return {
    totalSets,
    avgRpeTarget: Math.round(avgRpeTarget * 10) / 10,
    avgRest: Math.round(avgRest),
    avgRepMin: Math.round(avgRepMin * 10) / 10,
    avgRepMax: Math.round(avgRepMax * 10) / 10
  };
}

function evaluatePlanCoverage(weeks, profile, level) {
  const requirements = requiredCoverageGroups(profile);
  const weekly = weeks.map((week) => {
    const patterns = new Set((week.workouts || []).flatMap((workout) => (workout.exercises || []).map((exercise) => exercise.movementPattern)));
    const missingGroups = requirements.filter((groupId) => !COVERAGE_GROUPS[groupId].patterns.some((pattern) => patterns.has(pattern)));
    const missingRequiredSlots = (week.workouts || []).flatMap((workout) => (workout.coverage?.missingRequiredSlots || []).map((slot) => ({ workoutId: workout.id, focusKey: workout.focusKey, ...slot })));
    return { week: week.week, missingGroups, missingRequiredSlots };
  });
  const missingGroups = [...new Set(weekly.flatMap((week) => week.missingGroups))];
  const missingRequiredSlots = weekly.flatMap((week) => week.missingRequiredSlots);
  const suggestions = Object.fromEntries(missingGroups.map((groupId) => [groupId, equipmentSuggestionsForPatterns(COVERAGE_GROUPS[groupId].patterns, profile, level)]));
  const status = missingGroups.length || missingRequiredSlots.length ? "limited" : "complete";
  return {
    status,
    requiredGroups: requirements.map((id) => ({ id, ...COVERAGE_GROUPS[id] })),
    missingGroups: missingGroups.map((id) => ({ id, ...COVERAGE_GROUPS[id], equipmentSuggestions: suggestions[id] })),
    missingRequiredSlotCount: missingRequiredSlots.length,
    weekly
  };
}

export function generatePlan(profile = {}, options = {}) {
  const goal = GOALS[profile.goal] ? profile.goal : "wellness";
  const daysPerWeek = clamp(Number(profile.daysPerWeek) || 3, 2, 5);
  const level = LEVEL_RANK[profile.level] ? profile.level : "beginner";
  const cycleNumber = clamp(Number(options.cycleNumber) || 1, 1, 999);
  const preferredDays = normalizeTrainingDays(profile, daysPerWeek);
  const scheme = selectProgramScheme({ ...profile, goal, daysPerWeek });

  const weeks = WEEK_RULES.map((weekRule) => {
    const usedInWeek = new Map();
    const workouts = preferredDays.map((dayIndex, sessionIndex) => buildWorkout({
      sessionKey: scheme.sessions[sessionIndex % scheme.sessions.length],
      sessionIndex,
      dayIndex,
      weekRule,
      profile,
      goal,
      level,
      cycleNumber,
      usedInWeek
    }));
    return {
      week: weekRule.week,
      phase: weekRule.phase,
      phaseLabel: weekRule.phaseLabel,
      volumeMultiplier: weekRule.volume,
      intensityMultiplier: weekRule.intensity,
      rpeTarget: weekRule.rpe,
      variationBlock: weekRule.variationBlock,
      prescription: summarizeWeekPrescription(workouts),
      workouts
    };
  });

  const coverage = evaluatePlanCoverage(weeks, profile, level);
  const workouts = clone(weeks[0].workouts);
  if (workouts[0]) workouts[0].status = "today";

  return {
    id: `plan-c${cycleNumber}-${Date.now()}`,
    planRevision: PLAN_REVISION,
    createdAt: new Date().toISOString(),
    goal,
    goalLabel: GOALS[goal].label,
    schemeId: scheme.id,
    schemeLabel: scheme.label,
    cycleNumber,
    cycleWeeks: CYCLE_WEEKS,
    week: 1,
    daysPerWeek,
    coverage,
    summary: `${scheme.label} · ${daysPerWeek} тренировки в неделю · ${Number(profile.duration) || 45} минут · 8-недельная периодизация`,
    rules: [
      "Двигательный паттерн — жёсткое ограничение: упражнение не подменяется другим движением только из-за совпадения мышцы.",
      "Если обязательный паттерн нельзя закрыть доступным оборудованием, план явно помечается как ограниченный, а не маскирует пропуск fallback-ом.",
      "Вариации меняются блоками каждые 2–3 недели; основные паттерны сохраняются для отслеживания прогресса.",
      "Объём и RPE меняются по фазам: адаптация → объём → интенсивность → тяжёлый блок → разгрузка.",
      "Double progression: сначала повторения в заданном диапазоне, затем небольшой шаг нагрузки.",
      "Боль имеет приоритет над прогрессией: болезненное движение не продавливается через силу."
    ],
    weeks,
    workouts
  };
}

function parseTargetRange(entry = {}) {
  if (entry.repRange && Number(entry.repRange.min) > 0 && Number(entry.repRange.max) >= Number(entry.repRange.min)) {
    return { min: Number(entry.repRange.min), max: Number(entry.repRange.max) };
  }
  const numbers = String(entry.target || "").match(/\d+(?:[.,]\d+)?/g)?.map((value) => Number(value.replace(",", "."))) || [];
  if (numbers.length >= 2) return { min: numbers[0], max: numbers[1] };
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
  return { min: 8, max: 12 };
}

function loadIncrement(entry) {
  if (entry.exerciseType === "isolation" || ["shoulder_abduction", "horizontal_abduction", "scapular_pull"].includes(entry.movementPattern)) return 0.5;
  if (["squat", "hip_hinge", "hip_extension"].includes(entry.movementPattern)) return 2;
  return 1;
}

function historyForExercise(history, exerciseId) {
  return (Array.isArray(history) ? history : [])
    .flatMap((log) => Array.isArray(log.entries) ? log.entries : [])
    .filter((entry) => entry.exerciseId === exerciseId)
    .slice(-3);
}

function analyzeEntry(entry, globalContext) {
  const sets = Array.isArray(entry.sets) && entry.sets.length
    ? entry.sets
    : [{ weight: entry.weight, reps: entry.reps, done: entry.completed !== false }];
  const completedSets = sets.filter((set) => set.done !== false);
  const range = parseTargetRange(entry);
  const rpe = Number(entry.rpe) || 7;
  const pain = Number(entry.pain || 0);
  const currentBaseWeight = Number(entry.baseWeight ?? entry.weight) || 0;
  const currentWorkingWeight = completedSets.length
    ? Math.max(...completedSets.map((set) => Number(set.weight) || 0))
    : Number(entry.weight) || 0;
  const reps = completedSets.map((set) => Number(set.reps) || 0);
  const allAtTop = completedSets.length > 0 && completedSets.length === sets.length && reps.every((value) => value >= range.max);
  const allAtLeastMin = completedSets.length > 0 && completedSets.length === sets.length && reps.every((value) => value >= range.min);
  const belowMin = reps.some((value) => value > 0 && value < range.min) || completedSets.length < sets.length;
  const recent = historyForExercise(globalContext.history, entry.exerciseId);
  const repeatedHard = recent.slice(-2).length === 2 && recent.slice(-2).every((item) => Number(item.rpe) >= 9);

  let strategy = "maintain";
  let action = "Оставить вес";
  let nextWeight = currentBaseWeight || currentWorkingWeight;
  let note = "Сохрани вес и улучши стабильность повторений.";

  if (pain >= 5 || entry.painFlag) {
    strategy = "replace";
    action = "Снизить / заменить";
    nextWeight = currentBaseWeight > 0 ? roundLoad(currentBaseWeight * 0.85, 0.5) : 0;
    note = "Боль имеет приоритет: останови болезненное движение и используй безболезненную альтернативу.";
  } else if (globalContext.readiness < 45 || rpe >= 9.5 || repeatedHard) {
    strategy = "reduce";
    action = "Снизить нагрузку";
    nextWeight = currentBaseWeight > 0 ? roundLoad(currentBaseWeight * 0.92, 0.5) : 0;
    note = "Усталость или усилие слишком высокие. Снизь нагрузку и верни запас повторений.";
  } else if (allAtTop && rpe <= 8 && globalContext.readiness >= 60) {
    if (entry.unit === "кг" && currentBaseWeight > 0) {
      strategy = "increase_load";
      action = "Добавить вес";
      const increment = loadIncrement(entry);
      nextWeight = roundLoad(currentBaseWeight + increment, increment);
      note = `Верхняя граница выполнена во всех подходах при RPE ${rpe}. Следующий шаг — небольшой рост нагрузки.`;
    } else {
      strategy = "increase_difficulty";
      action = "Усложнить";
      note = "Верхняя граница выполнена уверенно. Увеличь время/амплитуду или перейди к более сложной вариации.";
    }
  } else if (allAtLeastMin && !belowMin) {
    strategy = "add_reps";
    action = "Добавить повторения";
    note = `Вес сохраняем. Цель — приблизить каждый подход к ${range.max} повторениям без роста RPE.`;
  } else if (belowMin) {
    strategy = "maintain";
    action = "Закрепить";
    note = `Не повышай вес: сначала верни все рабочие подходы минимум к ${range.min} повторениям.`;
  }

  return {
    exerciseId: entry.exerciseId,
    name: entry.name,
    strategy,
    action,
    nextWeight,
    unit: entry.unit || "кг",
    targetRange: range,
    note
  };
}

export function analyzeWorkout(payload = {}) {
  const entries = Array.isArray(payload.entries) ? payload.entries : [];
  const sleep = clamp(Number(payload.readiness?.sleep ?? 7), 1, 10);
  const energy = clamp(Number(payload.readiness?.energy ?? 7), 1, 10);
  const mood = clamp(Number(payload.readiness?.mood ?? 7), 1, 10);
  const readiness = Math.round(((sleep + energy + mood) / 30) * 100);
  const pain = entries.some((entry) => Number(entry.pain || 0) >= 5 || entry.painFlag);
  const avgRpe = entries.length
    ? entries.reduce((sum, entry) => sum + (Number(entry.rpe) || 7), 0) / entries.length
    : 7;
  const completionFractions = entries.map((entry) => {
    if (Array.isArray(entry.sets) && entry.sets.length) return entry.sets.filter((set) => set.done !== false).length / entry.sets.length;
    return entry.completed === false ? 0 : 1;
  });
  const completion = completionFractions.length
    ? completionFractions.reduce((sum, value) => sum + value, 0) / completionFractions.length
    : 0;

  const recommendations = entries.map((entry) => analyzeEntry(entry, {
    readiness,
    history: payload.history || []
  }));

  const counts = recommendations.reduce((acc, item) => {
    acc[item.strategy] = (acc[item.strategy] || 0) + 1;
    return acc;
  }, {});

  let state = "maintain";
  let headline = "Закрепляем рабочий уровень";
  let summary = "Вес не форсируем: улучшаем повторения, технику и запас до следующего шага.";

  if (pain) {
    state = "reduce";
    headline = "Сначала убираем болезненное движение";
    summary = "В журнале отмечена боль. Прогрессия для проблемного движения остановлена до безболезненной замены или оценки причины.";
  } else if (readiness < 45 || avgRpe >= 9 || completion < 0.7 || (counts.reduce || 0) >= Math.ceil(entries.length / 2)) {
    state = "deload";
    headline = "Нагрузку лучше облегчить";
    summary = "Восстановление, RPE или завершённость подходов показывают, что сейчас полезнее вернуть запас, а не добавлять нагрузку.";
  } else if ((counts.increase_load || 0) + (counts.increase_difficulty || 0) > 0) {
    state = "progress";
    headline = "Есть основания прогрессировать";
    summary = "Только упражнения, где достигнута верхняя граница повторений при допустимом RPE, получают следующий шаг нагрузки.";
  } else if ((counts.add_reps || 0) > 0) {
    state = "reps";
    headline = "Следующий шаг — повторения";
    summary = "Double progression работает: вес остаётся прежним, пока подходы не дойдут до верхней границы диапазона.";
  }

  const volume = entries.reduce((total, entry) => {
    const sets = Array.isArray(entry.sets) ? entry.sets : [];
    return total + sets.filter((set) => set.done !== false).reduce((sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0);
  }, 0);

  return {
    createdAt: new Date().toISOString(),
    state,
    headline,
    summary,
    metrics: {
      completion: Math.round(completion * 100),
      avgRpe: Number(avgRpe.toFixed(1)),
      readiness,
      volume: Math.round(volume)
    },
    recommendations,
    safety: pain
      ? "При острой, нарастающей или необычной боли тренировку следует прекратить и обратиться к квалифицированному специалисту."
      : "Умеренная мышечная усталость допустима; резкая суставная, простреливающая или неврологическая боль — нет."
  };
}
