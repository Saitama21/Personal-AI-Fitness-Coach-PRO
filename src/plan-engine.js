import { exercises } from "./exercises.js";

const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const CYCLE_WEEKS = 8;
const ROTATION_WEEKS = 2;
const PLAN_REVISION = 2;

const goals = {
  strength: "Рост силы",
  muscle: "Набор мышц",
  fat_loss: "Снижение веса",
  wellness: "Тонус и самочувствие"
};

const focusMeta = {
  lower_endurance: {
    title: "Ноги + выносливость",
    focus: "Сила ног · устойчивость · рабочая выносливость",
    accent: "legs"
  },
  glute_volume: {
    title: "Ягодицы + объём",
    focus: "Ягодицы · задняя цепь · объём",
    accent: "glutes"
  },
  upper_pull: {
    title: "Спина + осанка",
    focus: "Тяги · задняя дельта · контроль лопаток",
    accent: "back"
  },
  upper_push: {
    title: "Верх тела + жим",
    focus: "Грудь · плечи · трицепс",
    accent: "push"
  },
  full_body: {
    title: "Сильное всё тело",
    focus: "Ноги · тяга · жим · кор",
    accent: "full"
  },
  conditioning_core: {
    title: "Кор + мобильность",
    focus: "Кор · стабильность · лёгкая плотность",
    accent: "core"
  }
};

const splitByDays = {
  2: ["full_body", "glute_volume"],
  3: ["lower_endurance", "upper_pull", "glute_volume"],
  4: ["lower_endurance", "upper_pull", "glute_volume", "upper_push"],
  5: ["lower_endurance", "upper_pull", "glute_volume", "upper_push", "conditioning_core"]
};

const rotationPools = {
  lower_endurance: [
    ["goblet_squat", "reverse_lunge", "step_up", "calf_raise", "dead_bug"],
    ["split_squat", "goblet_squat", "step_up", "calf_raise", "plank"],
    ["reverse_lunge", "step_up", "goblet_squat", "calf_raise", "dead_bug"],
    ["goblet_squat", "split_squat", "reverse_lunge", "calf_raise", "plank"]
  ],
  glute_volume: [
    ["hip_thrust", "romanian_deadlift", "glute_bridge", "leg_abduction", "back_extension"],
    ["romanian_deadlift", "hip_thrust", "split_squat", "leg_abduction", "glute_bridge"],
    ["hip_thrust", "back_extension", "reverse_lunge", "leg_abduction", "romanian_deadlift"],
    ["glute_bridge", "romanian_deadlift", "hip_thrust", "leg_abduction", "back_extension"]
  ],
  upper_pull: [
    ["dumbbell_row", "face_pull", "rear_delt_fly", "dead_bug", "plank"],
    ["rear_delt_fly", "dumbbell_row", "face_pull", "plank", "dead_bug"],
    ["face_pull", "dumbbell_row", "rear_delt_fly", "dead_bug", "plank"],
    ["dumbbell_row", "rear_delt_fly", "face_pull", "plank", "dead_bug"]
  ],
  upper_push: [
    ["incline_pushup", "lateral_raise", "rear_delt_fly", "dead_bug", "plank"],
    ["incline_pushup", "rear_delt_fly", "lateral_raise", "plank", "dead_bug"],
    ["lateral_raise", "incline_pushup", "rear_delt_fly", "dead_bug", "plank"],
    ["incline_pushup", "lateral_raise", "rear_delt_fly", "plank", "dead_bug"]
  ],
  full_body: [
    ["goblet_squat", "incline_pushup", "dumbbell_row", "romanian_deadlift", "dead_bug"],
    ["split_squat", "incline_pushup", "rear_delt_fly", "glute_bridge", "plank"],
    ["step_up", "incline_pushup", "dumbbell_row", "hip_thrust", "dead_bug"],
    ["reverse_lunge", "incline_pushup", "face_pull", "romanian_deadlift", "plank"]
  ],
  conditioning_core: [
    ["step_up", "incline_pushup", "dead_bug", "calf_raise", "plank"],
    ["reverse_lunge", "dumbbell_row", "plank", "calf_raise", "dead_bug"],
    ["goblet_squat", "incline_pushup", "dead_bug", "step_up", "plank"],
    ["split_squat", "dumbbell_row", "plank", "calf_raise", "dead_bug"]
  ]
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function chooseSets(level, goal, focusKey) {
  const base = level === "beginner" ? 2 : level === "advanced" ? 4 : 3;
  if (focusKey === "glute_volume" && goal === "muscle") return clamp(base + 1, 3, 5);
  if (goal === "strength" && ["full_body", "lower_endurance"].includes(focusKey)) return clamp(base + 1, 3, 5);
  return base;
}

function chooseTarget(exercise, goal, focusKey) {
  if (exercise.pattern === "core") return exercise.defaultReps;
  if (focusKey === "lower_endurance") {
    if (["calf", "abduction"].includes(exercise.pattern)) return "12–20";
    return "10–15";
  }
  if (focusKey === "glute_volume") {
    if (["abduction", "calf"].includes(exercise.pattern)) return "12–15";
    return "8–12";
  }
  if (goal === "strength") return "5–8";
  if (goal === "muscle") return "8–12";
  if (goal === "fat_loss") return "10–15";
  return exercise.defaultReps;
}

function estimateStartingLoad(profile, exercise) {
  if (exercise.unit !== "кг") return 0;
  const weight = Number(profile.weight) || 65;
  const levelFactor = profile.level === "advanced" ? 0.22 : profile.level === "intermediate" ? 0.16 : 0.1;
  const patternFactor = {
    squat: 0.8,
    hinge: 1,
    lunge: 0.5,
    push: 0.35,
    pull: 0.45,
    abduction: 0.22,
    calf: 0.35,
    core: 0
  }[exercise.pattern] ?? 0.3;
  const load = weight * levelFactor * patternFactor;
  return Math.max(2, Math.round(load / 2) * 2);
}

function equipmentAllows(exercise, equipment = []) {
  const selected = new Set(equipment);
  if (!selected.size || selected.has("gym")) return true;
  const tags = exercise.equipment || [];
  if (selected.has("home")) return tags.includes("home") || tags.includes("bodyweight") || tags.includes("dumbbells");
  return tags.some((tag) => selected.has(tag));
}

function pickExercises(focusKey, variantIndex, profile, maxExercises) {
  const variants = rotationPools[focusKey] || rotationPools.full_body;
  const preferred = variants[variantIndex % variants.length];
  const fallback = [...new Set(variants.flat())];
  const result = [];

  for (const id of [...preferred, ...fallback]) {
    const exercise = exercises[id];
    if (!exercise || result.includes(id) || !equipmentAllows(exercise, profile.equipment)) continue;
    result.push(id);
    if (result.length >= maxExercises) break;
  }

  if (result.length < Math.min(4, maxExercises)) {
    for (const id of preferred) {
      if (!result.includes(id) && exercises[id]) result.push(id);
      if (result.length >= maxExercises) break;
    }
  }

  return result.slice(0, maxExercises);
}

function buildWorkout({ focusKey, dayIndex, workoutIndex, blockIndex, profile, goal, level, cycleNumber }) {
  const maxExercises = Number(profile.duration) <= 35 ? 4 : 5;
  const variantIndex = (blockIndex + Math.max(0, cycleNumber - 1)) % 4;
  const ids = pickExercises(focusKey, variantIndex, profile, maxExercises);
  const meta = focusMeta[focusKey] || focusMeta.full_body;
  const sets = chooseSets(level, goal, focusKey);

  return {
    id: `cycle${cycleNumber}-block${blockIndex + 1}-day${workoutIndex + 1}`,
    dayIndex,
    dayName: DAY_NAMES[dayIndex],
    title: meta.title,
    duration: Number(profile.duration) || 45,
    focus: meta.focus,
    focusKey,
    accent: meta.accent,
    status: "planned",
    exercises: ids.map((id, exerciseIndex) => {
      const exercise = exercises[id];
      return {
        id,
        order: exerciseIndex + 1,
        name: exercise.name,
        muscle: exercise.muscle,
        sets,
        target: chooseTarget(exercise, goal, focusKey),
        rest: exercise.rest,
        suggestedWeight: estimateStartingLoad({ ...profile, level }, exercise),
        unit: exercise.unit,
        rpeTarget: goal === "strength" ? 8 : focusKey === "lower_endurance" ? 7 : 7
      };
    })
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function generatePlan(profile = {}, options = {}) {
  const goal = goals[profile.goal] ? profile.goal : "wellness";
  const daysPerWeek = clamp(Number(profile.daysPerWeek) || 3, 2, 5);
  const level = ["beginner", "intermediate", "advanced"].includes(profile.level) ? profile.level : "beginner";
  const cycleNumber = clamp(Number(options.cycleNumber) || 1, 1, 999);
  const preferredDays = Array.isArray(profile.trainingDays) && profile.trainingDays.length
    ? profile.trainingDays.slice(0, daysPerWeek)
    : [0, 2, 4, 6, 1].slice(0, daysPerWeek);
  const split = splitByDays[daysPerWeek] || splitByDays[3];

  const rotations = Array.from({ length: CYCLE_WEEKS / ROTATION_WEEKS }, (_, blockIndex) => {
    const workouts = preferredDays.map((dayIndex, workoutIndex) => buildWorkout({
      focusKey: split[workoutIndex % split.length],
      dayIndex,
      workoutIndex,
      blockIndex,
      profile,
      goal,
      level,
      cycleNumber
    }));

    return {
      block: blockIndex + 1,
      weeks: [blockIndex * ROTATION_WEEKS + 1, blockIndex * ROTATION_WEEKS + 2],
      label: `Недели ${blockIndex * ROTATION_WEEKS + 1}–${blockIndex * ROTATION_WEEKS + 2}`,
      workouts
    };
  });

  const workouts = clone(rotations[0].workouts);
  if (workouts[0]) workouts[0].status = "today";

  return {
    id: `plan-c${cycleNumber}-${Date.now()}`,
    planRevision: PLAN_REVISION,
    createdAt: new Date().toISOString(),
    goal,
    goalLabel: goals[goal],
    cycleNumber,
    cycleWeeks: CYCLE_WEEKS,
    rotationEveryWeeks: ROTATION_WEEKS,
    rotationBlocks: rotations.length,
    rotationIndex: 0,
    week: 1,
    daysPerWeek,
    summary: `${daysPerWeek} тренировки в неделю · ${Number(profile.duration) || 45} минут · смена упражнений каждые ${ROTATION_WEEKS} недели`,
    rules: [
      "Упражнения меняются блоками каждые две недели, но двигательные паттерны сохраняются.",
      "Полный восьминедельный цикл обновляется после завершения восьмой недели.",
      "Вес повышается только после уверенного выполнения верхней границы повторений.",
      "Острая боль — причина остановить упражнение, а не терпеть её."
    ],
    rotations,
    workouts
  };
}

function roundIncrement(value, increment) {
  return Math.round(value / increment) * increment;
}

export function analyzeWorkout(payload = {}) {
  const entries = Array.isArray(payload.entries) ? payload.entries : [];
  const pain = entries.some((entry) => Number(entry.pain || 0) >= 5 || entry.painFlag);
  const avgRpe = entries.length
    ? entries.reduce((sum, entry) => sum + (Number(entry.rpe) || 7), 0) / entries.length
    : 7;
  const completion = entries.length
    ? entries.reduce((sum, entry) => sum + (entry.completed ? 1 : 0), 0) / entries.length
    : 0;
  const sleep = Number(payload.readiness?.sleep ?? 7);
  const energy = Number(payload.readiness?.energy ?? 7);
  const mood = Number(payload.readiness?.mood ?? 7);
  const readiness = Math.round(((sleep + energy + mood) / 30) * 100);

  let state = "maintain";
  let headline = "Нагрузка подобрана нормально";
  let summary = "На следующей тренировке сохраняем рабочие веса и улучшаем качество повторений.";

  if (pain) {
    state = "reduce";
    headline = "Нагрузку нужно снизить";
    summary = "Отмечена боль. Проблемное упражнение лучше убрать до выяснения причины и не выполнять через острую боль.";
  } else if (completion >= 0.9 && avgRpe <= 7.5 && readiness >= 60) {
    state = "progress";
    headline = "Можно прогрессировать";
    summary = "Большая часть работы выполнена уверенно. Увеличиваем вес небольшим шагом или добавляем одно повторение.";
  } else if (avgRpe >= 9 || readiness < 45 || completion < 0.7) {
    state = "deload";
    headline = "Нужна более лёгкая тренировка";
    summary = "Нагрузка или усталость были высокими. Снижаем объём на 10–20% и оставляем запас повторений.";
  }

  const recommendations = entries.map((entry) => {
    const current = Number(entry.weight) || 0;
    const unit = entry.unit || "кг";
    let nextWeight = current;
    let action = "Оставить";

    if (pain || Number(entry.pain || 0) >= 5) {
      nextWeight = roundIncrement(current * 0.85, 0.5);
      action = "Снизить / заменить";
    } else if (state === "progress" && current > 0) {
      const increment = ["squat", "hinge"].includes(entry.pattern) ? 2 : 1;
      nextWeight = roundIncrement(current * 1.04, increment);
      if (nextWeight <= current) nextWeight = current + increment;
      action = "Увеличить";
    } else if (state === "deload" && current > 0) {
      nextWeight = roundIncrement(current * 0.9, 0.5);
      action = "Снизить";
    }

    return {
      exerciseId: entry.exerciseId,
      name: entry.name,
      action,
      nextWeight,
      unit,
      note: action === "Увеличить"
        ? "Выполни нижнюю границу повторений и сохрани технику."
        : action === "Снизить / заменить"
          ? "Не повторяй болезненное движение без оценки причины."
          : "Сначала улучши стабильность и запас повторений."
    };
  });

  return {
    createdAt: new Date().toISOString(),
    state,
    headline,
    summary,
    metrics: {
      completion: Math.round(completion * 100),
      avgRpe: Number(avgRpe.toFixed(1)),
      readiness
    },
    recommendations,
    safety: pain
      ? "При острой, нарастающей или необычной боли тренировку следует прекратить и обратиться к квалифицированному специалисту."
      : "Умеренная мышечная усталость допустима; резкая суставная или неврологическая боль — нет."
  };
}
