export const CYCLE_WEEKS = 8;
export const PLAN_REVISION = 6;

export const GOALS = Object.freeze({
  strength: { label: "Рост силы", baseRest: 150 },
  muscle: { label: "Набор мышц", baseRest: 105 },
  fat_loss: { label: "Снижение веса", baseRest: 75 },
  wellness: { label: "Тонус и самочувствие", baseRest: 90 },
  endurance: { label: "Выносливость", baseRest: 60 },
  functional: { label: "Функциональная форма", baseRest: 75 },
  posture: { label: "Осанка и спина", baseRest: 75 },
  return: { label: "Возвращение после перерыва", baseRest: 90 }
});

export const WEEK_RULES = Object.freeze([
  { week: 1, phase: "adaptation", phaseLabel: "Адаптация", volume: 0.72, intensity: 0.84, rpe: 6.5, variationBlock: 0 },
  { week: 2, phase: "adaptation", phaseLabel: "Адаптация", volume: 0.84, intensity: 0.88, rpe: 7, variationBlock: 0 },
  { week: 3, phase: "volume", phaseLabel: "Рост объёма", volume: 1.00, intensity: 0.94, rpe: 7.5, variationBlock: 1 },
  { week: 4, phase: "volume", phaseLabel: "Рост объёма", volume: 1.10, intensity: 0.97, rpe: 8, variationBlock: 1 },
  { week: 5, phase: "intensity", phaseLabel: "Интенсивность", volume: 1.00, intensity: 1.00, rpe: 8, variationBlock: 2 },
  { week: 6, phase: "intensity", phaseLabel: "Интенсивность", volume: 1.03, intensity: 1.03, rpe: 8.5, variationBlock: 2 },
  { week: 7, phase: "peak", phaseLabel: "Тяжёлый блок", volume: 0.84, intensity: 1.06, rpe: 8.5, variationBlock: 2 },
  { week: 8, phase: "deload", phaseLabel: "Разгрузка", volume: 0.52, intensity: 0.84, rpe: 6.5, variationBlock: 2 }
]);

const slot = (role, patterns, targets = [], options = {}) => ({ role, patterns, targets, required: false, ...options });

export const SESSION_LIBRARY = Object.freeze({
  full_a: {
    title: "Всё тело · база",
    focus: "Присед · жим · тяга · задняя цепь",
    accent: "full",
    slots: [
      slot("primary", ["squat", "unilateral_knee_dominant"], ["Квадрицепсы", "Ягодичные"], { required: true }),
      slot("primary", ["horizontal_push", "vertical_push"], ["Грудные", "Передняя дельта"], { required: true }),
      slot("primary", ["horizontal_pull", "vertical_pull"], ["Широчайшие", "Ромбовидные"], { required: true }),
      slot("secondary", ["hip_hinge", "hip_extension"], ["Ягодичные", "Бицепс бедра"], { required: true }),
      slot("core", ["anti_extension"], ["Кор"])
    ]
  },
  full_b: {
    title: "Всё тело · задняя цепь",
    focus: "Тяга · односторонняя работа · верх тела · кор",
    accent: "full",
    slots: [
      slot("primary", ["hip_hinge", "hip_extension"], ["Ягодичные", "Бицепс бедра"], { required: true }),
      slot("primary", ["vertical_pull", "horizontal_pull"], ["Широчайшие"], { required: true }),
      slot("secondary", ["unilateral_knee_dominant", "squat"], ["Квадрицепсы", "Ягодичные"], { required: true }),
      slot("secondary", ["vertical_push", "horizontal_push"], ["Грудные", "Средняя дельта"], { required: true }),
      slot("core", ["anti_extension"], ["Кор"])
    ]
  },
  full_c: {
    title: "Всё тело · контроль",
    focus: "Односторонняя сила · плечи · спина · ягодицы",
    accent: "full",
    slots: [
      slot("primary", ["unilateral_knee_dominant", "squat"], ["Квадрицепсы", "Ягодичные"], { required: true }),
      slot("primary", ["vertical_push", "horizontal_push"], ["Средняя дельта", "Грудные"], { required: true }),
      slot("primary", ["horizontal_pull", "vertical_pull"], ["Ромбовидные", "Широчайшие"], { required: true }),
      slot("secondary", ["hip_extension", "hip_hinge"], ["Ягодичные"], { required: true }),
      slot("accessory", ["hip_abduction", "plantar_flexion", "anti_extension"], ["Средняя ягодичная", "Икроножные", "Кор"])
    ]
  },
  lower_strength: {
    title: "Низ · сила",
    focus: "Квадрицепс · задняя цепь · стабильность",
    accent: "legs",
    slots: [
      slot("primary", ["squat", "unilateral_knee_dominant"], ["Квадрицепсы"], { required: true }),
      slot("primary", ["hip_hinge", "hip_extension"], ["Бицепс бедра", "Ягодичные"], { required: true }),
      slot("secondary", ["unilateral_knee_dominant", "squat"], ["Квадрицепсы", "Ягодичные"], { required: true }),
      slot("accessory", ["plantar_flexion", "hip_abduction"], ["Икроножные", "Средняя ягодичная"]),
      slot("core", ["anti_extension"], ["Кор"], { required: true })
    ]
  },
  lower_volume: {
    title: "Низ · ягодицы и объём",
    focus: "Ягодицы · задняя цепь · односторонняя работа",
    accent: "glutes",
    slots: [
      slot("primary", ["hip_extension", "hip_hinge"], ["Ягодичные"], { required: true }),
      slot("primary", ["hip_hinge", "hip_extension"], ["Бицепс бедра", "Ягодичные"]),
      slot("secondary", ["unilateral_knee_dominant", "squat"], ["Ягодичные", "Квадрицепсы"]),
      slot("accessory", ["hip_abduction"], ["Средняя ягодичная"]),
      slot("accessory", ["plantar_flexion", "anti_extension"], ["Икроножные", "Кор"])
    ]
  },
  upper_pull: {
    title: "Верх · спина",
    focus: "Широчайшие · лопатки · задняя дельта · кор",
    accent: "back",
    slots: [
      slot("primary", ["vertical_pull", "horizontal_pull"], ["Широчайшие"], { required: true }),
      slot("primary", ["horizontal_pull", "vertical_pull"], ["Ромбовидные"]),
      slot("accessory", ["horizontal_abduction", "scapular_pull"], ["Задняя дельта", "Трапеции"]),
      slot("secondary", ["vertical_push", "horizontal_push"], ["Средняя дельта", "Грудные"], { required: true }),
      slot("core", ["anti_extension"], ["Кор"], { required: true })
    ]
  },
  upper_push: {
    title: "Верх · жим",
    focus: "Грудь · плечи · тяга для баланса · кор",
    accent: "push",
    slots: [
      slot("primary", ["horizontal_push", "vertical_push"], ["Грудные"], { required: true }),
      slot("primary", ["vertical_push", "horizontal_push"], ["Средняя дельта"]),
      slot("accessory", ["shoulder_abduction"], ["Средняя дельта"]),
      slot("secondary", ["horizontal_pull", "vertical_pull"], ["Ромбовидные", "Широчайшие"], { required: true }),
      slot("core", ["anti_extension"], ["Кор"], { required: true })
    ]
  },
  conditioning: {
    title: "Функциональная работа",
    focus: "Плотность · устойчивость · всё тело",
    accent: "core",
    slots: [
      slot("secondary", ["unilateral_knee_dominant", "squat"], ["Квадрицепсы"]),
      slot("secondary", ["horizontal_push", "vertical_push"], ["Грудные"], { required: true }),
      slot("secondary", ["horizontal_pull", "vertical_pull"], ["Широчайшие"], { required: true }),
      slot("accessory", ["plantar_flexion", "hip_abduction"], ["Икроножные", "Средняя ягодичная"]),
      slot("core", ["anti_extension"], ["Кор"], { required: true })
    ]
  }
});

export const PROGRAM_SCHEMES = Object.freeze({
  full_body_2: { id: "full_body_2", label: "Full Body ×2", sessions: ["full_a", "full_b"] },
  full_body_3: { id: "full_body_3", label: "Full Body ×3", sessions: ["full_a", "full_b", "full_c"] },
  posture_2: { id: "posture_2", label: "Full Body / Posture", sessions: ["full_a", "upper_pull"] },
  posture_3: { id: "posture_3", label: "Full Body / Posture ×3", sessions: ["full_a", "upper_pull", "full_c"] },
  lower_upper_lower: { id: "lower_upper_lower", label: "Lower / Upper / Lower", sessions: ["lower_strength", "upper_pull", "lower_volume"] },
  upper_lower: { id: "upper_lower", label: "Upper / Lower", sessions: ["upper_push", "lower_strength", "upper_pull", "lower_volume"] },
  five_day: { id: "five_day", label: "Lower / Upper / Lower / Upper / Functional", sessions: ["lower_strength", "upper_pull", "lower_volume", "upper_push", "conditioning"] }
});

export function selectProgramScheme(profile = {}) {
  const days = Math.max(2, Math.min(5, Number(profile.daysPerWeek) || 3));
  const goal = GOALS[profile.goal] ? profile.goal : "wellness";
  const focus = profile.focus || "balanced";

  if (days === 2) {
    if (focus === "posture" || goal === "posture") return PROGRAM_SCHEMES.posture_2;
    return PROGRAM_SCHEMES.full_body_2;
  }
  if (days === 3) {
    if (focus === "posture" || goal === "posture") return PROGRAM_SCHEMES.posture_3;
    if (focus === "glutes") return PROGRAM_SCHEMES.lower_upper_lower;
    return PROGRAM_SCHEMES.full_body_3;
  }
  if (days === 4) return PROGRAM_SCHEMES.upper_lower;
  return PROGRAM_SCHEMES.five_day;
}
