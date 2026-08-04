import { exercises } from "./exercises.js";

const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const templates = {
  strength: [
    ["goblet_squat", "incline_pushup", "dumbbell_row", "romanian_deadlift", "dead_bug"],
    ["reverse_lunge", "shoulder_press", "lat_pulldown", "glute_bridge", "plank"],
    ["goblet_squat", "dumbbell_row", "incline_pushup", "romanian_deadlift", "plank"],
    ["reverse_lunge", "lat_pulldown", "shoulder_press", "glute_bridge", "dead_bug"]
  ],
  muscle: [
    ["goblet_squat", "romanian_deadlift", "glute_bridge", "reverse_lunge", "plank"],
    ["incline_pushup", "dumbbell_row", "shoulder_press", "lat_pulldown", "dead_bug"],
    ["reverse_lunge", "glute_bridge", "goblet_squat", "romanian_deadlift", "plank"],
    ["dumbbell_row", "incline_pushup", "lat_pulldown", "shoulder_press", "dead_bug"]
  ],
  fat_loss: [
    ["goblet_squat", "incline_pushup", "dumbbell_row", "glute_bridge", "dead_bug"],
    ["reverse_lunge", "shoulder_press", "lat_pulldown", "romanian_deadlift", "plank"],
    ["goblet_squat", "dumbbell_row", "incline_pushup", "reverse_lunge", "dead_bug"],
    ["romanian_deadlift", "shoulder_press", "lat_pulldown", "glute_bridge", "plank"]
  ],
  wellness: [
    ["goblet_squat", "incline_pushup", "dumbbell_row", "glute_bridge", "dead_bug"],
    ["reverse_lunge", "lat_pulldown", "romanian_deadlift", "shoulder_press", "plank"],
    ["goblet_squat", "dumbbell_row", "glute_bridge", "incline_pushup", "dead_bug"],
    ["reverse_lunge", "shoulder_press", "lat_pulldown", "romanian_deadlift", "plank"]
  ]
};

const goals = {
  strength: "Рост силы",
  muscle: "Набор мышц",
  fat_loss: "Снижение веса",
  wellness: "Тонус и самочувствие"
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function chooseSets(level, goal) {
  const base = level === "beginner" ? 2 : level === "advanced" ? 4 : 3;
  return goal === "strength" ? clamp(base + 1, 3, 5) : base;
}

function chooseTarget(exercise, goal) {
  if (exercise.pattern === "core") return exercise.defaultReps;
  if (goal === "strength") return "5–8";
  if (goal === "muscle") return "8–12";
  if (goal === "fat_loss") return "10–15";
  return exercise.defaultReps;
}

function estimateStartingLoad(profile, exercise) {
  if (["bodyweight"].some((tag) => exercise.equipment.includes(tag)) && exercise.unit !== "кг") return 0;
  const weight = Number(profile.weight) || 65;
  const levelFactor = profile.level === "advanced" ? 0.22 : profile.level === "intermediate" ? 0.16 : 0.1;
  const patternFactor = {
    squat: 0.8,
    hinge: 1,
    lunge: 0.5,
    push: 0.35,
    pull: 0.45,
    core: 0
  }[exercise.pattern] ?? 0.3;
  const load = weight * levelFactor * patternFactor;
  return Math.max(2, Math.round(load / 2) * 2);
}

function filterByEquipment(ids, equipment = []) {
  const selected = new Set(equipment);
  if (!selected.size) return ids;
  return ids.filter((id) => {
    const tags = exercises[id].equipment;
    if (selected.has("gym")) return true;
    if (selected.has("home")) return tags.includes("home") || tags.includes("bodyweight") || tags.includes("dumbbells");
    return tags.some((tag) => selected.has(tag));
  });
}

export function generatePlan(profile = {}) {
  const goal = templates[profile.goal] ? profile.goal : "wellness";
  const daysPerWeek = clamp(Number(profile.daysPerWeek) || 3, 2, 5);
  const level = ["beginner", "intermediate", "advanced"].includes(profile.level) ? profile.level : "beginner";
  const sets = chooseSets(level, goal);
  const baseTemplates = templates[goal];
  const preferredDays = Array.isArray(profile.trainingDays) && profile.trainingDays.length
    ? profile.trainingDays.slice(0, daysPerWeek)
    : [0, 2, 4, 6, 1].slice(0, daysPerWeek);

  const workouts = preferredDays.map((dayIndex, index) => {
    let ids = filterByEquipment(baseTemplates[index % baseTemplates.length], profile.equipment);
    if (ids.length < 4) ids = baseTemplates[index % baseTemplates.length];
    ids = ids.slice(0, profile.duration <= 35 ? 4 : 5);

    return {
      id: `week1-day${index + 1}`,
      dayIndex,
      dayName: DAY_NAMES[dayIndex],
      title: index % 2 ? "Баланс и спина" : "Сильное всё тело",
      duration: Number(profile.duration) || 45,
      focus: index % 2 ? "Тяга · ноги · кор" : "Присед · жим · задняя цепь",
      status: index === 0 ? "today" : "planned",
      exercises: ids.map((id, exerciseIndex) => {
        const exercise = exercises[id];
        return {
          id,
          order: exerciseIndex + 1,
          name: exercise.name,
          muscle: exercise.muscle,
          sets,
          target: chooseTarget(exercise, goal),
          rest: exercise.rest,
          suggestedWeight: estimateStartingLoad({ ...profile, level }, exercise),
          unit: exercise.unit,
          rpeTarget: goal === "strength" ? 8 : 7
        };
      })
    };
  });

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    goal,
    goalLabel: goals[goal],
    cycleWeeks: 4,
    week: 1,
    daysPerWeek,
    summary: `${daysPerWeek} тренировки в неделю · ${Number(profile.duration) || 45} минут · адаптивная прогрессия`,
    rules: [
      "Вес повышается только после уверенного выполнения верхней границы повторений.",
      "Острая боль — причина остановить упражнение, а не терпеть её.",
      "После двух тяжёлых тренировок подряд нагрузка удерживается или снижается."
    ],
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
      const increment = entry.pattern === "squat" || entry.pattern === "hinge" ? 2 : 1;
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
