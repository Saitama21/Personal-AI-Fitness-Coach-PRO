import { addSetLog, removeLastSetLog } from "./workout-state.js";
import {
  installRuntimeDiagnostics,
  captureDomSnapshot,
  auditExerciseVisuals,
  auditDataIntegrity,
  runtimeDiagnosticsSnapshot,
  collectEnvironment,
  sanitizeAppState,
  summarizeReport,
  downloadAuditJson
} from "./diagnostics.js";

installRuntimeDiagnostics();

const state = {
  screen: "home",
  onboardingStep: 1,
  profile: null,
  plan: null,
  exercises: [],
  activeWorkout: null,
  workoutIndex: 0,
  workoutStartedAt: null,
  restTimer: null,
  timerId: null,
  logs: [],
  analyses: [],
  messages: [
    { role: "ai", text: "Привет. Я буду менять план по фактическим весам, повторениям и самочувствию. Что нужно скорректировать?" }
  ],
  config: { aiEnabled: false, mode: "local", version: "0.4.4" },
  deferredInstall: null,
  auditRunning: false,
  lastAuditReport: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const root = $("#screenRoot");
const modalRoot = $("#modalRoot");

const icons = {
  play: '<svg viewBox="0 0 24 24"><path d="m9 6 9 6-9 6Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24"><path d="M4 10v4M7 8v8M17 8v8M20 10v4M7 12h10"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4.5-8 .2 3-1.3 4.4-2.5 5.2.2-4-1.8-7.2-5-9.2.4 4-2 6.3-2 10 0 5 3 9 7 9Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  rotate: '<svg viewBox="0 0 24 24"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8.2A7 7 0 0 1 18.5 6M17.9 15.8A7 7 0 0 1 5.5 18"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/></svg>'
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

let saveStateTimer = null;

function scheduleSaveState(delay = 180) {
  clearTimeout(saveStateTimer);
  saveStateTimer = setTimeout(() => {
    saveStateTimer = null;
    saveState();
  }, delay);
}

function saveState() {
  const activeSession = state.activeWorkout ? {
    planId: state.plan?.id || null,
    workout: state.activeWorkout,
    workoutIndex: state.workoutIndex,
    workoutStartedAt: state.workoutStartedAt,
    restTimer: state.restTimer
  } : null;
  localStorage.setItem("forma-ai-state", JSON.stringify({
    schemaVersion: 4,
    profile: state.profile,
    plan: state.plan,
    activeSession,
    logs: state.logs,
    analyses: state.analyses,
    messages: state.messages.slice(-30)
  }));
}

function migrateProfile(profile) {
  if (!profile) return null;
  const migrated = structuredClone(profile);
  const legacyEquipment = Array.isArray(migrated.equipment) ? migrated.equipment : [];
  if (!migrated.trainingLocation) {
    migrated.trainingLocation = legacyEquipment.includes("gym") ? "gym" : "home";
  }
  if (legacyEquipment.includes("gym")) {
    migrated.equipment = ["bodyweight", "dumbbells", "barbell", "cable", "machine"];
  } else {
    migrated.equipment = legacyEquipment.filter((item) => !["gym", "home"].includes(item));
    if (!migrated.equipment.includes("bodyweight")) migrated.equipment.push("bodyweight");
  }
  migrated.focus ||= "balanced";
  migrated.sex ||= "unspecified";
  return migrated;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("forma-ai-state") || "null");
    if (!saved) return;
    state.profile = migrateProfile(saved.profile);
    state.plan = saved.plan || null;
    const session = saved.activeSession;
    if (session?.workout && session.planId && session.planId === state.plan?.id) {
      state.activeWorkout = session.workout;
      state.workoutIndex = Math.max(0, Math.min(Number(session.workoutIndex) || 0, Math.max(0, session.workout.exercises?.length - 1)));
      state.workoutStartedAt = Number(session.workoutStartedAt) || Date.now();
      state.restTimer = session.restTimer || null;
    }
    state.logs = Array.isArray(saved.logs) ? saved.logs : [];
    state.analyses = Array.isArray(saved.analyses) ? saved.analyses : [];
    if (saved.messages?.length) state.messages = saved.messages;
  } catch (error) {
    console.warn("State restore failed", error);
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.details?.join(" ") || data.error || "Ошибка запроса");
  return data;
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  $("#toastRoot").append(node);
  setTimeout(() => node.remove(), 2600);
}

function formatTimer() {
  if (!state.workoutStartedAt) return "00:00";
  const seconds = Math.floor((Date.now() - state.workoutStartedAt) / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function exerciseArt(id, large = false) {
  const exercise = state.exercises.find((item) => item.id === id);
  if (!exercise?.visual) {
    return `<div class="exercise-art-placeholder${large ? " is-large" : ""}" role="img" aria-label="Визуал упражнения обновляется"><span>FORMA</span><small>Визуал обновляется</small></div>`;
  }
  return `<img class="exercise-art-image${large ? " is-large" : ""}" src="${exercise.visual}" alt="Техника выполнения: ${escapeHtml(exercise.name)}" ${large ? 'loading="eager"' : 'loading="lazy"'} decoding="async" draggable="false">`;
}

function rpeLabel(value) {
  const labels = { 5: "Легко", 6: "Умеренно", 7: "Рабоче", 8: "Тяжело", 9: "Очень тяжело", 10: "Предел" };
  return labels[Number(value)] || "Рабоче";
}

function painLabel(value) {
  const n = Number(value);
  if (n === 0) return "Нет боли";
  if (n <= 3) return "Лёгкий дискомфорт";
  if (n <= 5) return "Заметная боль";
  return "Остановиться";
}

function formatCountdown(seconds) {
  const safe = Math.max(0, Math.ceil(Number(seconds) || 0));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function restRemainingSeconds() {
  if (!state.restTimer?.until) return 0;
  return Math.max(0, Math.ceil((Number(state.restTimer.until) - Date.now()) / 1000));
}

function clearRestTimer({ persist = true } = {}) {
  state.restTimer = null;
  if (persist) saveState();
}

function startRestTimer(exercise, setIndex) {
  const duration = Math.max(15, Number(exercise?.rest) || 60);
  state.restTimer = {
    exerciseId: exercise.id,
    setIndex,
    duration,
    until: Date.now() + duration * 1000,
    notified: false
  };
  saveState();
}

function restTimerMarkup(exercise) {
  if (!state.restTimer || state.restTimer.exerciseId !== exercise.id) return "";
  const remaining = restRemainingSeconds();
  const complete = remaining <= 0;
  return `<div class="rest-timer ${complete ? "complete" : ""}" id="restTimerPanel" role="status">
    <div><span>${complete ? "Можно начинать" : "Отдых после подхода"}</span><b id="restTimerValue">${complete ? "Готово" : formatCountdown(remaining)}</b><small>${complete ? "Дыхание восстановилось — следующий подход по технике." : `План: ${exercise.rest} сек.`}</small></div>
    <div class="rest-timer-actions"><button data-action="rest-add" aria-label="Добавить 15 секунд">+15</button><button data-action="rest-skip">${complete ? "Скрыть" : "Пропустить"}</button></div>
  </div>`;
}

function updateRestTimerUi() {
  const panel = $("#restTimerPanel");
  if (!panel || !state.restTimer) return;
  const value = $("#restTimerValue");
  const remaining = restRemainingSeconds();
  if (remaining > 0) {
    if (value) value.textContent = formatCountdown(remaining);
    return;
  }
  panel.classList.add("complete");
  if (value) value.textContent = "Готово";
  const label = panel.querySelector("span");
  const detail = panel.querySelector("small");
  const skip = panel.querySelector('[data-action="rest-skip"]');
  if (label) label.textContent = "Можно начинать";
  if (detail) detail.textContent = "Дыхание восстановилось — следующий подход по технике.";
  if (skip) skip.textContent = "Скрыть";
  if (!state.restTimer.notified) {
    state.restTimer.notified = true;
    if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
    saveState();
  }
}

function lastExercisePerformance(exerciseId) {
  for (let index = state.logs.length - 1; index >= 0; index -= 1) {
    const log = state.logs[index];
    const entry = (log.entries || []).find((item) => item.exerciseId === exerciseId);
    if (entry) return { log, entry };
  }
  return null;
}

function lastExerciseRecommendation(exerciseId) {
  for (let index = state.analyses.length - 1; index >= 0; index -= 1) {
    const rec = (state.analyses[index].recommendations || []).find((item) => item.exerciseId === exerciseId);
    if (rec) return rec;
  }
  return null;
}

function performanceSummary(entry) {
  const sets = (entry?.sets || []).filter((set) => set.done !== false);
  if (!sets.length) return "нет завершённых подходов";
  const reps = sets.map((set) => Number(set.reps) || 0);
  if (entry?.unit === "сек.") return `${reps.join(" / ")} сек.`;
  const weights = sets.map((set) => Number(set.weight) || 0);
  const positiveWeights = weights.filter((value) => value > 0);
  if (positiveWeights.length && new Set(positiveWeights).size === 1) {
    return `${positiveWeights[0]} кг × ${reps.join(" / ")}`;
  }
  if (positiveWeights.length) return sets.map((set) => `${Number(set.weight) || 0}×${Number(set.reps) || 0}`).join(" · ");
  return `${reps.join(" / ")} повт.`;
}

function workoutInsightMarkup(exercise) {
  const previous = lastExercisePerformance(exercise.id);
  const recommendation = lastExerciseRecommendation(exercise.id);
  const currentTarget = `${exercise.setLogs.length}×${exercise.target} · RPE ${exercise.rpeTarget}`;
  const previousDate = previous ? new Date(previous.log.createdAt).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" }) : null;
  return `<div class="workout-insights">
    <div class="workout-insight"><span>Сегодня</span><b>${escapeHtml(currentTarget)}</b><small>${exercise.plannedWeight ? `Стартовый ориентир ${exercise.plannedWeight} ${escapeHtml(exercise.unit)}` : "Нагрузка по технике и целевому RPE"}</small></div>
    <div class="workout-insight"><span>Прошлый раз</span><b>${previous ? escapeHtml(performanceSummary(previous.entry)) : "Первое выполнение"}</b><small>${previous ? `${previousDate} · RPE ${previous.entry.rpe ?? "—"}${Number(previous.entry.pain) > 0 ? ` · боль ${previous.entry.pain}/10` : ""}` : "FORMA сохранит фактические подходы после тренировки"}</small></div>
    ${recommendation ? `<div class="workout-insight recommendation"><span>Следующий шаг</span><b>${escapeHtml(recommendation.action)}</b><small>${escapeHtml(recommendation.note)}</small></div>` : ""}
  </div>`;
}

function painGuidanceMarkup(pain, exerciseId) {
  const value = Number(pain) || 0;
  if (value <= 0) return "";
  if (value <= 3) return `<div class="pain-guidance mild"><b>Есть дискомфорт</b><span>Снизь темп или амплитуду. Боль не должна нарастать от подхода к подходу.</span></div>`;
  if (value <= 5) return `<div class="pain-guidance warning"><b>Не форсируй движение</b><span>Снизь нагрузку и выбери безболезненную амплитуду. Если ощущение сохраняется — замени упражнение.</span><button data-action="open-replacement">Подобрать замену</button></div>`;
  return `<div class="pain-guidance danger"><b>Останови это упражнение</b><span>Резкую, нарастающую или необычную боль не тренируем через силу. Перейди на безболезненную альтернативу.</span><button data-action="open-replacement">Заменить упражнение</button></div>`;
}

function updatePainGuidance() {
  const host = $("#painGuidance");
  const exercise = state.activeWorkout?.exercises?.[state.workoutIndex];
  if (!host || !exercise) return;
  host.innerHTML = painGuidanceMarkup(exercise.pain, exercise.id);
}

function openRestEditor() {
  collectCurrentExercise();
  const exercise = state.activeWorkout?.exercises?.[state.workoutIndex];
  if (!exercise) return;
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="bottom-sheet"><div class="sheet-handle"></div>
    <div class="sheet-head"><div><p class="eyebrow">Отдых между подходами</p><h2>${escapeHtml(exercise.name)}</h2><p class="subtle">Измени базовый отдых для следующих подходов этого упражнения. Текущий запущенный таймер не пересчитывается.</p></div><button class="close-button" data-close-modal aria-label="Закрыть">×</button></div>
    <div class="form-grid"><div class="field full"><label>Секунды</label><input id="restSeconds" inputmode="numeric" type="number" min="30" max="300" step="15" value="${Number(exercise.rest) || 60}" /></div></div>
    <div class="rest-presets">${[45,60,75,90,105,120,150,180].map((value) => `<button data-rest-preset="${value}">${value}с</button>`).join("")}</div>
    <button class="primary-button wide" style="margin-top:12px" data-action="save-rest">Сохранить отдых</button>
  </section></div>`;
}

function saveRestEditor() {
  const exercise = state.activeWorkout?.exercises?.[state.workoutIndex];
  if (!exercise) return;
  const value = Math.round((Number($("#restSeconds")?.value) || exercise.rest || 60) / 15) * 15;
  exercise.rest = Math.min(300, Math.max(30, value));
  modalRoot.innerHTML = "";
  saveState();
  renderWorkout();
  toast(`Отдых: ${exercise.rest} сек.`);
}

async function openReplacement() {
  collectCurrentExercise();
  const exercise = state.activeWorkout?.exercises?.[state.workoutIndex];
  if (!exercise) return;
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="bottom-sheet"><div class="sheet-handle"></div><p class="eyebrow">Безопасная замена</p><h2>Ищу варианты…</h2><p class="subtle">Сохраняю движение, доступное оборудование и уровень.</p></section></div>`;
  try {
    const excludeIds = state.activeWorkout.exercises.map((item) => item.id);
    const { alternatives } = await api("/api/exercise/alternatives", {
      method: "POST",
      body: JSON.stringify({ exerciseId: exercise.id, profile: state.profile, excludeIds, limit: 6 })
    });
    modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="bottom-sheet replacement-sheet"><div class="sheet-handle"></div>
      <div class="sheet-head"><div><p class="eyebrow">Замена упражнения</p><h2>${escapeHtml(exercise.name)}</h2><p class="subtle">Только варианты с тем же movement pattern и совместимым оборудованием. Замена действует на текущую тренировку.</p></div><button class="close-button" data-close-modal aria-label="Закрыть">×</button></div>
      <div class="replacement-list">${alternatives.length ? alternatives.map((item) => `<button class="replacement-option" data-replacement-id="${item.id}"><span class="replacement-art">${exerciseArt(item.id)}</span><span><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.muscle)} · ${escapeHtml(item.reason)}</small></span><span class="replacement-arrow">→</span></button>`).join("") : `<div class="empty-state"><div class="emoji">↺</div><h3>Совместимой замены пока нет</h3><p class="subtle">FORMA не будет подсовывать другое движение только ради заполнения карточки.</p></div>`}</div>
    </section></div>`;
  } catch (error) {
    modalRoot.innerHTML = "";
    toast(error.message);
  }
}

function clientCanUseExternalLoad(exercise) {
  if (!exercise || exercise.unit !== "кг") return false;
  const available = new Set(state.profile?.equipment || []);
  available.add("bodyweight");
  const loadBearing = new Set(["dumbbells", "barbell", "cable", "machine"]);
  return (exercise.requiredEquipmentOptions || []).some((option) => option.every((item) => available.has(item)) && option.some((item) => loadBearing.has(item)));
}

function makeReplacementExercise(previous, replacementMeta, setCount) {
  const count = Math.max(1, setCount);
  return {
    ...previous,
    id: replacementMeta.id,
    name: replacementMeta.name,
    muscle: replacementMeta.muscle,
    movementPattern: replacementMeta.movementPattern,
    exerciseType: replacementMeta.exerciseType,
    unit: replacementMeta.unit,
    loadMode: clientCanUseExternalLoad(replacementMeta) ? "external" : (replacementMeta.unit === "кг" ? "bodyweight" : "none"),
    rest: Number(replacementMeta.rest) || previous.rest,
    suggestedWeight: 0,
    plannedWeight: 0,
    sets: count,
    replacedFrom: previous.id,
    stoppedEarly: false,
    setLogs: Array.from({ length: count }, (_, index) => ({
      set: index + 1, weight: "", reps: previous.repRange?.min || parseInt(previous.target, 10) || 10, done: false
    })),
    rpe: Number(previous.rpeTarget || 7),
    pain: 0
  };
}

function applySessionReplacement(replacementId) {
  collectCurrentExercise();
  const replacementMeta = state.exercises.find((item) => item.id === replacementId);
  const workout = state.activeWorkout;
  const current = workout?.exercises?.[state.workoutIndex];
  if (!replacementMeta || !current || replacementMeta.movementPattern !== current.movementPattern) return toast("Замена не прошла проверку movement pattern");

  const completed = current.setLogs.filter((set) => set.done);
  const remaining = current.setLogs.length - completed.length;
  clearRestTimer({ persist: false });

  if (completed.length === 0) {
    workout.exercises[state.workoutIndex] = makeReplacementExercise(current, replacementMeta, current.setLogs.length);
  } else if (remaining > 0) {
    current.setLogs = completed.map((set, index) => ({ ...set, set: index + 1 }));
    current.sets = completed.length;
    current.stoppedEarly = true;
    const replacement = makeReplacementExercise(current, replacementMeta, remaining);
    replacement.replacedAfter = current.id;
    workout.exercises.splice(state.workoutIndex + 1, 0, replacement);
    state.workoutIndex += 1;
  } else {
    toast("Все подходы уже завершены — переходи к следующему упражнению");
    modalRoot.innerHTML = "";
    return;
  }

  modalRoot.innerHTML = "";
  saveState();
  renderWorkout();
  toast(`Замена: ${replacementMeta.name}`);
}

function phaseForWeek(plan, week = plan?.week || 1) {
  if (!plan?.weeks?.length) return null;
  return plan.weeks.find((item) => item.week === Math.max(1, Number(week) || 1)) || plan.weeks[0] || null;
}

const EQUIPMENT_LABELS = Object.freeze({
  bodyweight: "собственный вес",
  dumbbells: "гантели",
  barbell: "штанга",
  cable: "блочный тренажёр",
  machine: "тренажёры"
});

function constraintSummary(plan = state.plan) {
  const coverage = plan?.coverage;
  if (!coverage || coverage.status !== "limited") return null;
  const missing = (coverage.missingGroups || []).map((group) => group.label);
  const suggestions = [...new Set((coverage.missingGroups || []).flatMap((group) => group.equipmentSuggestions || []))];
  return {
    missing,
    suggestions,
    missingText: missing.length ? missing.join(", ") : "часть обязательных двигательных паттернов",
    suggestionText: suggestions.length ? suggestions.map((item) => EQUIPMENT_LABELS[item] || item).join(", ") : "добавить совместимое оборудование или упражнение в базу"
  };
}

function constraintBanner(plan = state.plan) {
  const summary = constraintSummary(plan);
  if (!summary) return "";
  return `<article class="constraint-banner" role="status"><b>План ограничен доступным оборудованием</b><p>Не закрыто: ${escapeHtml(summary.missingText)}. FORMA не заменяет отсутствующий паттерн упражнением на другую мышечную механику.</p><small>Чтобы закрыть пробел: ${escapeHtml(summary.suggestionText)}</small></article>`;
}

function copySuggestedWeights(fromPlan, toPlan) {
  const weights = new Map();
  const collect = (workouts = []) => workouts.forEach((workout) => (workout.exercises || []).forEach((exercise) => {
    if (exercise.suggestedWeight) weights.set(exercise.id, Math.max(weights.get(exercise.id) || 0, exercise.suggestedWeight));
  }));
  collect(fromPlan?.workouts);
  (fromPlan?.weeks || []).forEach((week) => collect(week.workouts));

  const apply = (workouts = []) => workouts.forEach((workout) => (workout.exercises || []).forEach((exercise) => {
    if (exercise.loadMode !== "external") {
      exercise.suggestedWeight = 0;
      exercise.plannedWeight = 0;
      return;
    }
    if (!weights.has(exercise.id)) return;
    exercise.suggestedWeight = weights.get(exercise.id);
    if (exercise.unit === "кг") {
      exercise.plannedWeight = Math.round(exercise.suggestedWeight * (exercise.loadMultiplier || 1) * 2) / 2;
    }
  }));
  apply(toPlan?.workouts);
  (toPlan?.weeks || []).forEach((week) => apply(week.workouts));
}

function getTodayWorkout() {
  return state.plan?.workouts?.find((workout) => workout.status === "today") || state.plan?.workouts?.[0] || null;
}

function render() {
  clearInterval(state.timerId);
  root.style.animation = "none";
  requestAnimationFrame(() => { root.style.animation = ""; });
  if (!state.profile) return renderOnboarding();
  $(".topbar").hidden = state.screen !== "home";
  const workoutMode = state.screen === "workout";
  $(".bottom-nav").hidden = workoutMode;
  $("#app").classList.toggle("workout-mode", workoutMode);
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.screen === state.screen));
  if (state.screen === "home") renderHome();
  if (state.screen === "plan") renderPlan();
  if (state.screen === "workout") renderWorkout();
  if (state.screen === "progress") renderProgress();
  if (state.screen === "coach") renderCoach();
}

function renderOnboarding() {
  $(".topbar").hidden = true;
  $(".bottom-nav").hidden = true;
  const step = state.onboardingStep;
  const draft = state.profileDraft || {
    name: "",
    age: "",
    height: "",
    weight: "",
    sex: "unspecified",
    goal: "",
    focus: "balanced",
    level: "beginner",
    daysPerWeek: 3,
    duration: 45,
    trainingLocation: "gym",
    equipment: ["bodyweight", "dumbbells", "barbell", "cable", "machine"],
    trainingDays: [0, 2, 4]
  };
  state.profileDraft = draft;

  if (step === 1) {
    root.innerHTML = `<section class="onboarding">
      <div class="onboarding-top"><div class="brand"><span class="brand-mark">F</span><span><b>FORMA</b><small>AI COACH</small></span></div><span class="step-counter">1 из 3</span></div>
      <div class="onboarding-card glass-panel">
        <p class="eyebrow">Начнём с основы</p>
        <h1>Расскажи немного о себе</h1>
        <p class="subtle">Возраст и параметры влияют на стартовую нагрузку. Пол сохраняем как часть профиля, без стереотипных коэффициентов силы.</p>
        <div class="form-grid">
          <div class="field full"><label>Имя</label><input id="name" autocomplete="name" placeholder="Например, Иван" value="${escapeHtml(draft.name)}" /></div>
          <div class="field"><label>Возраст</label><input id="age" inputmode="numeric" placeholder="30" value="${escapeHtml(draft.age)}" /></div>
          <div class="field"><label>Пол</label><select id="sex"><option value="unspecified" ${draft.sex === "unspecified" ? "selected" : ""}>Не указывать</option><option value="female" ${draft.sex === "female" ? "selected" : ""}>Женский</option><option value="male" ${draft.sex === "male" ? "selected" : ""}>Мужской</option></select></div>
          <div class="field"><label>Рост, см</label><input id="height" inputmode="decimal" placeholder="175" value="${escapeHtml(draft.height)}" /></div>
          <div class="field"><label>Вес, кг</label><input id="weight" inputmode="decimal" placeholder="75" value="${escapeHtml(draft.weight)}" /></div>
        </div>
      </div>
      <div class="onboarding-actions single"><button class="primary-button wide" data-onboarding="next">Продолжить ${icons.arrow}</button></div>
    </section>`;
  } else if (step === 2) {
    const options = [
      ["strength", "⚡️", "Стать сильнее", "Ниже повторения, больше отдыха, прогрессия без форсирования"],
      ["muscle", "◌", "Набрать мышцы", "Объём, диапазоны повторений и double progression"],
      ["fat_loss", "↘", "Снизить вес", "Силовая основа и умеренная плотность работы"],
      ["endurance", "∞", "Выносливость", "Больше повторений и короче отдых"],
      ["functional", "◇", "Функциональная форма", "Устойчивость, односторонняя работа и всё тело"],
      ["posture", "↟", "Осанка и спина", "Тяги, лопатки, задняя дельта и контроль корпуса"],
      ["return", "↺", "Вернуться после перерыва", "Меньше объёма, умеренный RPE, техника прежде нагрузки"],
      ["wellness", "✦", "Тонус и самочувствие", "Сбалансированная нагрузка без перегруза"]
    ];
    root.innerHTML = `<section class="onboarding">
      <div class="onboarding-top"><button class="text-button" data-onboarding="back">← Назад</button><span class="step-counter">2 из 3</span></div>
      <div class="onboarding-card glass-panel">
        <p class="eyebrow">Главный ориентир</p>
        <h1>Что сейчас важнее?</h1>
        <p class="subtle">Цель меняет объём, диапазоны повторений, отдых и схему недели — а не просто подпись на карточке.</p>
        <div class="choice-grid">${options.map(([id, icon, title, text]) => `<button class="choice-card ${draft.goal === id ? "selected" : ""}" data-goal="${id}"><span class="choice-icon">${icon}</span><b>${title}</b><small>${text}</small></button>`).join("")}</div>
      </div>
      <div class="onboarding-actions"><button class="secondary-button" data-onboarding="back">Назад</button><button class="primary-button" data-onboarding="next">Продолжить ${icons.arrow}</button></div>
    </section>`;
  } else {
    const locations = [["gym", "Зал", "Полный набор оборудования"], ["home", "Дом", "Только отмеченное ниже"], ["mixed", "Дом + зал", "Оборудование зависит от конкретной сессии"]];
    const equipment = [["bodyweight", "Собственный вес"], ["dumbbells", "Гантели"], ["barbell", "Штанга"], ["cable", "Блочный тренажёр"], ["machine", "Тренажёры"]];
    const focuses = [["balanced", "Баланс"], ["glutes", "Ягодицы / ноги"], ["upper", "Верх тела"], ["posture", "Спина / осанка"]];
    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    root.innerHTML = `<section class="onboarding">
      <div class="onboarding-top"><button class="text-button" data-onboarding="back">← Назад</button><span class="step-counter">3 из 3</span></div>
      <div class="onboarding-card glass-panel">
        <p class="eyebrow">Режим тренировок</p>
        <h1>Соберём реальный график</h1>
        <div class="form-grid">
          <div class="field full"><label>Уровень</label><select id="level"><option value="beginner" ${draft.level === "beginner" ? "selected" : ""}>Начинающий</option><option value="intermediate" ${draft.level === "intermediate" ? "selected" : ""}>Средний</option><option value="advanced" ${draft.level === "advanced" ? "selected" : ""}>Продвинутый</option></select></div>
          <div class="field"><label>Дней в неделю</label><select id="days"><option ${draft.daysPerWeek == 2 ? "selected" : ""}>2</option><option ${draft.daysPerWeek == 3 ? "selected" : ""}>3</option><option ${draft.daysPerWeek == 4 ? "selected" : ""}>4</option><option ${draft.daysPerWeek == 5 ? "selected" : ""}>5</option></select></div>
          <div class="field"><label>Минут</label><select id="duration"><option ${draft.duration == 30 ? "selected" : ""}>30</option><option ${draft.duration == 45 ? "selected" : ""}>45</option><option ${draft.duration == 60 ? "selected" : ""}>60</option></select></div>
          <div class="field full"><label>Акцент</label><select id="focus">${focuses.map(([id, label]) => `<option value="${id}" ${draft.focus === id ? "selected" : ""}>${label}</option>`).join("")}</select></div>
        </div>
        <p class="choice-label">Где тренируешься</p>
        <div class="choice-grid compact-grid">${locations.map(([id, title, text]) => `<button class="choice-card ${draft.trainingLocation === id ? "selected" : ""}" data-location="${id}"><span class="choice-icon">◎</span><b>${title}</b><small>${text}</small></button>`).join("")}</div>
        <p class="choice-label">Доступное оборудование</p>
        <div class="choice-grid compact-grid">${equipment.map(([id, title]) => `<button class="choice-card ${draft.equipment.includes(id) ? "selected" : ""}" data-equipment="${id}"><span class="choice-icon">✓</span><b>${title}</b><small>Можно выбрать несколько вариантов</small></button>`).join("")}</div>
        <p class="choice-label">Тренировочные дни <small>выбери ${draft.daysPerWeek}</small></p>
        <div class="day-selector">${dayNames.map((name, index) => `<button class="day-choice ${draft.trainingDays.includes(index) ? "selected" : ""}" data-training-day="${index}">${name}</button>`).join("")}</div>
      </div>
      <div class="onboarding-actions"><button class="secondary-button" data-onboarding="back">Назад</button><button class="primary-button" data-onboarding="finish">Создать план</button></div>
    </section>`;
  }
}

function renderHome() {
  $(".topbar").hidden = false;
  $(".bottom-nav").hidden = false;
  const workout = getTodayWorkout();
  const sessionActive = Boolean(state.activeWorkout);
  const completed = state.logs.length;
  const latestAnalysis = state.analyses.at(-1) || null;
  const readiness = latestAnalysis?.metrics?.readiness ?? null;
  const latestSleep = state.logs.at(-1)?.readiness?.sleep ?? null;
  const completedThisWeek = (state.plan?.workouts || []).filter((item) => item.status === "done").length;
  const avgTargetRpe = workout?.exercises?.length
    ? (workout.exercises.reduce((sum, item) => sum + Number(item.rpeTarget || 7), 0) / workout.exercises.length).toFixed(1).replace(".0", "")
    : "—";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
  const readinessValue = readiness ?? 0;
  root.innerHTML = `<section>
    <p class="eyebrow">${greeting}, ${escapeHtml(state.profile.name || "спортсмен")}</p>
    <h1>${workout ? "Сегодня работаем<br>по плану" : "Сегодня<br>восстановление"}</h1>
    <p class="subtle">${workout ? `${escapeHtml(workout.phaseLabel || "Рабочая неделя")} · выполняй заданный диапазон, а не гоняйся за весом.` : "Следующая нагрузка появится по расписанию цикла."}</p>
    ${constraintBanner()}

    <article class="hero-card glass-panel">
      <div class="hero-top"><span class="goal-pill"><i></i>${escapeHtml(state.plan.goalLabel)}</span>
        <div class="readiness"><svg viewBox="0 0 64 64"><circle class="track" cx="32" cy="32" r="28"/><circle class="value" cx="32" cy="32" r="28" style="stroke-dashoffset:${176 - 1.76 * readinessValue}"/></svg><div class="readiness-text">${readiness ?? "—"}<small>готовность</small></div></div>
      </div>
      <h2>${escapeHtml(workout?.title || "Восстановление")}</h2>
      <div class="hero-meta"><span>${workout?.duration || 0} мин</span><span>•</span><span>${workout?.exercises?.length || 0} упражнений</span><span>•</span><span>RPE ${avgTargetRpe}</span></div>
      <div class="hero-action">${workout ? `<button class="primary-button" data-action="start-workout">${icons.play} ${sessionActive ? "Продолжить тренировку" : "Начать тренировку"}</button>` : ""}<span class="subtle">${workout?.dayName || "Отдых"}</span></div>
    </article>

    <div class="section-head"><h2>Факты</h2><button class="text-button" data-action="plan">Открыть план</button></div>
    <div class="stat-grid">
      <div class="stat-card glass-panel"><span class="stat-icon">${icons.dumbbell}</span><b>${completed}</b><small>завершено всего</small></div>
      <div class="stat-card glass-panel"><span class="stat-icon">${icons.flame}</span><b>${completedThisWeek}/${state.plan?.daysPerWeek || 0}</b><small>сессий недели</small></div>
      <div class="stat-card glass-panel"><span class="stat-icon">${icons.moon}</span><b>${latestSleep ?? "—"}</b><small>${latestSleep ? "сон, оценка" : "сон ещё не записан"}</small></div>
    </div>

    <div class="section-head"><h2>Сегодня</h2>${workout ? `<button class="text-button" data-action="start-workout">Все упражнения</button>` : ""}</div>
    <div>${(workout?.exercises || []).slice(0, 3).map((exercise) => `<article class="workout-card glass-panel" data-exercise="${exercise.id}"><div class="exercise-thumb">${exerciseArt(exercise.id)}</div><div class="workout-info"><h3>${escapeHtml(exercise.name)}</h3><p>${exercise.sets} подхода · ${escapeHtml(exercise.target)} · ${exercise.rest} сек.</p></div><button class="chevron">${icons.arrow}</button></article>`).join("") || `<article class="empty-state glass-panel"><div class="emoji">🌿</div><h3>День восстановления</h3><p class="subtle">Без фальшивой активности: сегодня в цикле нет тренировки.</p></article>`}</div>
  </section>`;
}

function renderPlan() {
  const plan = state.plan;
  const sessionActive = Boolean(state.activeWorkout);
  const currentPhase = phaseForWeek(plan);
  const weekDays = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const workoutByDay = new Map((plan.workouts || []).map((workout) => [workout.dayIndex, workout]));
  root.innerHTML = `<section class="plan-screen">
    <div class="plan-title-row">
      <div><p class="eyebrow">Персональный цикл ${plan.cycleNumber || 1}</p><h1>План на ${plan.cycleWeeks || 8} недель</h1><p class="subtle">${escapeHtml(plan.summary)}</p></div>
      <span class="cycle-pill">Неделя ${plan.week} из ${plan.cycleWeeks || 8}</span>
    </div>
    ${constraintBanner(plan)}

    <div class="plan-policy-grid">
      <article class="policy-card sport-card"><span class="policy-icon">${icons.spark}</span><div><b>${escapeHtml(currentPhase?.phaseLabel || "Периодизация")}</b><small>RPE ${currentPhase?.rpeTarget ?? "—"} · объём ×${currentPhase?.volumeMultiplier ?? "—"}</small></div></article>
      <article class="policy-card sport-card"><span class="policy-icon warm">${icons.rotate}</span><div><b>Вариации без хаоса</b><small>Движения меняются блоками, паттерны и прогресс сохраняются</small></div></article>
    </div>

    <div class="phase-strip">${(plan.weeks || []).map((week) => `<span class="phase-node ${week.week === plan.week ? "active" : ""} ${week.week < plan.week ? "done" : ""}"><b>${week.week}</b><small>${escapeHtml(week.phaseLabel)}</small></span>`).join("")}</div>

    <div class="section-head compact"><div><p class="eyebrow">${escapeHtml(plan.schemeLabel || "Схема")}</p><h2>Эта неделя</h2></div><span class="rotation-badge">${escapeHtml(currentPhase?.phaseLabel || "Фаза")}</span></div>

    ${(plan.workouts || []).map((workout) => `<article class="plan-card premium-card ${workout.status === "today" ? "today" : ""}">
      <div class="plan-card-head"><div><div class="day-title"><span class="day-badge">${workout.dayName}</span><h3>${escapeHtml(workout.title)}</h3><span class="duration-pill">${workout.duration} мин</span>${workout.coverage?.status === "limited" ? `<span class="workout-constraint">ограничено</span>` : ""}</div><p class="subtle">${escapeHtml(workout.focus)}</p></div><span class="workout-state ${workout.status}">${workout.status === "done" ? icons.check : workout.exercises.length}</span></div>
      <div class="exercise-preview-row">${workout.exercises.slice(0,4).map((exercise) => `<button class="exercise-preview" data-exercise="${exercise.id}" aria-label="${escapeHtml(exercise.name)}"><span class="exercise-preview-art">${exerciseArt(exercise.id)}</span><b>${escapeHtml(exercise.name)}</b><small>${exercise.sets}×${escapeHtml(exercise.target)} · RPE ${exercise.rpeTarget}</small></button>`).join("")}</div>
      <div class="plan-card-footer"><span>${workout.exercises.length} упражнений</span>${workout.status === "today" ? `<button class="start-inline" data-action="start-workout">${icons.play} ${sessionActive ? "Продолжить" : "Начать"}</button>` : `<span class="focus-label">${escapeHtml(workout.phaseLabel || "")}</span>`}</div>
    </article>`).join("")}

    <div class="section-head compact"><div><p class="eyebrow">Расписание недели</p><h2>Ритм и восстановление</h2></div></div>
    <div class="schedule-grid">${weekDays.map((dayName, dayIndex) => {
      const workout = workoutByDay.get(dayIndex);
      return `<div class="schedule-day ${workout ? "training" : "rest"}"><b>${dayName}</b><span>${workout ? escapeHtml(workout.title) : "Отдых"}</span></div>`;
    }).join("")}</div>

    <article class="analysis-card premium-card"><span class="analysis-state">Constraint engine</span><h3>UI больше не хранит готовую программу</h3><p class="subtle">Упражнения подбираются по паттернам, целевым мышцам, уровню и фактически доступному оборудованию. Если подходящей безопасной вариации нет, движок не проталкивает несовместимое упражнение fallback-ом.</p></article>
  </section>`;
}

function initActiveWorkout() {
  if (state.activeWorkout) return;
  const source = structuredClone(getTodayWorkout());
  if (!source) return;
  source.exercises.forEach((exercise) => {
    exercise.setLogs = Array.from({ length: exercise.sets }, (_, index) => ({
      set: index + 1,
      weight: exercise.plannedWeight || exercise.suggestedWeight || "",
      reps: exercise.repRange?.min || parseInt(exercise.target, 10) || 10,
      done: false
    }));
    exercise.rpe = Number(exercise.rpeTarget || 7);
    exercise.pain = 0;
  });
  state.activeWorkout = source;
  state.workoutIndex = 0;
  state.workoutStartedAt = Date.now();
  state.restTimer = null;
  saveState();
}

function renderWorkout() {
  clearInterval(state.timerId);
  $(".bottom-nav").hidden = true;
  $("#app").classList.add("workout-mode");
  initActiveWorkout();
  if (!state.activeWorkout) {
    root.innerHTML = `<div class="empty-state premium-card"><div class="emoji">🌿</div><h2>Сегодня восстановление</h2><p class="subtle">В плане пока нет активной тренировки.</p></div>`;
    return;
  }
  const workout = state.activeWorkout;
  const exercise = workout.exercises[state.workoutIndex];
  if (state.restTimer && state.restTimer.exerciseId !== exercise.id) clearRestTimer({ persist: false });
  const setCount = Math.max(1, exercise.setLogs.length);
  const progress = ((state.workoutIndex + exercise.setLogs.filter((item) => item.done).length / setCount) / workout.exercises.length) * 100;
  root.innerHTML = `<section class="workout-screen">
    <div class="workout-header"><div class="workout-heading"><button class="workout-exit-button" data-action="exit-workout" aria-label="Вернуться к плану">←</button><div><p class="eyebrow">${escapeHtml(workout.dayName)} · ${escapeHtml(workout.title)}</p><h1>${escapeHtml(exercise.name)}</h1><p class="subtle">Упражнение ${state.workoutIndex + 1} из ${workout.exercises.length}</p></div></div><div class="timer-badge premium-card" id="workoutTimer">${formatTimer()}</div></div>
    <div class="progress-track" aria-label="Прогресс тренировки"><span style="width:${progress}%"></span></div>
    <article class="current-exercise premium-card">
      <button class="current-art exercise-art-frame" data-art-contract="exercise-3x2" data-exercise="${exercise.id}" aria-label="Открыть технику ${escapeHtml(exercise.name)}">${exerciseArt(exercise.id, true)}<span class="art-hint">Техника</span></button>
      <div class="exercise-title-row"><div><div class="exercise-meta-row"><span class="muscle-pill">${escapeHtml(exercise.muscle)}</span><button class="rest-setting-button" data-action="edit-rest">Отдых ${exercise.rest} сек. · изменить</button></div></div><div class="exercise-title-actions"><button class="replace-button" data-action="open-replacement" aria-label="Заменить упражнение">${icons.rotate}<span>Заменить</span></button><button class="info-button" data-exercise="${exercise.id}" aria-label="Техника упражнения">i</button></div></div>
      ${workoutInsightMarkup(exercise)}
      <div class="sets-grid"><span class="label">Сет</span><span class="label">${exercise.loadMode === "external" ? "Вес" : "Нагрузка"}</span><span class="label">${exercise.unit === "сек." ? "Время" : "Повт."}</span><span class="label">Готово</span>
        ${exercise.setLogs.map((set, index) => `<span class="set-index">${index + 1}</span><input class="set-input" inputmode="decimal" data-set-weight="${index}" value="${set.weight}" placeholder="—" ${exercise.loadMode === "external" ? "" : "disabled"} aria-label="${exercise.loadMode === "external" ? `Вес подхода ${index+1}` : `Внешний вес не используется в подходе ${index+1}`}"/><input class="set-input" inputmode="numeric" data-set-reps="${index}" value="${set.reps}" aria-label="${exercise.unit === "сек." ? "Время" : "Повторения"} подхода ${index+1}"/><button class="set-check ${set.done ? "done" : ""}" data-set-done="${index}" aria-label="Отметить подход">${icons.check}</button>`).join("")}
      </div>
      ${restTimerMarkup(exercise)}
      <div class="set-management"><button class="add-set-button" data-action="add-set">${icons.plus}<span>Добавить сет</span></button><button class="remove-set-button" data-action="remove-set" ${exercise.setLogs.length <= 1 ? "disabled" : ""}><span>−</span> Удалить последний</button></div>
      <div class="effort-grid"><div class="field"><label>Тяжесть, RPE</label><select id="rpe">${[5,6,7,8,9,10].map((value) => `<option value="${value}" ${exercise.rpe == value ? "selected" : ""}>${value} — ${rpeLabel(value)}</option>`).join("")}</select></div><div class="field"><label>Боль, 0–10</label><select id="pain">${[0,1,2,3,4,5,6,7,8,9,10].map((value) => `<option value="${value}" ${exercise.pain == value ? "selected" : ""}>${value} — ${painLabel(value)}</option>`).join("")}</select></div></div>
      <div id="painGuidance">${painGuidanceMarkup(exercise.pain, exercise.id)}</div>
      <div class="workout-actions"><button class="secondary-button" data-action="prev-exercise" ${state.workoutIndex === 0 ? "disabled" : ""}>Назад</button><button class="primary-button" data-action="next-exercise">${state.workoutIndex === workout.exercises.length - 1 ? "Завершить" : "Следующее"} ${icons.arrow}</button></div>
    </article>
  </section>`;
  state.timerId = setInterval(() => {
    const timer = $("#workoutTimer");
    if (timer) timer.textContent = formatTimer();
    updateRestTimerUi();
  }, 1000);
  updateRestTimerUi();
}

function exactTrainingVolume(log) {
  if (!log?.entries?.length) return null;
  let hasSetData = false;
  let volume = 0;
  for (const entry of log.entries) {
    if (!Array.isArray(entry.sets)) continue;
    hasSetData = true;
    for (const set of entry.sets) {
      if (set.done === false) continue;
      volume += (Number(set.weight) || 0) * (Number(set.reps) || 0);
    }
  }
  return hasSetData ? Math.round(volume) : null;
}

function renderProgress() {
  const latest = state.analyses.at(-1) || null;
  const volumeSeries = state.logs
    .map((log) => ({ log, volume: exactTrainingVolume(log) }))
    .filter((item) => item.volume !== null && item.volume > 0)
    .slice(-8);
  const volumes = volumeSeries.map((item) => item.volume);
  const min = volumes.length ? Math.min(...volumes) : 0;
  const max = volumes.length ? Math.max(...volumes) : 0;
  const range = Math.max(1, max - min);
  const points = volumes.map((value, index) => {
    const x = volumes.length === 1 ? 170 : 20 + index * (300 / (volumes.length - 1));
    const y = 145 - ((value - min) / range) * 105;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const trend = volumes.length >= 2 && volumes[0] > 0 ? Math.round(((volumes.at(-1) - volumes[0]) / volumes[0]) * 100) : null;
  const trendText = trend === null ? "нужно минимум 2 тренировки с весами" : `${trend > 0 ? "+" : ""}${trend}% за доступный период`;
  const stateLabels = { progress: "+ нагрузка", reps: "+ повторения", deload: "облегчить", reduce: "замена", maintain: "закрепить" };

  root.innerHTML = `<section>
    <p class="eyebrow">Аналитика цикла</p><h1>Твой прогресс</h1><p class="subtle">Здесь нет декоративных процентов: показываем только то, что реально записано в журнале.</p>
    <article class="progress-hero glass-panel"><div class="plan-card-head"><div><p class="eyebrow">Рабочий объём</p><h2>${volumes.length ? `${volumes.at(-1).toLocaleString("ru-RU")} кг·повт.` : "Нет данных"}</h2><p class="subtle">${trendText}</p></div><span class="status-pill"><i></i>${volumes.length >= 2 ? "по журналу" : "собираем данные"}</span></div>
      ${volumes.length >= 2 ? `<div class="chart-wrap"><svg viewBox="0 0 340 170" preserveAspectRatio="none"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(118,138,121,.28)"/><stop offset="1" stop-color="rgba(118,138,121,0)"/></linearGradient></defs><path class="chart-grid" d="M20 35H320M20 85H320M20 135H320"/><path class="chart-area" d="M${points.join(" L")} L320 155 L20 155 Z"/><polyline class="chart-line" points="${points.join(" ")}"/>${points.map((point) => { const [cx, cy] = point.split(","); return `<circle class="chart-dot" cx="${cx}" cy="${cy}" r="5"/>`; }).join("")}</svg></div>` : `<div class="analytics-empty">После двух тренировок с записанными весами появится реальный график объёма.</div>`}
    </article>
    <div class="section-head"><h2>Ключевые показатели</h2></div>
    <div class="stat-grid"><div class="stat-card glass-panel"><b>${state.logs.length}</b><small>завершено</small></div><div class="stat-card glass-panel"><b>${latest?.metrics?.avgRpe ?? "—"}</b><small>средний RPE</small></div><div class="stat-card glass-panel"><b>${latest?.metrics?.readiness != null ? `${latest.metrics.readiness}%` : "—"}</b><small>готовность</small></div></div>
    <div class="section-head"><h2>История</h2></div>
    <article class="profile-card glass-panel">${state.logs.length ? state.logs.slice().reverse().map((log) => `<div class="history-row"><div class="history-date">${new Date(log.createdAt).toLocaleDateString("ru-RU", {day:"2-digit", month:"short"})}</div><div><b>${escapeHtml(log.title)}</b><small>${log.entries.length} упражнений · ${Math.round(log.duration/60)} мин${exactTrainingVolume(log) != null ? ` · ${exactTrainingVolume(log).toLocaleString("ru-RU")} кг·повт.` : ""}</small></div><span class="trend-up">${escapeHtml(stateLabels[log.analysisState] || "готово")}</span></div>`).join("") : `<div class="empty-state"><div class="emoji">📈</div><h3>Первая точка появится после тренировки</h3><p class="subtle">Журнал фиксирует реальные подходы, веса, повторения и RPE.</p></div>`}</article>
  </section>`;
}

function renderCoach() {
  root.innerHTML = `<section class="chat"><p class="eyebrow">Персональный помощник</p><h1>ИИ-тренер</h1>
    <div class="coach-intro glass-panel"><div class="coach-orb"><svg viewBox="0 0 24 24"><path d="M8 11a4 4 0 1 1 8 0v2a4 4 0 1 1-8 0Z"/><path d="M5 12H3m18 0h-2M12 3V1M7 19l-2 2m12-2 2 2"/></svg></div><div><h3>${state.config.aiEnabled ? "AI подключён" : "Локальный умный режим"}</h3><p>${state.config.aiEnabled ? `Модель ${escapeHtml(state.config.aiModel || "")}` : "Работает без ключа; в Railway можно включить полный ИИ"}</p></div></div>
    <div class="quick-prompts"><button class="prompt-chip">Когда увеличить вес?</button><button class="prompt-chip">Чем заменить упражнение?</button><button class="prompt-chip">Сегодня мало энергии</button></div>
    <div class="messages" id="messages">${state.messages.map((message) => `<div class="message ${message.role}">${escapeHtml(message.text)}</div>`).join("")}</div>
    <form class="chat-composer glass-panel" id="coachForm"><textarea id="coachInput" rows="1" placeholder="Напиши, что чувствуешь…"></textarea><button class="send-button" aria-label="Отправить"><svg viewBox="0 0 24 24"><path d="m5 12 14-8-4 16-3-6-7-2Z"/><path d="m12 14 7-10"/></svg></button></form>
  </section>`;
  requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
}

function openExercise(id) {
  const exercise = state.exercises.find((item) => item.id === id);
  if (!exercise) return;
  const muscleGroups = exercise.muscleGroups?.length ? exercise.muscleGroups : [exercise.muscle];
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="bottom-sheet technique-sheet" role="dialog" aria-modal="true" aria-label="Техника ${escapeHtml(exercise.name)}"><div class="sheet-handle"></div><div class="sheet-head"><div><p class="eyebrow">Техника выполнения</p><h2>${escapeHtml(exercise.name)}</h2><p class="subtle">${escapeHtml(exercise.muscle)}</p></div><button class="close-button" data-close-modal aria-label="Закрыть">×</button></div>
    <div class="instruction-art exercise-art-frame" data-art-contract="exercise-3x2">${exerciseArt(id, true)}</div>
    <div class="technique-strip">${exercise.cues.map((cue, index) => `<article class="technique-step"><span>${index + 1}</span><p>${escapeHtml(cue)}</p></article>`).join("")}</div>
    <div class="technique-columns">
      <div class="instruction-box muscle-box"><h3>Работающие мышцы</h3><div class="muscle-list">${muscleGroups.map((name, index) => `<span><i class="muscle-dot muscle-${(index % 3) + 1}"></i>${escapeHtml(name)}</span>`).join("")}</div></div>
      <div class="instruction-box recommendation-box"><h3>Рекомендации</h3><div class="recommendation-list"><span>◎ ${escapeHtml(exercise.defaultReps)}</span><span>◷ Отдых ${exercise.rest} сек.</span><span>↗ Вес — по технике и RPE</span></div></div>
    </div>
    <div class="instruction-box good"><h3>Ключевые моменты</h3><ul class="check-list">${exercise.cues.slice(0,5).map((cue) => `<li>${escapeHtml(cue)}</li>`).join("")}</ul></div>
    <div class="instruction-box bad"><h3>Чего избегать</h3><ul>${exercise.avoid.map((cue) => `<li>${escapeHtml(cue)}</li>`).join("")}</ul></div>
    <div class="safety-note"><b>Безопасная замена:</b> ${escapeHtml(exercise.alternative)}<br><br><b>Важно:</b> ${escapeHtml(exercise.contraindication)}</div>
  </section></div>`;
}

function openProfile() {
  const lastAudit = state.lastAuditReport;
  const lastAuditText = lastAudit
    ? new Date(lastAudit.generatedAt).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="bottom-sheet"><div class="sheet-handle"></div><div class="sheet-head"><div><p class="eyebrow">Профиль</p><h2>${escapeHtml(state.profile.name)}</h2></div><button class="close-button" data-close-modal>×</button></div>
    <article class="profile-card glass-panel" style="margin-top:14px"><div class="form-grid"><div class="field"><label>Рост</label><input value="${state.profile.height} см" disabled></div><div class="field"><label>Вес</label><input value="${state.profile.weight} кг" disabled></div><div class="field"><label>Тренировок</label><input value="${state.profile.daysPerWeek} / нед." disabled></div><div class="field"><label>Длительность</label><input value="${state.profile.duration} мин" disabled></div></div></article>
    <article class="diagnostic-card">
      <div class="diagnostic-card-head"><div><p class="eyebrow">App Audit</p><h3>Диагностика приложения</h3></div><span class="diagnostic-status">JSON</span></div>
      <p>Проверит экраны, workout flow, layout/overflow, touch targets, visual aspect-ratio contracts, CSS rules, exercise assets, PWA/runtime и целостность плана. Личные поля, сообщения и заметки в отчёт не попадают.</p>
      <button class="primary-button wide" data-action="run-app-audit" ${state.auditRunning ? "disabled" : ""}>${state.auditRunning ? "Анализирую…" : "Проверить всё приложение"}</button>
      ${lastAudit ? `<div class="diagnostic-last"><span>Последний отчёт · ${escapeHtml(lastAuditText)}</span><button class="text-button" data-action="save-app-audit">Сохранить JSON</button></div>` : ""}
    </article>
    <button class="secondary-button wide" style="width:100%;margin-top:12px" data-action="reset-app">Сбросить демо-данные</button>
    <p class="subtle" style="margin:14px 4px 0">FORMA AI v${escapeHtml(state.config.version)} · данные хранятся локально на устройстве.</p>
  </section></div>`;
}

function setAuditOverlay(message, detail = "") {
  let overlay = document.querySelector("#auditRunnerOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "auditRunnerOverlay";
    overlay.className = "audit-runner-overlay";
    overlay.innerHTML = `<div class="audit-runner-card"><span class="audit-spinner" aria-hidden="true"></span><div><b id="auditRunnerMessage"></b><small id="auditRunnerDetail"></small></div></div>`;
    document.body.append(overlay);
  }
  $("#auditRunnerMessage", overlay).textContent = message;
  $("#auditRunnerDetail", overlay).textContent = detail;
}

function clearAuditOverlay() {
  document.querySelector("#auditRunnerOverlay")?.remove();
}

function buildVisualTests(visualAudit) {
  const tests = [];
  const broken = visualAudit.visuals.filter((visual) => visual.visualReady && visual.response?.ok === false);
  tests.push({
    id: "visual.assets_resolve",
    status: broken.length ? "fail" : "pass",
    message: broken.length ? "Есть visual assets, которые не отдаются приложением." : "Все заявленные visual assets доступны по HTTP.",
    details: { broken: broken.map((visual) => ({ exerciseId: visual.exerciseId, url: visual.url, response: visual.response })) }
  });

  const undecodable = visualAudit.visuals.filter((visual) => visual.visualReady && (!visual.naturalWidth || !visual.naturalHeight));
  tests.push({
    id: "visual.assets_decode",
    status: undecodable.length ? "fail" : "pass",
    message: undecodable.length ? "Часть visual assets отдаются, но не декодируются как изображения." : "Все готовые visual assets декодируются как изображения.",
    details: { exerciseIds: undecodable.map((visual) => visual.exerciseId) }
  });

  tests.push({
    id: "visual.identity_unique",
    status: visualAudit.duplicates.length ? "fail" : "pass",
    message: visualAudit.duplicates.length ? "Разные упражнения используют один и тот же файл visual asset." : "Побайтно одинаковых visual assets не найдено.",
    details: { duplicateGroups: visualAudit.duplicates }
  });

  tests.push({
    id: "visual.identity_similarity",
    status: visualAudit.similarVisuals?.length ? "warn" : "pass",
    message: visualAudit.similarVisuals?.length ? "Есть visual assets с одинаковой perceptual signature; их стоит проверить на визуальное дублирование." : "Подозрительных perceptual-дубликатов не найдено.",
    details: { similarGroups: visualAudit.similarVisuals || [] }
  });

  const weakSharpness = visualAudit.visuals
    .filter((visual) => Number.isFinite(visual.sharpnessVsMedian) && visual.sharpnessVsMedian < 0.35)
    .map((visual) => ({ exerciseId: visual.exerciseId, sharpnessScore: visual.sharpnessScore, sharpnessVsMedian: visual.sharpnessVsMedian }));
  tests.push({
    id: "visual.relative_sharpness",
    status: weakSharpness.length ? "warn" : "pass",
    message: weakSharpness.length ? "Есть assets с резко меньшей детализацией относительно медианы библиотеки." : "Резких outlier'ов по относительной детализации не найдено.",
    details: { medianSharpness: visualAudit.medianSharpness, outliers: weakSharpness }
  });

  const expectedRatio = 3 / 2;
  const ratioOutliers = visualAudit.visuals
    .filter((visual) => visual.visualReady && Number.isFinite(visual.naturalAspectRatio))
    .map((visual) => ({ ...visual, relativeError: Math.abs(visual.naturalAspectRatio - expectedRatio) / expectedRatio }))
    .filter((visual) => visual.relativeError > 0.02)
    .map((visual) => ({ exerciseId: visual.exerciseId, naturalAspectRatio: visual.naturalAspectRatio, relativeError: Number(visual.relativeError.toFixed(4)) }));
  tests.push({
    id: "visual.standard_aspect_ratio",
    status: ratioOutliers.length ? "warn" : "pass",
    message: ratioOutliers.length ? "Часть готовых exercise assets нарушает стандартный формат 3:2." : "Готовые exercise assets соответствуют стандартному формату 3:2.",
    details: { expectedAspectRatio: expectedRatio, outliers: ratioOutliers }
  });

  const pendingVisuals = visualAudit.visuals
    .filter((visual) => visual.visualReady === false)
    .map((visual) => ({ exerciseId: visual.exerciseId, visualIssue: visual.visualIssue || "visual_pending" }));
  tests.push({
    id: "visual.library_readiness",
    status: pendingVisuals.length ? "warn" : "pass",
    message: pendingVisuals.length ? "В библиотеке есть упражнения с забракованным/не готовым media pack; они показываются только через безопасный placeholder." : "У всей библиотеки готовы visual packs.",
    details: { pending: pendingVisuals }
  });

  return tests;
}

function buildRuntimeTests(runtime) {
  const fatalCount = runtime.errors.length + runtime.rejections.length + runtime.resourceErrors.length;
  return [{
    id: "runtime.no_uncaught_errors",
    status: fatalCount ? "fail" : runtime.console.some((entry) => entry.level === "error") ? "warn" : "pass",
    message: fatalCount ? "Во время сессии зафиксированы uncaught/runtime/resource errors." : "Необработанных runtime ошибок не зафиксировано.",
    details: {
      windowErrors: runtime.errors.length,
      unhandledRejections: runtime.rejections.length,
      resourceErrors: runtime.resourceErrors.length,
      consoleErrors: runtime.console.filter((entry) => entry.level === "error").length,
      consoleWarnings: runtime.console.filter((entry) => entry.level === "warn").length
    }
  }];
}

function buildLayoutTests(snapshots) {
  const issues = snapshots.flatMap((snapshot) => (snapshot.issues || []).map((entry) => ({ ...entry, snapshot: snapshot.label })));
  const failed = issues.filter((entry) => entry.severity === "fail");
  const warnings = issues.filter((entry) => entry.severity === "warn");
  return [{
    id: "layout.no_structural_failures",
    status: failed.length ? "fail" : warnings.length ? "warn" : "pass",
    message: failed.length ? "Найдены структурные layout failures." : warnings.length ? "Структурных падений нет, но есть layout/a11y предупреждения." : "Автоматические layout-проверки не нашли проблем.",
    details: {
      failedCount: failed.length,
      warningCount: warnings.length,
      failedByType: Object.fromEntries([...new Set(failed.map((entry) => entry.id))].map((id) => [id, failed.filter((entry) => entry.id === id).length])),
      warningsByType: Object.fromEntries([...new Set(warnings.map((entry) => entry.id))].map((id) => [id, warnings.filter((entry) => entry.id === id).length]))
    }
  }];
}

function openAuditResult(report) {
  const summary = report.summary;
  const severity = summary.tests.failed || summary.layout.failed || summary.visuals.broken || summary.runtime.errors || summary.runtime.rejections || summary.runtime.resourceErrors
    ? "fail"
    : summary.tests.warnings || summary.layout.warnings || summary.visuals.duplicateGroups
      ? "warn"
      : "pass";
  const labels = { pass: "Чисто", warn: "Есть замечания", fail: "Нужен разбор" };
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="bottom-sheet audit-result-sheet"><div class="sheet-handle"></div>
    <div class="sheet-head"><div><p class="eyebrow">App Audit завершён</p><h2>${labels[severity]}</h2><p class="subtle">Отчёт содержит DOM geometry, computed CSS, matched rules и технические данные без имени, сообщений и заметок.</p></div><button class="close-button" data-close-modal aria-label="Закрыть">×</button></div>
    <div class="audit-summary-grid">
      <div><b>${summary.layout.snapshots}</b><small>снимков DOM</small></div>
      <div><b>${summary.layout.failed}</b><small>layout fail</small></div>
      <div><b>${summary.layout.warnings}</b><small>warning</small></div>
      <div><b>${summary.visuals.duplicateGroups}</b><small>visual duplicates</small></div>
    </div>
    <div class="audit-result-list">
      ${(report.tests || []).filter((test) => test.status !== "pass").slice(0, 8).map((test) => `<div class="audit-result-row ${test.status}"><span>${test.status === "fail" ? "!" : "•"}</span><div><b>${escapeHtml(test.id)}</b><small>${escapeHtml(test.message)}</small></div></div>`).join("") || `<div class="audit-result-row pass"><span>✓</span><div><b>Автопроверки зелёные</b><small>JSON всё равно сохраняет geometry и asset metrics для ручного инженерного разбора.</small></div></div>`}
    </div>
    <button class="primary-button wide" data-action="save-app-audit">Сохранить JSON</button>
    <button class="secondary-button wide" style="width:100%;margin-top:10px" data-close-modal>Закрыть</button>
  </section></div>`;
}

async function runFullAppAudit() {
  if (state.auditRunning) return;
  state.auditRunning = true;
  if (state.screen === "workout" && state.activeWorkout) collectCurrentExercise();

  const original = {
    screen: state.screen,
    workoutIndex: state.workoutIndex,
    activeWorkout: state.activeWorkout ? structuredClone(state.activeWorkout) : null,
    workoutStartedAt: state.workoutStartedAt,
    restTimer: state.restTimer ? structuredClone(state.restTimer) : null,
    scrollY: window.scrollY
  };
  const snapshots = [];

  try {
    modalRoot.innerHTML = "";
    setAuditOverlay("Анализ приложения", "Подготовка среды…");
    const environment = await collectEnvironment(state.config);
    const appState = sanitizeAppState(state);
    const dataTests = auditDataIntegrity({ state, exercises: state.exercises });

    const screens = ["home", "plan", "progress", "coach"];
    for (let index = 0; index < screens.length; index += 1) {
      const screen = screens[index];
      setAuditOverlay("Проверяю интерфейс", `${index + 1}/${screens.length} · ${screen}`);
      state.screen = screen;
      render();
      window.scrollTo({ top: 0, behavior: "instant" });
      snapshots.push(await captureDomSnapshot(`screen:${screen}`, { screen }));
    }

    if (state.plan) {
      state.screen = "workout";
      if (!state.activeWorkout) initActiveWorkout();
      const exercises = state.activeWorkout?.exercises || [];
      for (let index = 0; index < exercises.length; index += 1) {
        const exercise = exercises[index];
        setAuditOverlay("Проверяю тренировку", `${index + 1}/${exercises.length} · ${exercise.name}`);
        state.workoutIndex = index;
        renderWorkout();
        window.scrollTo({ top: 0, behavior: "instant" });
        snapshots.push(await captureDomSnapshot(`workout:${exercise.id}`, {
          screen: "workout",
          exerciseId: exercise.id,
          exerciseIndex: index,
          exerciseCount: exercises.length
        }));

        openExercise(exercise.id);
        snapshots.push(await captureDomSnapshot(`technique:${exercise.id}`, {
          modal: "technique",
          exerciseId: exercise.id
        }, modalRoot));
        modalRoot.innerHTML = "";
      }
    }

    state.screen = "home";
    render();
    openProfile();
    snapshots.push(await captureDomSnapshot("modal:profile", { modal: "profile" }, modalRoot));
    modalRoot.innerHTML = "";

    setAuditOverlay("Проверяю visual assets", `${state.exercises.length} упражнений…`);
    const visualAudit = await auditExerciseVisuals(state.exercises);
    const runtime = runtimeDiagnosticsSnapshot();
    const tests = [
      ...dataTests,
      ...buildVisualTests(visualAudit),
      ...buildLayoutTests(snapshots),
      ...buildRuntimeTests(runtime)
    ];

    const report = {
      schema: "forma.app-audit.v4",
      generatedAt: new Date().toISOString(),
      scope: "full-client-app",
      privacy: {
        redacted: true,
        excluded: ["profile.name", "profile.age", "profile.height", "profile.weight", "messages", "workout notes", "set weights/reps"]
      },
      environment,
      appState,
      tests,
      snapshots,
      visualAudit,
      runtime
    };
    report.summary = summarizeReport(report);
    state.lastAuditReport = report;
    return report;
  } finally {
    clearInterval(state.timerId);
    state.screen = original.screen;
    state.workoutIndex = original.workoutIndex;
    state.activeWorkout = original.activeWorkout;
    state.workoutStartedAt = original.workoutStartedAt;
    state.restTimer = original.restTimer;
    state.auditRunning = false;
    modalRoot.innerHTML = "";
    render();
    window.scrollTo({ top: original.scrollY, behavior: "instant" });
    clearAuditOverlay();
  }
}

function syncScheduleDraftFromForm() {
  const draft = state.profileDraft;
  if (!draft) return;
  draft.level = $("#level")?.value || draft.level;
  draft.daysPerWeek = Number($("#days")?.value || draft.daysPerWeek);
  draft.duration = Number($("#duration")?.value || draft.duration);
  draft.focus = $("#focus")?.value || draft.focus || "balanced";
  if (!Array.isArray(draft.trainingDays)) draft.trainingDays = [];
  if (draft.trainingDays.length > draft.daysPerWeek) draft.trainingDays = draft.trainingDays.slice(0, draft.daysPerWeek);
}

async function finishOnboarding() {
  const draft = state.profileDraft;
  syncScheduleDraftFromForm();
  draft.equipment = [...new Set(draft.equipment || [])];
  if (!draft.equipment.includes("bodyweight")) draft.equipment.push("bodyweight");
  if (draft.trainingDays.length !== draft.daysPerWeek) {
    toast(`Выбери ровно ${draft.daysPerWeek} тренировочных дня`);
    return;
  }
  try {
    const { plan } = await api("/api/plan/generate", { method: "POST", body: JSON.stringify({ profile: draft }) });
    state.profile = structuredClone(draft);
    state.plan = plan;
    state.onboardingStep = 1;
    $("#avatarText").textContent = (draft.name || "И").trim().charAt(0).toUpperCase();
    saveState();
    if (plan.coverage?.status === "limited") {
      const summary = constraintSummary(plan);
      toast(`План создан с ограничением: ${summary?.missingText || "не все паттерны закрыты"}`);
    } else {
      toast("Персональный цикл готов");
    }
    render();
  } catch (error) {
    toast(error.message);
  }
}

function collectCurrentExercise() {
  if (!state.activeWorkout) return;
  const exercise = state.activeWorkout.exercises[state.workoutIndex];
  $$('[data-set-weight]').forEach((input) => {
    const raw = input.value.trim();
    exercise.setLogs[Number(input.dataset.setWeight)].weight = raw === "" ? "" : (Number(raw) || 0);
  });
  $$('[data-set-reps]').forEach((input) => exercise.setLogs[Number(input.dataset.setReps)].reps = Number(input.value) || 0);
  exercise.rpe = Number($("#rpe")?.value || 7);
  exercise.pain = Number($("#pain")?.value || 0);
}

function openReadinessCheck() {
  collectCurrentExercise();
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="bottom-sheet"><div class="sheet-handle"></div><p class="eyebrow">Последний шаг</p><h2>Как ты себя чувствуешь?</h2><p class="subtle">Эти оценки влияют на следующую нагрузку сильнее, чем желание любой ценой добавить вес.</p><div class="form-grid"><div class="field"><label>Сон, 1–10</label><select id="sleepScore">${[1,2,3,4,5,6,7,8,9,10].map(v => `<option ${v===7 ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field"><label>Энергия, 1–10</label><select id="energyScore">${[1,2,3,4,5,6,7,8,9,10].map(v => `<option ${v===7 ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field full"><label>Настроение, 1–10</label><select id="moodScore">${[1,2,3,4,5,6,7,8,9,10].map(v => `<option ${v===8 ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field full"><label>Комментарий</label><input id="workoutNote" placeholder="Например: тяжело дались выпады" /></div></div><button class="primary-button wide" style="margin-top:15px" data-action="submit-readiness">Проанализировать тренировку</button></section></div>`;
}

function applyProgressionToPlan(analysis) {
  const collections = [state.plan?.workouts || [], ...(state.plan?.weeks || []).map((week) => week.workouts || [])];
  for (const recommendation of analysis.recommendations || []) {
    if (!recommendation.nextWeight || recommendation.unit !== "кг") continue;
    for (const workouts of collections) {
      for (const workout of workouts) {
        for (const exercise of workout.exercises || []) {
          if (exercise.id !== recommendation.exerciseId) continue;
          exercise.suggestedWeight = recommendation.nextWeight;
          exercise.plannedWeight = Math.round(recommendation.nextWeight * (exercise.loadMultiplier || 1) * 2) / 2;
        }
      }
    }
  }
}

function activatePlanWeek(week) {
  const plan = state.plan;
  const weekData = phaseForWeek(plan, week);
  if (!weekData) return;
  plan.week = weekData.week;
  plan.workouts = structuredClone(weekData.workouts);
  plan.workouts.forEach((workout, index) => { workout.status = index === 0 ? "today" : "planned"; });
}

async function advancePlanSchedule() {
  const plan = state.plan;
  const currentIndex = plan?.workouts?.findIndex((workout) => workout.status === "today") ?? -1;
  if (currentIndex < 0) return { cycleRefreshed: false };
  plan.workouts[currentIndex].status = "done";
  if (currentIndex < plan.workouts.length - 1) {
    plan.workouts[currentIndex + 1].status = "today";
    return { cycleRefreshed: false };
  }
  if (plan.week < (plan.cycleWeeks || 8)) {
    activatePlanWeek(plan.week + 1);
    return { cycleRefreshed: false };
  }
  const previousPlan = structuredClone(plan);
  const { plan: nextPlan } = await api("/api/plan/generate", {
    method: "POST",
    body: JSON.stringify({ profile: state.profile, cycleNumber: (plan.cycleNumber || 1) + 1 })
  });
  copySuggestedWeights(previousPlan, nextPlan);
  state.plan = nextPlan;
  return { cycleRefreshed: true };
}

async function finishWorkout(readiness = { sleep: 7, energy: 7, mood: 8 }, note = "") {
  collectCurrentExercise();
  const workout = state.activeWorkout;
  const entries = workout.exercises.map((exercise) => ({
    exerciseId: exercise.id,
    name: exercise.name,
    unit: exercise.unit,
    movementPattern: exercise.movementPattern,
    exerciseType: exercise.exerciseType,
    target: exercise.target,
    repRange: exercise.repRange,
    completed: exercise.setLogs.every((set) => set.done),
    sets: exercise.setLogs.map((set) => ({ weight: Number(set.weight) || 0, reps: Number(set.reps) || 0, done: Boolean(set.done) })),
    baseWeight: Number(exercise.suggestedWeight) || 0,
    weight: Math.max(...exercise.setLogs.map((set) => Number(set.weight) || 0)),
    rpe: exercise.rpe,
    pain: exercise.pain,
    painFlag: exercise.pain >= 5
  }));
  try {
    const { analysis } = await api("/api/workout/analyze", { method: "POST", body: JSON.stringify({ entries, readiness, history: state.logs.slice(-12) }) });
    applyProgressionToPlan(analysis);
    const scheduleUpdate = await advancePlanSchedule();
    state.analyses.push(analysis);
    state.logs.push({ createdAt: new Date().toISOString(), title: workout.title, phase: workout.phase, duration: Math.max(60, (Date.now() - state.workoutStartedAt) / 1000), entries, readiness, note, analysisState: analysis.state, metrics: analysis.metrics });
    state.activeWorkout = null;
    state.workoutStartedAt = null;
    state.restTimer = null;
    saveState();
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="bottom-sheet"><div class="sheet-handle"></div><p class="eyebrow">Анализ завершён</p><h2>${escapeHtml(analysis.headline)}</h2><p class="subtle">${escapeHtml(analysis.summary)}</p><span class="analysis-state">${scheduleUpdate.cycleRefreshed ? "Создан новый 8-недельный цикл" : "Double progression применена к плану"}</span><div class="analysis-metrics"><div><b>${analysis.metrics.completion}%</b><small>выполнено</small></div><div><b>${analysis.metrics.avgRpe}</b><small>средний RPE</small></div><div><b>${analysis.metrics.readiness}%</b><small>готовность</small></div></div><div class="instruction-box"><h3>Что меняем дальше</h3>${analysis.recommendations.slice(0,4).map((rec) => `<div class="history-row"><div><b>${escapeHtml(rec.name)}</b><small>${escapeHtml(rec.note)}</small></div><span class="trend-up">${escapeHtml(rec.action)}${rec.nextWeight ? ` · ${rec.nextWeight} ${escapeHtml(rec.unit)}` : ""}</span></div>`).join("")}</div><div class="safety-note">${escapeHtml(analysis.safety)}</div><button class="primary-button wide" style="margin-top:13px" data-action="analysis-done">Готово</button></section></div>`;
  } catch (error) {
    toast(error.message);
  }
}

async function sendCoachMessage(text) {
  const message = text.trim();
  if (!message) return;
  state.messages.push({ role: "user", text: message });
  renderCoach();
  const messages = $("#messages");
  const typing = document.createElement("div");
  typing.className = "message ai typing";
  typing.textContent = "Думаю ";
  messages.append(typing);
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  try {
    const { reply } = await api("/api/coach", { method: "POST", body: JSON.stringify({ message, context: { profile: state.profile, plan: state.plan, latestAnalysis: state.analyses.at(-1) || null } }) });
    state.messages.push({ role: "ai", text: reply.text });
    saveState();
    renderCoach();
  } catch (error) {
    typing.remove();
    toast(error.message);
  }
}

function setScreen(screen) {
  state.screen = screen;
  if (screen === "workout") initActiveWorkout();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("button, [data-exercise], [data-close-modal]");
  if (!target) return;

  if (target.dataset.screen) return setScreen(target.dataset.screen);
  if (target.dataset.restPreset) {
    const input = $("#restSeconds");
    if (input) input.value = target.dataset.restPreset;
    return;
  }
  if (target.dataset.replacementId) return applySessionReplacement(target.dataset.replacementId);
  if (target.dataset.exercise) return openExercise(target.dataset.exercise);
  if (target.hasAttribute("data-close-modal")) {
    if (event.target === target || target.matches("button")) modalRoot.innerHTML = "";
    return;
  }
  if (target.dataset.goal) {
    state.profileDraft.goal = target.dataset.goal;
    renderOnboarding();
    return;
  }
  if (target.dataset.location) {
    syncScheduleDraftFromForm();
    const id = target.dataset.location;
    const previousLocation = state.profileDraft.trainingLocation;
    state.profileDraft.trainingLocation = id;
    if (id === "gym") state.profileDraft.equipment = ["bodyweight", "dumbbells", "barbell", "cable", "machine"];
    if (id === "home" && previousLocation === "gym") state.profileDraft.equipment = ["bodyweight"];
    if (id === "mixed" && previousLocation === "gym") state.profileDraft.equipment = ["bodyweight", "dumbbells"];
    renderOnboarding();
    return;
  }
  if (target.dataset.equipment) {
    syncScheduleDraftFromForm();
    const id = target.dataset.equipment;
    if (id === "bodyweight" && state.profileDraft.equipment.includes(id)) return toast("Собственный вес всегда доступен как безопасный fallback");
    state.profileDraft.equipment = state.profileDraft.equipment.includes(id)
      ? state.profileDraft.equipment.filter((item) => item !== id)
      : [...state.profileDraft.equipment, id];
    renderOnboarding();
    return;
  }
  if (target.dataset.trainingDay !== undefined) {
    syncScheduleDraftFromForm();
    const day = Number(target.dataset.trainingDay);
    const days = state.profileDraft.trainingDays || [];
    if (days.includes(day)) state.profileDraft.trainingDays = days.filter((item) => item !== day);
    else if (days.length < state.profileDraft.daysPerWeek) state.profileDraft.trainingDays = [...days, day].sort((a, b) => a - b);
    else return toast(`Можно выбрать ${state.profileDraft.daysPerWeek} тренировочных дня`);
    renderOnboarding();
    return;
  }
  if (target.dataset.onboarding === "next") {
    if (state.onboardingStep === 1) {
      const fields = ["name", "age", "height", "weight"];
      fields.forEach((id) => { state.profileDraft[id] = $("#" + id)?.value.trim() || ""; });
      state.profileDraft.sex = $("#sex")?.value || "unspecified";
      const valid = state.profileDraft.name && Number(state.profileDraft.age) >= 14 && Number(state.profileDraft.age) <= 90 && Number(state.profileDraft.height) >= 120 && Number(state.profileDraft.weight) >= 30;
      if (!valid) { fields.forEach((id) => $("#" + id)?.classList.toggle("invalid", !state.profileDraft[id])); toast("Заполни основные параметры"); return; }
    }
    if (state.onboardingStep === 2 && !state.profileDraft.goal) return toast("Выбери основную цель");
    state.onboardingStep += 1; renderOnboarding(); return;
  }
  if (target.dataset.onboarding === "back") { state.onboardingStep = Math.max(1, state.onboardingStep - 1); renderOnboarding(); return; }
  if (target.dataset.onboarding === "finish") return finishOnboarding();

  if (target.dataset.setDone !== undefined) {
    collectCurrentExercise();
    const index = Number(target.dataset.setDone);
    const exercise = state.activeWorkout.exercises[state.workoutIndex];
    exercise.setLogs[index].done = !exercise.setLogs[index].done;
    if (exercise.setLogs[index].done) startRestTimer(exercise, index);
    else if (state.restTimer?.exerciseId === exercise.id && state.restTimer?.setIndex === index) clearRestTimer({ persist: false });
    saveState();
    renderWorkout();
    return;
  }

  const action = target.dataset.action;
  if (action === "open-replacement") return openReplacement();
  if (action === "edit-rest") return openRestEditor();
  if (action === "save-rest") return saveRestEditor();
  if (action === "rest-add") {
    if (!state.restTimer) return;
    state.restTimer.until = Math.max(Date.now(), Number(state.restTimer.until) || Date.now()) + 15_000;
    state.restTimer.notified = false;
    saveState();
    renderWorkout();
    return;
  }
  if (action === "rest-skip") {
    clearRestTimer();
    renderWorkout();
    return;
  }
  if (action === "add-set") {
    collectCurrentExercise();
    const exercise = state.activeWorkout?.exercises?.[state.workoutIndex];
    if (!exercise) return;
    const result = addSetLog(exercise);
    if (!result.added) return toast(result.reason === "max_sets" ? "Максимум 10 сетов на упражнение" : "Не удалось добавить сет");
    saveState();
    renderWorkout();
    return;
  }
  if (action === "remove-set") {
    collectCurrentExercise();
    const exercise = state.activeWorkout?.exercises?.[state.workoutIndex];
    if (!exercise) return;
    const result = removeLastSetLog(exercise);
    if (!result.removed) return toast(result.reason === "min_sets" ? "Оставь хотя бы один рабочий сет" : "Не удалось удалить сет");
    if (state.restTimer?.exerciseId === exercise.id && Number(state.restTimer.setIndex) >= exercise.setLogs.length) clearRestTimer({ persist: false });
    saveState();
    renderWorkout();
    return;
  }
  if (action === "exit-workout") { collectCurrentExercise(); saveState(); return setScreen("plan"); }
  if (action === "home") return setScreen("home");
  if (action === "profile") return openProfile();
  if (action === "run-app-audit") {
    try {
      const report = await runFullAppAudit();
      openAuditResult(report);
    } catch (error) {
      console.error("App audit failed", error);
      toast(`Диагностика не завершена: ${error.message || "неизвестная ошибка"}`);
    }
    return;
  }
  if (action === "save-app-audit") {
    if (!state.lastAuditReport) return toast("Сначала запусти диагностику");
    const filename = downloadAuditJson(state.lastAuditReport);
    toast(`Сохранён ${filename}`);
    return;
  }
  if (action === "plan") return setScreen("plan");
  if (action === "start-workout") return setScreen("workout");
  if (action === "prev-exercise") { collectCurrentExercise(); clearRestTimer({ persist: false }); state.workoutIndex = Math.max(0, state.workoutIndex - 1); saveState(); renderWorkout(); return; }
  if (action === "next-exercise") { collectCurrentExercise(); clearRestTimer({ persist: false }); if (state.workoutIndex < state.activeWorkout.exercises.length - 1) { state.workoutIndex += 1; saveState(); renderWorkout(); } else { saveState(); openReadinessCheck(); } return; }
  if (action === "submit-readiness") { const readiness = { sleep: Number($("#sleepScore")?.value || 7), energy: Number($("#energyScore")?.value || 7), mood: Number($("#moodScore")?.value || 8) }; const note = $("#workoutNote")?.value.trim() || ""; target.disabled = true; target.textContent = "Анализирую…"; await finishWorkout(readiness, note); return; }
  if (action === "analysis-done") { modalRoot.innerHTML = ""; setScreen("progress"); return; }
  if (action === "reset-app") { localStorage.removeItem("forma-ai-state"); location.reload(); return; }
  if (action === "install") {
    if (state.deferredInstall) { state.deferredInstall.prompt(); await state.deferredInstall.userChoice; state.deferredInstall = null; }
    else toast("На iPhone: Поделиться → На экран «Домой»");
  }

  if (target.classList.contains("prompt-chip")) sendCoachMessage(target.textContent);
});

document.addEventListener("input", (event) => {
  if (state.screen !== "workout" || !state.activeWorkout) return;
  const exercise = state.activeWorkout.exercises[state.workoutIndex];
  if (event.target.dataset?.setWeight !== undefined) {
    const raw = event.target.value.trim();
    exercise.setLogs[Number(event.target.dataset.setWeight)].weight = raw === "" ? "" : (Number(raw) || 0);
    scheduleSaveState();
  }
  if (event.target.dataset?.setReps !== undefined) {
    exercise.setLogs[Number(event.target.dataset.setReps)].reps = Number(event.target.value) || 0;
    scheduleSaveState();
  }
});

document.addEventListener("change", (event) => {
  if (state.screen !== "workout" || !state.activeWorkout) return;
  const exercise = state.activeWorkout.exercises[state.workoutIndex];
  if (event.target.id === "rpe") {
    exercise.rpe = Number(event.target.value) || 7;
    saveState();
  }
  if (event.target.id === "pain") {
    exercise.pain = Number(event.target.value) || 0;
    saveState();
    updatePainGuidance();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "coachForm") return;
  event.preventDefault();
  const input = $("#coachInput");
  const text = input.value;
  input.value = "";
  sendCoachMessage(text);
});

window.addEventListener("pagehide", () => {
  if (state.screen === "workout" && state.activeWorkout) collectCurrentExercise();
  saveState();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "hidden") return;
  if (state.screen === "workout" && state.activeWorkout) collectCurrentExercise();
  saveState();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.deferredInstall = event;
});


async function ensureCurrentPlanSchema() {
  if (!state.profile) return;
  const valid = state.plan?.planRevision === 6 && state.plan?.cycleWeeks === 8 && Array.isArray(state.plan?.weeks) && state.plan.weeks.length === 8;
  if (valid) return;
  const previous = state.plan;
  const { plan } = await api("/api/plan/generate", { method: "POST", body: JSON.stringify({ profile: state.profile, cycleNumber: previous?.cycleNumber || 1 }) });
  if (previous) copySuggestedWeights(previous, plan);
  state.plan = plan;
  state.activeWorkout = null;
  state.workoutStartedAt = null;
  state.restTimer = null;
  saveState();
}

async function boot() {
  loadState();
  try {
    const [config, library] = await Promise.all([api("/api/config"), api("/api/exercises")]);
    state.config = config;
    state.exercises = library.exercises;
    await ensureCurrentPlanSchema();
  } catch (error) {
    console.warn(error);
  }
  if (state.profile) $("#avatarText").textContent = (state.profile.name || "И").trim().charAt(0).toUpperCase();
  render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(console.warn);
}

boot();
