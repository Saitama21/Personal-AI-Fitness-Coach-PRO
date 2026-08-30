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

export function canPerformExercise(exercise, profile = {}) {
  if (!exercise?.productionReady || !exercise.visualReady) return false;
  const available = normalizeEquipment(profile);
  const options = Array.isArray(exercise.requiredEquipmentOptions) ? exercise.requiredEquipmentOptions : [["bodyweight"]];
  return options.some((option) => option.every((required) => available.has(required)));
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
  const seed = `${context.cycleNumber}:${context.variationBlock}:${context.sessionIndex}:${context.slotIndex}:${exercise.id}`;
  return patternScore + muscleScore + roleScore(exercise, slot.role) + focusScore(exercise, context.profile.focus) - reusePenalty + hashUnit(seed) * 5;
}

function chooseExercise(slot, context, selectedIds) {
  const all = Object.values(exercises).filter((exercise) => (
    !selectedIds.has(exercise.id)
    && canPerformExercise(exercise, context.profile)
    && levelAllows(exercise, context.level)
  ));

  const exact = all.filter((exercise) => slot.patterns.includes(exercise.movementPattern));
  const targetPool = all.filter((exercise) => (slot.targets || []).some((target) => (
    exercise.primaryMuscle === target || (exercise.muscleGroups || []).includes(target)
  )));
  const pool = exact.length ? exact : targetPool;
  if (!pool.length) return null;

  return pool
    .map((exercise) => ({ exercise, score: scoreCandidate(exercise, slot, context) }))
    .sort((a, b) => b.score - a.score || a.exercise.id.localeCompare(b.exercise.id))[0].exercise;
}

function baseSets(level, goal, role) {
  const levelBase = level === "advanced" ? 4 : level === "intermediate" ? 3 : 2;
  let sets = levelBase;
  if (role === "accessory" || role === "core") sets = Math.max(2, levelBase - 1);
  if (goal === "strength" && role === "primary") sets += 1;
  if (goal === "return") sets = Math.min(sets, 2);
  return clamp(sets, 2, 5);
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
  if (exercise.unit !== "кг") return 0;
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

  for (let slotIndex = 0; slotIndex < blueprint.slots.length && chosen.length < maxExercises; slotIndex += 1) {
    const slot = blueprint.slots[slotIndex];
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
    if (!exercise) continue;
    selectedIds.add(exercise.id);
    usedInWeek.set(exercise.id, (usedInWeek.get(exercise.id) || 0) + 1);
    chosen.push({ exercise, slot });
  }

  const exercisesForWorkout = chosen.map(({ exercise, slot }, exerciseIndex) => {
    const reps = repRangeFor(goal, exercise, weekRule.phase);
    const rawSets = baseSets(level, goal, slot.role) * weekRule.volume;
    const sets = clamp(Math.round(rawSets), weekRule.phase === "deload" ? 1 : 2, 5);
    const suggestedWeight = estimateStartingLoad({ ...profile, level }, exercise);
    const plannedWeight = exercise.unit === "кг" ? roundLoad(suggestedWeight * weekRule.intensity, exercise.exerciseType === "isolation" ? 0.5 : 1) : 0;

    return {
      id: exercise.id,
      order: exerciseIndex + 1,
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
      workouts
    };
  });

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
    summary: `${scheme.label} · ${daysPerWeek} тренировки в неделю · ${Number(profile.duration) || 45} минут · 8-недельная периодизация`,
    rules: [
      "Конкретные упражнения выбираются по двигательному паттерну, целевым мышцам, уровню и доступному оборудованию.",
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
