import { addSetLog } from "./workout-state.js";

const state = {
  screen: "home",
  onboardingStep: 1,
  profile: null,
  plan: null,
  exercises: [],
  activeWorkout: null,
  workoutIndex: 0,
  workoutStartedAt: null,
  timerId: null,
  logs: [],
  analyses: [],
  messages: [
    { role: "ai", text: "Привет. Я буду менять план по фактическим весам, повторениям и самочувствию. Что нужно скорректировать?" }
  ],
  config: { aiEnabled: false, mode: "local", version: "0.3.0" },
  deferredInstall: null
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

function saveState() {
  localStorage.setItem("forma-ai-state", JSON.stringify({
    profile: state.profile,
    plan: state.plan,
    logs: state.logs,
    analyses: state.analyses,
    messages: state.messages.slice(-30)
  }));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("forma-ai-state") || "null");
    if (!saved) return;
    state.profile = saved.profile || null;
    state.plan = saved.plan || null;
    state.logs = saved.logs || [];
    state.analyses = saved.analyses || [];
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

const exerciseVisuals = Object.freeze({
  goblet_squat: "/assets/exercises/goblet_squat.webp",
  romanian_deadlift: "/assets/exercises/romanian_deadlift.webp",
  incline_pushup: "/assets/exercises/incline_pushup.webp",
  lat_pulldown: "/assets/exercises/lat_pulldown.webp",
  glute_bridge: "/assets/exercises/glute_bridge.webp",
  hip_thrust: "/assets/exercises/hip_thrust.webp",
  reverse_lunge: "/assets/exercises/reverse_lunge.webp",
  split_squat: "/assets/exercises/split_squat.webp",
  step_up: "/assets/exercises/step_up.webp",
  calf_raise: "/assets/exercises/calf_raise.webp",
  leg_abduction: "/assets/exercises/leg_abduction.webp",
  back_extension: "/assets/exercises/back_extension.webp",
  dumbbell_row: "/assets/exercises/dumbbell_row.webp",
  face_pull: "/assets/exercises/face_pull.webp",
  rear_delt_fly: "/assets/exercises/rear_delt_fly.webp",
  shoulder_press: "/assets/exercises/shoulder_press.webp",
  lateral_raise: "/assets/exercises/lateral_raise.webp",
  dead_bug: "/assets/exercises/dead_bug.webp",
  plank: "/assets/exercises/plank.webp"
});

function exerciseArt(id, large = false) {
  const src = exerciseVisuals[id] || exerciseVisuals.goblet_squat;
  return `<img class="exercise-art-image${large ? " is-large" : ""}" src="${src}" alt="Техника выполнения упражнения" ${large ? 'loading="eager"' : 'loading="lazy"'} decoding="async" draggable="false">`;
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

function rotationForWeek(plan, week = plan?.week || 1) {
  if (!plan?.rotations?.length) return null;
  const index = Math.min(plan.rotations.length - 1, Math.floor((Math.max(1, week) - 1) / (plan.rotationEveryWeeks || 2)));
  return plan.rotations[index] || null;
}

function copySuggestedWeights(fromPlan, toPlan) {
  const weights = new Map();
  const collect = (workouts = []) => workouts.forEach((workout) => (workout.exercises || []).forEach((exercise) => {
    if (exercise.suggestedWeight) weights.set(exercise.id, Math.max(weights.get(exercise.id) || 0, exercise.suggestedWeight));
  }));
  collect(fromPlan?.workouts);
  (fromPlan?.rotations || []).forEach((rotation) => collect(rotation.workouts));
  const apply = (workouts = []) => workouts.forEach((workout) => (workout.exercises || []).forEach((exercise) => {
    if (weights.has(exercise.id)) exercise.suggestedWeight = weights.get(exercise.id);
  }));
  apply(toPlan?.workouts);
  (toPlan?.rotations || []).forEach((rotation) => apply(rotation.workouts));
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
  $(".bottom-nav").hidden = false;
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
    goal: "",
    level: "beginner",
    daysPerWeek: 3,
    duration: 45,
    equipment: ["gym"],
    trainingDays: [0, 2, 4]
  };
  state.profileDraft = draft;

  if (step === 1) {
    root.innerHTML = `<section class="onboarding">
      <div class="onboarding-top"><div class="brand"><span class="brand-mark">F</span><span><b>FORMA</b><small>AI COACH</small></span></div><span class="step-counter">1 из 3</span></div>
      <div class="onboarding-card glass-panel">
        <p class="eyebrow">Начнём с основы</p>
        <h1>Расскажи немного о себе</h1>
        <p class="subtle">Эти данные нужны для стартовой нагрузки и безопасного объёма.</p>
        <div class="form-grid">
          <div class="field full"><label>Имя</label><input id="name" autocomplete="name" placeholder="Например, Иван" value="${escapeHtml(draft.name)}" /></div>
          <div class="field"><label>Возраст</label><input id="age" inputmode="numeric" placeholder="30" value="${escapeHtml(draft.age)}" /></div>
          <div class="field"><label>Рост, см</label><input id="height" inputmode="decimal" placeholder="175" value="${escapeHtml(draft.height)}" /></div>
          <div class="field full"><label>Вес, кг</label><input id="weight" inputmode="decimal" placeholder="75" value="${escapeHtml(draft.weight)}" /></div>
        </div>
      </div>
      <div class="onboarding-actions single"><button class="primary-button wide" data-onboarding="next">Продолжить ${icons.arrow}</button></div>
    </section>`;
  } else if (step === 2) {
    const options = [
      ["strength", "⚡️", "Стать сильнее", "Фокус на технике и прогрессии рабочих весов"],
      ["muscle", "◌", "Набрать мышцы", "Постепенный рост объёма и нагрузки"],
      ["fat_loss", "↘", "Снизить вес", "Силовая основа и контролируемая плотность"],
      ["wellness", "✦", "Тонус и самочувствие", "Умеренная нагрузка без перегруза"]
    ];
    root.innerHTML = `<section class="onboarding">
      <div class="onboarding-top"><button class="text-button" data-onboarding="back">← Назад</button><span class="step-counter">2 из 3</span></div>
      <div class="onboarding-card glass-panel">
        <p class="eyebrow">Главный ориентир</p>
        <h1>Какая цель сейчас важнее?</h1>
        <p class="subtle">План можно изменить позже — история и прогресс сохранятся.</p>
        <div class="choice-grid">${options.map(([id, icon, title, text]) => `<button class="choice-card ${draft.goal === id ? "selected" : ""}" data-goal="${id}"><span class="choice-icon">${icon}</span><b>${title}</b><small>${text}</small></button>`).join("")}</div>
      </div>
      <div class="onboarding-actions"><button class="secondary-button" data-onboarding="back">Назад</button><button class="primary-button" data-onboarding="next">Продолжить ${icons.arrow}</button></div>
    </section>`;
  } else {
    const equip = [["gym", "Тренажёрный зал"], ["home", "Дом"], ["dumbbells", "Только гантели"], ["bodyweight", "Без оборудования"]];
    root.innerHTML = `<section class="onboarding">
      <div class="onboarding-top"><button class="text-button" data-onboarding="back">← Назад</button><span class="step-counter">3 из 3</span></div>
      <div class="onboarding-card glass-panel">
        <p class="eyebrow">Режим тренировок</p>
        <h1>Соберём удобный график</h1>
        <div class="form-grid">
          <div class="field full"><label>Уровень</label><select id="level"><option value="beginner" ${draft.level === "beginner" ? "selected" : ""}>Начинающий</option><option value="intermediate" ${draft.level === "intermediate" ? "selected" : ""}>Средний</option><option value="advanced" ${draft.level === "advanced" ? "selected" : ""}>Продвинутый</option></select></div>
          <div class="field"><label>Дней в неделю</label><select id="days"><option ${draft.daysPerWeek == 2 ? "selected" : ""}>2</option><option ${draft.daysPerWeek == 3 ? "selected" : ""}>3</option><option ${draft.daysPerWeek == 4 ? "selected" : ""}>4</option><option ${draft.daysPerWeek == 5 ? "selected" : ""}>5</option></select></div>
          <div class="field"><label>Минут</label><select id="duration"><option ${draft.duration == 30 ? "selected" : ""}>30</option><option ${draft.duration == 45 ? "selected" : ""}>45</option><option ${draft.duration == 60 ? "selected" : ""}>60</option></select></div>
        </div>
        <div class="choice-grid">${equip.map(([id, title]) => `<button class="choice-card ${draft.equipment.includes(id) ? "selected" : ""}" data-equipment="${id}"><span class="choice-icon">✓</span><b>${title}</b><small>${id === "gym" ? "Все тренажёры и свободные веса" : "План будет отфильтрован по доступной нагрузке"}</small></button>`).join("")}</div>
      </div>
      <div class="onboarding-actions"><button class="secondary-button" data-onboarding="back">Назад</button><button class="primary-button" data-onboarding="finish">Создать план</button></div>
    </section>`;
  }
}

function renderHome() {
  $(".topbar").hidden = false;
  $(".bottom-nav").hidden = false;
  const workout = getTodayWorkout();
  const completed = state.logs.length;
  const streak = Math.min(9, completed + 2);
  const readiness = state.analyses.at(-1)?.metrics?.readiness || 76;
  root.innerHTML = `<section>
    <p class="eyebrow">Добрый вечер, ${escapeHtml(state.profile.name || "спортсмен")}</p>
    <h1>Тело готово<br>к движению</h1>
    <p class="subtle">Сегодня без гонки за цифрами: качественные повторения и запас сил.</p>

    <article class="hero-card glass-panel">
      <div class="hero-top"><span class="goal-pill"><i></i>${escapeHtml(state.plan.goalLabel)}</span>
        <div class="readiness"><svg viewBox="0 0 64 64"><circle class="track" cx="32" cy="32" r="28"/><circle class="value" cx="32" cy="32" r="28" style="stroke-dashoffset:${176 - 1.76 * readiness}"/></svg><div class="readiness-text">${readiness}<small>готовность</small></div></div>
      </div>
      <h2>${escapeHtml(workout?.title || "Восстановление")}</h2>
      <div class="hero-meta"><span>${workout?.duration || 30} мин</span><span>•</span><span>${workout?.exercises?.length || 0} упражнений</span><span>•</span><span>RPE 7</span></div>
      <div class="hero-action"><button class="primary-button" data-action="start-workout">${icons.play} Начать тренировку</button><span class="subtle">${workout?.dayName || "Сегодня"}</span></div>
    </article>

    <div class="section-head"><h2>Твоя неделя</h2><button class="text-button" data-action="plan">Открыть план</button></div>
    <div class="stat-grid">
      <div class="stat-card glass-panel"><span class="stat-icon">${icons.dumbbell}</span><b>${completed}</b><small>тренировок</small></div>
      <div class="stat-card glass-panel"><span class="stat-icon">${icons.flame}</span><b>${streak}</b><small>дней серии</small></div>
      <div class="stat-card glass-panel"><span class="stat-icon">${icons.moon}</span><b>7.4</b><small>часов сна</small></div>
    </div>

    <div class="section-head"><h2>Сегодня</h2><button class="text-button" data-action="start-workout">Все упражнения</button></div>
    <div>${(workout?.exercises || []).slice(0, 3).map((exercise) => `<article class="workout-card glass-panel" data-exercise="${exercise.id}"><div class="exercise-thumb">${exerciseArt(exercise.id)}</div><div class="workout-info"><h3>${escapeHtml(exercise.name)}</h3><p>${exercise.sets} подхода · ${escapeHtml(exercise.target)} · ${exercise.rest} сек.</p></div><button class="chevron">${icons.arrow}</button></article>`).join("")}</div>
  </section>`;
}

function renderPlan() {
  const plan = state.plan;
  const currentRotation = rotationForWeek(plan);
  const weekDays = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const workoutByDay = new Map((plan.workouts || []).map((workout) => [workout.dayIndex, workout]));
  root.innerHTML = `<section class="plan-screen">
    <div class="plan-title-row">
      <div><p class="eyebrow">Персональный цикл ${plan.cycleNumber || 1}</p><h1>План на ${plan.cycleWeeks || 8} недель</h1><p class="subtle">${escapeHtml(plan.summary)}</p></div>
      <span class="cycle-pill">Неделя ${plan.week} из ${plan.cycleWeeks || 8}</span>
    </div>

    <div class="plan-policy-grid">
      <article class="policy-card sport-card"><span class="policy-icon">${icons.rotate}</span><div><b>Смена упражнений<br>каждые ${plan.rotationEveryWeeks || 2} недели</b><small>${escapeHtml(currentRotation?.label || "Текущий блок")} · паттерны сохраняются</small></div></article>
      <article class="policy-card sport-card"><span class="policy-icon warm">${icons.spark}</span><div><b>Полное обновление<br>каждые ${plan.cycleWeeks || 8} недель</b><small>Новый цикл с другими акцентами и вариациями</small></div></article>
    </div>

    <div class="section-head compact"><div><p class="eyebrow">Ближайшие тренировки</p><h2>Эта неделя</h2></div><span class="rotation-badge">Блок ${plan.rotationIndex + 1 || 1} / ${plan.rotationBlocks || 4}</span></div>

    ${(plan.workouts || []).map((workout, index) => `<article class="plan-card premium-card ${workout.status === "today" ? "today" : ""}">
      <div class="plan-card-head"><div><div class="day-title"><span class="day-badge">${workout.dayName}</span><h3>${escapeHtml(workout.title)}</h3><span class="duration-pill">${workout.duration} мин</span></div><p class="subtle">${escapeHtml(workout.focus)}</p></div><span class="workout-state ${workout.status}">${workout.status === "done" ? icons.check : workout.exercises.length}</span></div>
      <div class="exercise-preview-row">${workout.exercises.slice(0,4).map((exercise) => `<button class="exercise-preview" data-exercise="${exercise.id}" aria-label="${escapeHtml(exercise.name)}"><span class="exercise-preview-art">${exerciseArt(exercise.id)}</span><b>${escapeHtml(exercise.name)}</b><small>${exercise.sets}×${escapeHtml(exercise.target)}</small></button>`).join("")}</div>
      <div class="plan-card-footer"><span>${workout.exercises.length} упражнений</span>${workout.status === "today" ? `<button class="start-inline" data-action="start-workout">${icons.play} Начать</button>` : `<span class="focus-label">${escapeHtml(workout.focus.split(" · ")[0])}</span>`}</div>
    </article>`).join("")}

    <div class="section-head compact"><div><p class="eyebrow">Расписание недели</p><h2>Ритм и восстановление</h2></div></div>
    <div class="schedule-grid">${weekDays.map((dayName, dayIndex) => {
      const workout = workoutByDay.get(dayIndex);
      return `<div class="schedule-day ${workout ? "training" : "rest"}"><b>${dayName}</b><span>${workout ? escapeHtml(workout.title) : "Отдых"}</span></div>`;
    }).join("")}</div>

    <article class="analysis-card premium-card"><span class="analysis-state">Умная прогрессия</span><h3>План меняется по факту, а не по календарю</h3><p class="subtle">Вес, повторения и следующие нагрузки учитывают завершённость подходов, RPE, боль и восстановление. Смена упражнений каждые две недели не сбрасывает накопленную прогрессию.</p></article>
  </section>`;
}

function initActiveWorkout() {
  if (state.activeWorkout) return;
  const source = structuredClone(getTodayWorkout());
  if (!source) return;
  source.exercises.forEach((exercise) => {
    exercise.setLogs = Array.from({ length: exercise.sets }, (_, index) => ({
      set: index + 1,
      weight: exercise.suggestedWeight || "",
      reps: parseInt(exercise.target, 10) || 10,
      done: false
    }));
    exercise.rpe = 7;
    exercise.pain = 0;
  });
  state.activeWorkout = source;
  state.workoutIndex = 0;
  state.workoutStartedAt = Date.now();
}

function renderWorkout() {
  initActiveWorkout();
  if (!state.activeWorkout) {
    root.innerHTML = `<div class="empty-state premium-card"><div class="emoji">🌿</div><h2>Сегодня восстановление</h2><p class="subtle">В плане пока нет активной тренировки.</p></div>`;
    return;
  }
  const workout = state.activeWorkout;
  const exercise = workout.exercises[state.workoutIndex];
  const setCount = Math.max(1, exercise.setLogs.length);
  const progress = ((state.workoutIndex + exercise.setLogs.filter((item) => item.done).length / setCount) / workout.exercises.length) * 100;
  root.innerHTML = `<section class="workout-screen">
    <div class="workout-header"><div><p class="eyebrow">${escapeHtml(workout.dayName)} · ${escapeHtml(workout.title)}</p><h1>${escapeHtml(exercise.name)}</h1><p class="subtle">Упражнение ${state.workoutIndex + 1} из ${workout.exercises.length}</p></div><div class="timer-badge premium-card" id="workoutTimer">${formatTimer()}</div></div>
    <div class="progress-track" aria-label="Прогресс тренировки"><span style="width:${progress}%"></span></div>
    <article class="current-exercise premium-card">
      <button class="current-art" data-exercise="${exercise.id}" aria-label="Открыть технику ${escapeHtml(exercise.name)}">${exerciseArt(exercise.id, true)}<span class="art-hint">Техника</span></button>
      <div class="exercise-title-row"><div><div class="exercise-meta-row"><span class="muscle-pill">${escapeHtml(exercise.muscle)}</span><span>Отдых ${exercise.rest} сек.</span></div></div><button class="info-button" data-exercise="${exercise.id}" aria-label="Техника упражнения">i</button></div>
      <div class="sets-grid"><span class="label">Сет</span><span class="label">Вес</span><span class="label">Повт.</span><span class="label">Готово</span>
        ${exercise.setLogs.map((set, index) => `<span class="set-index">${index + 1}</span><input class="set-input" inputmode="decimal" data-set-weight="${index}" value="${set.weight}" aria-label="Вес подхода ${index+1}"/><input class="set-input" inputmode="numeric" data-set-reps="${index}" value="${set.reps}" aria-label="Повторения подхода ${index+1}"/><button class="set-check ${set.done ? "done" : ""}" data-set-done="${index}" aria-label="Отметить подход">${icons.check}</button>`).join("")}
      </div>
      <button class="add-set-button" data-action="add-set">${icons.plus}<span>Добавить сет</span></button>
      <div class="effort-grid"><div class="field"><label>Тяжесть, RPE</label><select id="rpe">${[5,6,7,8,9,10].map((value) => `<option value="${value}" ${exercise.rpe == value ? "selected" : ""}>${value} — ${rpeLabel(value)}</option>`).join("")}</select></div><div class="field"><label>Боль, 0–10</label><select id="pain">${[0,1,2,3,4,5,6,7,8,9,10].map((value) => `<option value="${value}" ${exercise.pain == value ? "selected" : ""}>${value} — ${painLabel(value)}</option>`).join("")}</select></div></div>
      <div class="workout-actions"><button class="secondary-button" data-action="prev-exercise" ${state.workoutIndex === 0 ? "disabled" : ""}>Назад</button><button class="primary-button" data-action="next-exercise">${state.workoutIndex === workout.exercises.length - 1 ? "Завершить" : "Следующее"} ${icons.arrow}</button></div>
    </article>
  </section>`;
  state.timerId = setInterval(() => { const timer = $("#workoutTimer"); if (timer) timer.textContent = formatTimer(); }, 1000);
}

function renderProgress() {
  const latest = state.analyses.at(-1);
  const values = state.logs.length ? [38, 46, 51, 58, 61, 69, Math.min(88, 72 + state.logs.length * 2)] : [35, 40, 46, 51, 58, 63, 68];
  const points = values.map((v, i) => `${20 + i * 50},${145 - v}`).join(" ");
  root.innerHTML = `<section>
    <p class="eyebrow">Аналитика цикла</p><h1>Твой прогресс</h1><p class="subtle">Смотрим не только на вес, но и на качество, регулярность и восстановление.</p>
    <article class="progress-hero glass-panel"><div class="plan-card-head"><div><p class="eyebrow">Тренировочный объём</p><h2>+${12 + state.logs.length * 3}%</h2><p class="subtle">за последние четыре недели</p></div><span class="status-pill"><i></i>стабильно</span></div>
      <div class="chart-wrap"><svg viewBox="0 0 340 170" preserveAspectRatio="none"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(118,138,121,.28)"/><stop offset="1" stop-color="rgba(118,138,121,0)"/></linearGradient></defs><path class="chart-grid" d="M20 35H320M20 85H320M20 135H320"/><path class="chart-area" d="M${points} L320 155 L20 155 Z"/><polyline class="chart-line" points="${points}"/>${values.map((v,i) => `<circle class="chart-dot" cx="${20+i*50}" cy="${145-v}" r="5"/>`).join("")}</svg></div>
    </article>
    <div class="section-head"><h2>Ключевые показатели</h2></div>
    <div class="stat-grid"><div class="stat-card glass-panel"><b>${state.logs.length}</b><small>завершено</small></div><div class="stat-card glass-panel"><b>${latest?.metrics?.avgRpe || "7.2"}</b><small>средний RPE</small></div><div class="stat-card glass-panel"><b>${latest?.metrics?.readiness || 76}%</b><small>готовность</small></div></div>
    <div class="section-head"><h2>История</h2></div>
    <article class="profile-card glass-panel">${state.logs.length ? state.logs.slice().reverse().map((log) => `<div class="history-row"><div class="history-date">${new Date(log.createdAt).toLocaleDateString("ru-RU", {day:"2-digit", month:"short"})}</div><div><b>${escapeHtml(log.title)}</b><small>${log.entries.length} упражнений · ${Math.round(log.duration/60)} мин</small></div><span class="trend-up">${log.analysisState === "progress" ? "+ вес" : "готово"}</span></div>`).join("") : `<div class="empty-state"><div class="emoji">📈</div><h3>Первая точка появится после тренировки</h3><p class="subtle">Журнал уже готов фиксировать веса и повторения.</p></div>`}</article>
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
    <div class="instruction-art">${exerciseArt(id, true)}</div>
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
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="bottom-sheet"><div class="sheet-handle"></div><div class="sheet-head"><div><p class="eyebrow">Профиль</p><h2>${escapeHtml(state.profile.name)}</h2></div><button class="close-button" data-close-modal>×</button></div><article class="profile-card glass-panel" style="margin-top:14px"><div class="form-grid"><div class="field"><label>Рост</label><input value="${state.profile.height} см" disabled></div><div class="field"><label>Вес</label><input value="${state.profile.weight} кг" disabled></div><div class="field"><label>Тренировок</label><input value="${state.profile.daysPerWeek} / нед." disabled></div><div class="field"><label>Длительность</label><input value="${state.profile.duration} мин" disabled></div></div></article><button class="secondary-button wide" style="width:100%;margin-top:12px" data-action="reset-app">Сбросить демо-данные</button><p class="subtle" style="margin:14px 4px 0">FORMA AI v${escapeHtml(state.config.version)} · данные хранятся локально на устройстве.</p></section></div>`;
}

async function finishOnboarding() {
  const draft = state.profileDraft;
  draft.level = $("#level")?.value || draft.level;
  draft.daysPerWeek = Number($("#days")?.value || draft.daysPerWeek);
  draft.duration = Number($("#duration")?.value || draft.duration);
  if (!draft.equipment.length) draft.equipment = ["bodyweight"];
  draft.trainingDays = [0,2,4,6,1].slice(0, draft.daysPerWeek);
  try {
    const { plan } = await api("/api/plan/generate", { method: "POST", body: JSON.stringify({ profile: draft }) });
    state.profile = structuredClone(draft);
    state.plan = plan;
    state.onboardingStep = 1;
    $("#avatarText").textContent = (draft.name || "И").trim().charAt(0).toUpperCase();
    saveState();
    toast("Персональный план готов");
    render();
  } catch (error) {
    toast(error.message);
  }
}

function collectCurrentExercise() {
  if (!state.activeWorkout) return;
  const exercise = state.activeWorkout.exercises[state.workoutIndex];
  $$('[data-set-weight]').forEach((input) => exercise.setLogs[Number(input.dataset.setWeight)].weight = Number(input.value) || 0);
  $$('[data-set-reps]').forEach((input) => exercise.setLogs[Number(input.dataset.setReps)].reps = Number(input.value) || 0);
  exercise.rpe = Number($("#rpe")?.value || 7);
  exercise.pain = Number($("#pain")?.value || 0);
}

function openReadinessCheck() {
  collectCurrentExercise();
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="bottom-sheet"><div class="sheet-handle"></div><p class="eyebrow">Последний шаг</p><h2>Как ты себя чувствуешь?</h2><p class="subtle">Эти оценки влияют на следующую нагрузку сильнее, чем желание любой ценой добавить вес.</p><div class="form-grid"><div class="field"><label>Сон, 1–10</label><select id="sleepScore">${[1,2,3,4,5,6,7,8,9,10].map(v => `<option ${v===7 ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field"><label>Энергия, 1–10</label><select id="energyScore">${[1,2,3,4,5,6,7,8,9,10].map(v => `<option ${v===7 ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field full"><label>Настроение, 1–10</label><select id="moodScore">${[1,2,3,4,5,6,7,8,9,10].map(v => `<option ${v===8 ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field full"><label>Комментарий</label><input id="workoutNote" placeholder="Например: тяжело дались выпады" /></div></div><button class="primary-button wide" style="margin-top:15px" data-action="submit-readiness">Проанализировать тренировку</button></section></div>`;
}

function applyProgressionToPlan(analysis) {
  const collections = [state.plan?.workouts || [], ...(state.plan?.rotations || []).map((rotation) => rotation.workouts || [])];
  for (const recommendation of analysis.recommendations || []) {
    if (!recommendation.nextWeight || recommendation.unit !== "кг") continue;
    for (const workouts of collections) {
      for (const workout of workouts) {
        for (const exercise of workout.exercises || []) {
          if (exercise.id === recommendation.exerciseId) exercise.suggestedWeight = recommendation.nextWeight;
        }
      }
    }
  }
}

function activatePlanWeek(week) {
  const plan = state.plan;
  const rotation = rotationForWeek(plan, week);
  if (!rotation) return;
  plan.week = week;
  plan.rotationIndex = Math.floor((week - 1) / (plan.rotationEveryWeeks || 2));
  plan.workouts = structuredClone(rotation.workouts);
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
    pattern: state.exercises.find((item) => item.id === exercise.id)?.pattern,
    completed: exercise.setLogs.every((set) => set.done),
    weight: Math.max(...exercise.setLogs.map((set) => Number(set.weight) || 0)),
    reps: exercise.setLogs.reduce((sum, set) => sum + Number(set.reps || 0), 0),
    rpe: exercise.rpe,
    pain: exercise.pain,
    painFlag: exercise.pain >= 5
  }));
  try {
    const { analysis } = await api("/api/workout/analyze", { method: "POST", body: JSON.stringify({ entries, readiness }) });
    applyProgressionToPlan(analysis);
    const scheduleUpdate = await advancePlanSchedule();
    state.analyses.push(analysis);
    state.logs.push({ createdAt: new Date().toISOString(), title: workout.title, duration: Math.max(60, (Date.now() - state.workoutStartedAt) / 1000), entries, readiness, note, analysisState: analysis.state });
    state.activeWorkout = null;
    state.workoutStartedAt = null;
    saveState();
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="bottom-sheet"><div class="sheet-handle"></div><p class="eyebrow">Анализ завершён</p><h2>${escapeHtml(analysis.headline)}</h2><p class="subtle">${escapeHtml(analysis.summary)}</p><span class="analysis-state">${scheduleUpdate.cycleRefreshed ? "Создан новый 8-недельный цикл" : "План и следующие веса обновлены"}</span><div class="analysis-metrics"><div><b>${analysis.metrics.completion}%</b><small>выполнено</small></div><div><b>${analysis.metrics.avgRpe}</b><small>средний RPE</small></div><div><b>${analysis.metrics.readiness}%</b><small>готовность</small></div></div><div class="instruction-box"><h3>Следующая тренировка</h3>${analysis.recommendations.slice(0,3).map((rec) => `<div class="history-row"><div><b>${escapeHtml(rec.name)}</b><small>${escapeHtml(rec.note)}</small></div><span class="trend-up">${escapeHtml(rec.action)}${rec.nextWeight ? ` · ${rec.nextWeight} ${escapeHtml(rec.unit)}` : ""}</span></div>`).join("")}</div><div class="safety-note">${escapeHtml(analysis.safety)}</div><button class="primary-button wide" style="margin-top:13px" data-action="analysis-done">Готово</button></section></div>`;
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
  if (target.dataset.equipment) {
    const id = target.dataset.equipment;
    state.profileDraft.equipment = state.profileDraft.equipment.includes(id) ? state.profileDraft.equipment.filter((item) => item !== id) : [id];
    renderOnboarding();
    return;
  }
  if (target.dataset.onboarding === "next") {
    if (state.onboardingStep === 1) {
      const fields = ["name", "age", "height", "weight"];
      fields.forEach((id) => { state.profileDraft[id] = $("#" + id)?.value.trim() || ""; });
      const valid = state.profileDraft.name && Number(state.profileDraft.age) >= 14 && Number(state.profileDraft.height) >= 120 && Number(state.profileDraft.weight) >= 30;
      if (!valid) { fields.forEach((id) => $("#" + id)?.classList.toggle("invalid", !state.profileDraft[id])); toast("Заполни основные параметры"); return; }
    }
    if (state.onboardingStep === 2 && !state.profileDraft.goal) return toast("Выбери основную цель");
    state.onboardingStep += 1; renderOnboarding(); return;
  }
  if (target.dataset.onboarding === "back") { state.onboardingStep = Math.max(1, state.onboardingStep - 1); renderOnboarding(); return; }
  if (target.dataset.onboarding === "finish") return finishOnboarding();

  if (target.dataset.setDone !== undefined) {
    const index = Number(target.dataset.setDone);
    const exercise = state.activeWorkout.exercises[state.workoutIndex];
    exercise.setLogs[index].done = !exercise.setLogs[index].done;
    target.classList.toggle("done", exercise.setLogs[index].done);
    return;
  }

  const action = target.dataset.action;
  if (action === "add-set") {
    collectCurrentExercise();
    const exercise = state.activeWorkout?.exercises?.[state.workoutIndex];
    if (!exercise) return;
    const result = addSetLog(exercise);
    if (!result.added) return toast(result.reason === "max_sets" ? "Максимум 10 сетов на упражнение" : "Не удалось добавить сет");
    renderWorkout();
    return;
  }
  if (action === "home") return setScreen("home");
  if (action === "profile") return openProfile();
  if (action === "plan") return setScreen("plan");
  if (action === "start-workout") return setScreen("workout");
  if (action === "prev-exercise") { collectCurrentExercise(); state.workoutIndex = Math.max(0, state.workoutIndex - 1); renderWorkout(); return; }
  if (action === "next-exercise") { collectCurrentExercise(); if (state.workoutIndex < state.activeWorkout.exercises.length - 1) { state.workoutIndex += 1; renderWorkout(); } else openReadinessCheck(); return; }
  if (action === "submit-readiness") { const readiness = { sleep: Number($("#sleepScore")?.value || 7), energy: Number($("#energyScore")?.value || 7), mood: Number($("#moodScore")?.value || 8) }; const note = $("#workoutNote")?.value.trim() || ""; target.disabled = true; target.textContent = "Анализирую…"; await finishWorkout(readiness, note); return; }
  if (action === "analysis-done") { modalRoot.innerHTML = ""; setScreen("progress"); return; }
  if (action === "reset-app") { localStorage.removeItem("forma-ai-state"); location.reload(); return; }
  if (action === "install") {
    if (state.deferredInstall) { state.deferredInstall.prompt(); await state.deferredInstall.userChoice; state.deferredInstall = null; }
    else toast("На iPhone: Поделиться → На экран «Домой»");
  }

  if (target.classList.contains("prompt-chip")) sendCoachMessage(target.textContent);
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "coachForm") return;
  event.preventDefault();
  const input = $("#coachInput");
  const text = input.value;
  input.value = "";
  sendCoachMessage(text);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.deferredInstall = event;
});


async function ensureCurrentPlanSchema() {
  if (!state.profile) return;
  const valid = state.plan?.planRevision === 2 && state.plan?.cycleWeeks === 8 && state.plan?.rotationEveryWeeks === 2 && Array.isArray(state.plan?.rotations) && state.plan.rotations.length === 4;
  if (valid) return;
  const previous = state.plan;
  const { plan } = await api("/api/plan/generate", { method: "POST", body: JSON.stringify({ profile: state.profile, cycleNumber: previous?.cycleNumber || 1 }) });
  if (previous) copySuggestedWeights(previous, plan);
  state.plan = plan;
  state.activeWorkout = null;
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
