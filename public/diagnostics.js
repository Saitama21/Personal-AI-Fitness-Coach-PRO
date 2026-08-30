const runtimeBuffer = {
  console: [],
  errors: [],
  rejections: [],
  resourceErrors: []
};

const MAX_RUNTIME_EVENTS = 80;
let runtimeInstalled = false;

function pushLimited(target, value) {
  target.push(value);
  if (target.length > MAX_RUNTIME_EVENTS) target.splice(0, target.length - MAX_RUNTIME_EVENTS);
}

function safeMessage(value) {
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === "string") return value.slice(0, 1200);
  try { return JSON.stringify(value).slice(0, 1200); } catch { return String(value).slice(0, 1200); }
}

export function installRuntimeDiagnostics() {
  if (runtimeInstalled) return;
  runtimeInstalled = true;

  for (const level of ["warn", "error"]) {
    const original = console[level].bind(console);
    console[level] = (...args) => {
      pushLimited(runtimeBuffer.console, {
        at: new Date().toISOString(),
        level,
        message: args.map(safeMessage).join(" ")
      });
      original(...args);
    };
  }

  window.addEventListener("error", (event) => {
    if (event.target && event.target !== window) {
      const node = event.target;
      pushLimited(runtimeBuffer.resourceErrors, {
        at: new Date().toISOString(),
        tag: node.tagName || "unknown",
        url: node.currentSrc || node.src || node.href || null
      });
      return;
    }
    pushLimited(runtimeBuffer.errors, {
      at: new Date().toISOString(),
      message: event.message || "window.error",
      source: event.filename || null,
      line: event.lineno || null,
      column: event.colno || null
    });
  }, true);

  window.addEventListener("unhandledrejection", (event) => {
    pushLimited(runtimeBuffer.rejections, {
      at: new Date().toISOString(),
      reason: safeMessage(event.reason)
    });
  });
}

function round(value, digits = 2) {
  if (!Number.isFinite(value)) return null;
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function rectOf(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: round(rect.x), y: round(rect.y), top: round(rect.top), right: round(rect.right),
    bottom: round(rect.bottom), left: round(rect.left), width: round(rect.width), height: round(rect.height)
  };
}

function dataAttributes(element) {
  const allowed = ["action", "screen", "exercise", "setDone", "setWeight", "setReps", "onboarding"];
  const data = {};
  for (const key of allowed) {
    if (element.dataset?.[key] !== undefined) data[key] = element.dataset[key];
  }
  return data;
}

function selectorPath(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return null;
  if (element.id) return `#${CSS.escape(element.id)}`;
  const parts = [];
  let current = element;
  while (current && current !== document.body && parts.length < 7) {
    let part = current.tagName.toLowerCase();
    const stableClass = [...current.classList].find((name) => !/^(active|done|selected|today|is-|has-)/.test(name));
    if (stableClass) part += `.${CSS.escape(stableClass)}`;
    const parent = current.parentElement;
    if (parent) {
      const sameTag = [...parent.children].filter((child) => child.tagName === current.tagName);
      if (sameTag.length > 1) part += `:nth-of-type(${sameTag.indexOf(current) + 1})`;
    }
    parts.unshift(part);
    current = parent;
  }
  return parts.join(" > ");
}

function descriptor(element) {
  return {
    selector: selectorPath(element),
    tag: element.tagName?.toLowerCase() || null,
    id: element.id || null,
    classes: [...(element.classList || [])].slice(0, 10),
    role: element.getAttribute?.("role") || null,
    ariaLabel: element.getAttribute?.("aria-label") || null,
    data: dataAttributes(element)
  };
}

const STYLE_KEYS = [
  "display", "position", "overflowX", "overflowY", "width", "height", "minWidth", "maxWidth",
  "minHeight", "maxHeight", "padding", "margin", "gap", "gridTemplateColumns", "flexDirection",
  "alignItems", "justifyContent", "objectFit", "objectPosition", "fontSize", "lineHeight", "whiteSpace",
  "textOverflow", "transform", "zIndex", "borderRadius"
];

function computedStyleSubset(element) {
  const style = getComputedStyle(element);
  return Object.fromEntries(STYLE_KEYS.map((key) => [key, style[key] || null]));
}

function matchingCssRules(element) {
  const matches = [];
  const visitRules = (rules, source, media = null) => {
    for (const rule of [...rules]) {
      if (rule.type === CSSRule.STYLE_RULE) {
        try {
          if (element.matches(rule.selectorText)) {
            matches.push({ source, media, selector: rule.selectorText, declarations: rule.style.cssText });
          }
        } catch { /* selector unsupported by matches */ }
      } else if (rule.cssRules) {
        const nextMedia = rule.conditionText || rule.media?.mediaText || media;
        visitRules(rule.cssRules, source, nextMedia);
      }
      if (matches.length >= 24) return;
    }
  };

  for (const sheet of [...document.styleSheets]) {
    try { visitRules(sheet.cssRules, sheet.href || "inline"); } catch { /* cross-origin stylesheet */ }
    if (matches.length >= 24) break;
  }
  return matches.slice(-24);
}

function imageElementEvidence(element) {
  if (!(globalThis.HTMLImageElement && element instanceof HTMLImageElement)) return null;
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const naturalRatio = element.naturalHeight ? element.naturalWidth / element.naturalHeight : null;
  const renderedRatio = rect.height ? rect.width / rect.height : null;
  const ratioFit = naturalRatio && renderedRatio ? Math.min(naturalRatio / renderedRatio, renderedRatio / naturalRatio) : null;
  const densityX = rect.width ? element.naturalWidth / (rect.width * window.devicePixelRatio) : null;
  const densityY = rect.height ? element.naturalHeight / (rect.height * window.devicePixelRatio) : null;
  return {
    src: element.currentSrc ? new URL(element.currentSrc, location.href).pathname : null,
    complete: element.complete,
    naturalWidth: element.naturalWidth,
    naturalHeight: element.naturalHeight,
    naturalAspectRatio: round(naturalRatio, 4),
    renderedAspectRatio: round(renderedRatio, 4),
    objectFit: style.objectFit,
    objectPosition: style.objectPosition,
    aspectFitFraction: round(ratioFit, 4),
    unusedOrCroppedFraction: ratioFit == null ? null : round(1 - ratioFit, 4),
    sourcePixelsPerDevicePixel: round(Math.min(densityX || Infinity, densityY || Infinity), 3)
  };
}

function elementEvidence(element, withRules = false) {
  const image = imageElementEvidence(element);
  return {
    ...descriptor(element),
    rect: rectOf(element),
    box: {
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight
    },
    style: computedStyleSubset(element),
    ...(image ? { image } : {}),
    ...(withRules ? { matchedCssRules: matchingCssRules(element) } : {})
  };
}

function issue(id, severity, message, element = null, details = {}) {
  return {
    id,
    severity,
    message,
    ...(element ? { element: elementEvidence(element, true) } : {}),
    details
  };
}

function scanLayoutIssues(scope = document) {
  const issues = [];
  const issueCounts = new Map();
  const addIssue = (entry) => {
    const count = issueCounts.get(entry.id) || 0;
    if (count >= 12 || issues.length >= 72) return;
    issueCounts.set(entry.id, count + 1);
    issues.push(entry);
  };
  const viewportWidth = window.innerWidth;
  const doc = document.documentElement;
  const isDocumentScope = scope === document || scope === document.documentElement || scope === document.body;

  if (isDocumentScope && doc.scrollWidth > viewportWidth + 2) {
    addIssue(issue("layout.document.horizontal_overflow", "fail", "Документ шире viewport.", doc, {
      viewportWidth,
      documentScrollWidth: doc.scrollWidth,
      overflowPx: doc.scrollWidth - viewportWidth
    }));
  }

  const candidates = [...scope.querySelectorAll("button, input, select, textarea, img, article, nav, header, main, section, [class*='card'], [class*='grid']")]
    .filter((element) => {
      if (element.closest?.("#auditRunnerOverlay")) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    });

  for (const element of candidates) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    if (rect.left < -2 || rect.right > viewportWidth + 2) {
      addIssue(issue("layout.element.horizontal_escape", "fail", "Элемент выходит за горизонтальные границы viewport.", element, {
        viewportWidth,
        escapeLeftPx: round(Math.max(0, -rect.left)),
        escapeRightPx: round(Math.max(0, rect.right - viewportWidth))
      }));
    }

    if (element.matches("button, input, select, textarea, [role='button']") && !element.disabled) {
      if (rect.width < 44 || rect.height < 44) {
        addIssue(issue("a11y.touch_target.small", "warn", "Интерактивная область меньше рекомендуемых 44×44 CSS px.", element, {
          width: round(rect.width), height: round(rect.height)
        }));
      }
    }

    if (element.scrollWidth > element.clientWidth + 2 && ["hidden", "clip"].includes(style.overflowX)) {
      addIssue(issue("layout.content.clipped_x", "warn", "Содержимое элемента обрезается по горизонтали.", element, {
        clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, clippedPx: element.scrollWidth - element.clientWidth
      }));
    }

    if (element.scrollHeight > element.clientHeight + 2 && ["hidden", "clip"].includes(style.overflowY) && element.tagName !== "IMG") {
      addIssue(issue("layout.content.clipped_y", "warn", "Содержимое элемента обрезается по вертикали.", element, {
        clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, clippedPx: element.scrollHeight - element.clientHeight
      }));
    }
  }

  const nav = isDocumentScope ? document.querySelector(".bottom-nav") : null;
  const shell = isDocumentScope ? document.querySelector(".app-shell") : null;
  if (nav && shell && getComputedStyle(nav).display !== "none") {
    const navRect = nav.getBoundingClientRect();
    const shellStyle = getComputedStyle(shell);
    const paddingBottom = Number.parseFloat(shellStyle.paddingBottom) || 0;
    const required = navRect.height + 20;
    if (paddingBottom + 1 < required) {
      addIssue(issue("layout.dock.insufficient_safe_space", "fail", "Нижний dock может перекрывать последний контент: padding-bottom app-shell меньше высоты dock + запаса.", shell, {
        paddingBottom: round(paddingBottom), navHeight: round(navRect.height), recommendedMinimum: round(required)
      }));
    }
  }

  return issues;
}

function keyElementSnapshot(scope = document) {
  const selectors = [
    ".app-shell", ".topbar", ".screen-root", ".bottom-nav", ".workout-header", ".progress-track",
    ".current-exercise", ".current-art", ".exercise-art-image", ".exercise-title-row", ".sets-grid",
    ".add-set-button", ".effort-grid", ".workout-actions", ".plan-card", ".hero-card", ".stat-grid",
    ".bottom-sheet", ".instruction-art", ".technique-strip"
  ];
  const output = [];
  const ruleSelectors = new Set([".app-shell", ".bottom-nav", ".current-exercise", ".current-art", ".exercise-art-image", ".sets-grid", ".effort-grid", ".workout-actions", ".bottom-sheet", ".instruction-art"]);
  for (const selector of selectors) {
    const elements = [...scope.querySelectorAll(selector)].slice(0, selector === ".plan-card" ? 5 : 2);
    for (const element of elements) output.push(elementEvidence(element, ruleSelectors.has(selector)));
  }
  return output;
}

function waitFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

async function waitForImages(scope = document, timeoutMs = 3500) {
  const images = [...scope.querySelectorAll("img")];
  await Promise.all(images.map(async (image) => {
    if (image.complete) {
      try { await image.decode?.(); } catch { /* decode failure captured later */ }
      return;
    }
    await Promise.race([
      new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      }),
      new Promise((resolve) => setTimeout(resolve, timeoutMs))
    ]);
  }));
}

export async function captureDomSnapshot(label, extra = {}, scope = document) {
  await waitFrame();
  await waitForImages(scope);
  const root = scope === document ? (document.querySelector("#screenRoot") || document) : scope;
  const issues = scanLayoutIssues(scope);
  return {
    label,
    capturedAt: new Date().toISOString(),
    extra,
    viewport: viewportInfo(),
    document: {
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      bodyScrollWidth: document.body.scrollWidth,
      bodyScrollHeight: document.body.scrollHeight
    },
    root: root instanceof Element ? elementEvidence(root, false) : null,
    keyElements: keyElementSnapshot(scope),
    issues
  };
}

function viewportInfo() {
  const vv = window.visualViewport;
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    screen: { width: screen.width, height: screen.height, availWidth: screen.availWidth, availHeight: screen.availHeight },
    visualViewport: vv ? { width: round(vv.width), height: round(vv.height), scale: round(vv.scale), offsetTop: round(vv.offsetTop), offsetLeft: round(vv.offsetLeft) } : null,
    orientation: screen.orientation ? { type: screen.orientation.type, angle: screen.orientation.angle } : null
  };
}

function grayscaleFromImage(image, size = 96) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = Math.round(size * 2 / 3);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const gray = new Float32Array(canvas.width * canvas.height);
  for (let i = 0, p = 0; i < rgba.length; i += 4, p += 1) {
    gray[p] = 0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2];
  }
  return { gray, width: canvas.width, height: canvas.height };
}

function visualSignature(gray, width, height) {
  const cols = 8;
  const rows = 8;
  const blocks = [];
  for (let by = 0; by < rows; by += 1) {
    for (let bx = 0; bx < cols; bx += 1) {
      const x0 = Math.floor(bx * width / cols);
      const x1 = Math.floor((bx + 1) * width / cols);
      const y0 = Math.floor(by * height / rows);
      const y1 = Math.floor((by + 1) * height / rows);
      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) { sum += gray[y * width + x]; count += 1; }
      blocks.push(sum / Math.max(1, count));
    }
  }
  const average = blocks.reduce((sum, value) => sum + value, 0) / blocks.length;
  let hex = "";
  for (let i = 0; i < blocks.length; i += 4) {
    let nibble = 0;
    for (let bit = 0; bit < 4; bit += 1) nibble = (nibble << 1) | (blocks[i + bit] > average ? 1 : 0);
    hex += nibble.toString(16);
  }
  return hex;
}

function sharpnessScore(gray, width, height) {
  let count = 0;
  let sum = 0;
  let sumSq = 0;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      const lap = -4 * gray[i] + gray[i - 1] + gray[i + 1] + gray[i - width] + gray[i + width];
      sum += lap;
      sumSq += lap * lap;
      count += 1;
    }
  }
  if (!count) return null;
  const mean = sum / count;
  return round(sumSq / count - mean * mean, 1);
}

async function inspectExerciseVisual(exercise) {
  if (!exercise.visual) {
    return {
      exerciseId: exercise.id,
      name: exercise.name,
      visualReady: exercise.visualReady !== false,
      url: null,
      status: "missing_by_design",
      productionReady: exercise.productionReady !== false
    };
  }

  let responseInfo = null;
  let contentFingerprint = null;
  try {
    const response = await fetch(exercise.visual, { method: "GET", cache: "no-cache" });
    const buffer = response.ok ? await response.arrayBuffer() : null;
    responseInfo = {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      contentLength: buffer?.byteLength || Number(response.headers.get("content-length")) || null
    };
    if (buffer) {
      const bytes = new Uint8Array(buffer);
      if (globalThis.crypto?.subtle) {
        const digest = await crypto.subtle.digest("SHA-256", buffer.slice(0));
        contentFingerprint = `sha256:${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
      } else {
        let hash = 2166136261;
        for (const byte of bytes) { hash ^= byte; hash = Math.imul(hash, 16777619); }
        contentFingerprint = `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
      }
    }
  } catch (error) {
    responseInfo = { ok: false, status: null, error: safeMessage(error) };
  }

  const image = new Image();
  image.decoding = "async";
  image.src = exercise.visual;
  try {
    await image.decode();
  } catch {
    await new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
      setTimeout(resolve, 3000);
    });
  }

  let pixels = null;
  try {
    if (image.naturalWidth && image.naturalHeight) {
      const sample = grayscaleFromImage(image);
      pixels = {
        sharpnessScore: sharpnessScore(sample.gray, sample.width, sample.height),
        perceptualSignature: visualSignature(sample.gray, sample.width, sample.height)
      };
    }
  } catch (error) {
    pixels = { error: `pixel_analysis_failed: ${safeMessage(error)}` };
  }

  return {
    exerciseId: exercise.id,
    name: exercise.name,
    visualReady: exercise.visualReady !== false,
    productionReady: exercise.productionReady !== false,
    url: exercise.visual,
    response: responseInfo,
    contentFingerprint,
    naturalWidth: image.naturalWidth || 0,
    naturalHeight: image.naturalHeight || 0,
    naturalAspectRatio: image.naturalHeight ? round(image.naturalWidth / image.naturalHeight, 4) : null,
    ...pixels
  };
}

export async function auditExerciseVisuals(exercises = []) {
  const visuals = [];
  for (const exercise of exercises) visuals.push(await inspectExerciseVisual(exercise));

  const fingerprintMap = new Map();
  const signatureMap = new Map();
  for (const visual of visuals) {
    if (visual.contentFingerprint) {
      if (!fingerprintMap.has(visual.contentFingerprint)) fingerprintMap.set(visual.contentFingerprint, []);
      fingerprintMap.get(visual.contentFingerprint).push(visual.exerciseId);
    }
    if (visual.perceptualSignature) {
      if (!signatureMap.has(visual.perceptualSignature)) signatureMap.set(visual.perceptualSignature, []);
      signatureMap.get(visual.perceptualSignature).push(visual.exerciseId);
    }
  }
  const duplicates = [...fingerprintMap.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([fingerprint, exerciseIds]) => ({ fingerprint, exerciseIds }));
  const similarVisuals = [...signatureMap.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([signature, exerciseIds]) => ({ signature, exerciseIds }))
    .filter((group) => !duplicates.some((duplicate) => group.exerciseIds.every((id) => duplicate.exerciseIds.includes(id))));

  const sharpness = visuals.map((item) => item.sharpnessScore).filter(Number.isFinite).sort((a, b) => a - b);
  const medianSharpness = sharpness.length ? sharpness[Math.floor(sharpness.length / 2)] : null;
  for (const visual of visuals) {
    visual.sharpnessVsMedian = Number.isFinite(visual.sharpnessScore) && medianSharpness
      ? round(visual.sharpnessScore / medianSharpness, 3)
      : null;
  }

  return { visuals, duplicates, similarVisuals, medianSharpness };
}

export function auditDataIntegrity({ state, exercises }) {
  const tests = [];
  const byId = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const push = (id, status, message, details = {}) => tests.push({ id, status, message, details });

  const ids = exercises.map((exercise) => exercise.id);
  const uniqueIds = new Set(ids);
  push("data.exercise_ids_unique", uniqueIds.size === ids.length ? "pass" : "fail",
    uniqueIds.size === ids.length ? "ID упражнений уникальны." : "В базе есть дублирующиеся ID.",
    { total: ids.length, unique: uniqueIds.size });

  const requiredFields = ["id", "name", "movementPattern", "primaryMuscle", "difficulty", "laterality", "exerciseType", "requiredEquipmentOptions", "progression", "regression"];
  const invalid = exercises.filter((exercise) => requiredFields.some((field) => exercise[field] === undefined || exercise[field] === null || exercise[field] === ""));
  push("data.exercise_metadata_complete", invalid.length ? "fail" : "pass",
    invalid.length ? "У части упражнений отсутствуют обязательные metadata." : "Обязательные metadata упражнений заполнены.",
    { invalidExerciseIds: invalid.map((exercise) => exercise.id), requiredFields });

  const plan = state.plan;
  if (!plan) {
    push("data.plan_present", "warn", "План ещё не создан; проверки плана пропущены.");
    return tests;
  }

  push("data.plan_periodization", Array.isArray(plan.weeks) && plan.weeks.length === 8 ? "pass" : "fail",
    Array.isArray(plan.weeks) && plan.weeks.length === 8 ? "План содержит 8 недель." : "План не содержит ровно 8 недель.",
    { weekCount: plan.weeks?.length || 0, phases: plan.weeks?.map((week) => week.phase) || [] });

  const planExercises = (plan.weeks || []).flatMap((week) => week.workouts || []).flatMap((workout) => workout.exercises || []);
  const missing = [...new Set(planExercises.filter((entry) => !byId.has(entry.id)).map((entry) => entry.id))];
  push("data.plan_exercises_resolve", missing.length ? "fail" : "pass",
    missing.length ? "План ссылается на упражнения, которых нет в базе." : "Все упражнения плана существуют в базе.",
    { missingExerciseIds: missing });

  const equipment = new Set(state.profile?.equipment || []);
  const equipmentLeaks = [];
  for (const entry of planExercises) {
    const exercise = byId.get(entry.id);
    if (!exercise) continue;
    const options = exercise.requiredEquipmentOptions || [];
    const allowed = options.some((option) => option.every((item) => equipment.has(item)));
    if (!allowed) equipmentLeaks.push({ exerciseId: exercise.id, requiredEquipmentOptions: options });
  }
  const uniqueLeaks = [...new Map(equipmentLeaks.map((item) => [item.exerciseId, item])).values()];
  push("data.plan_equipment_constraints", uniqueLeaks.length ? "fail" : "pass",
    uniqueLeaks.length ? "В плане есть упражнения, несовместимые с выбранным оборудованием." : "Оборудование всех упражнений плана совместимо с профилем.",
    { equipment: [...equipment], leaks: uniqueLeaks });

  const notProductionReady = [...new Set(planExercises
    .map((entry) => byId.get(entry.id))
    .filter((exercise) => exercise && exercise.productionReady === false)
    .map((exercise) => exercise.id))];
  push("data.plan_production_visuals", notProductionReady.length ? "fail" : "pass",
    notProductionReady.length ? "В production-план попали упражнения без готового visual pack." : "В плане нет упражнений, помеченных как productionReady=false.",
    { exerciseIds: notProductionReady });

  return tests;
}

export function runtimeDiagnosticsSnapshot() {
  return structuredClone(runtimeBuffer);
}

export async function collectEnvironment(config = {}) {
  let storage = null;
  try {
    if (navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate();
      storage = { usage: estimate.usage || 0, quota: estimate.quota || 0 };
    }
  } catch { storage = null; }

  const registration = navigator.serviceWorker ? await navigator.serviceWorker.getRegistration().catch(() => null) : null;
  return {
    app: { name: config.appName || "FORMA AI", version: config.version || null, mode: config.mode || null },
    generatedAt: new Date().toISOString(),
    location: { origin: location.origin, pathname: location.pathname, protocol: location.protocol },
    viewport: viewportInfo(),
    navigator: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      online: navigator.onLine,
      standalone: window.matchMedia?.("(display-mode: standalone)")?.matches || navigator.standalone === true,
      prefersDark: window.matchMedia?.("(prefers-color-scheme: dark)")?.matches || false,
      prefersReducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false
    },
    serviceWorker: registration ? {
      scope: registration.scope,
      active: registration.active?.state || null,
      waiting: registration.waiting?.state || null,
      installing: registration.installing?.state || null,
      controller: navigator.serviceWorker.controller?.scriptURL || null
    } : null,
    storage
  };
}

export function sanitizeAppState(state) {
  const plan = state.plan;
  return {
    screen: state.screen,
    profile: state.profile ? {
      goal: state.profile.goal,
      focus: state.profile.focus,
      level: state.profile.level,
      daysPerWeek: state.profile.daysPerWeek,
      duration: state.profile.duration,
      trainingLocation: state.profile.trainingLocation,
      equipment: state.profile.equipment,
      trainingDays: state.profile.trainingDays
    } : null,
    plan: plan ? {
      id: plan.id,
      planRevision: plan.planRevision,
      cycleNumber: plan.cycleNumber,
      cycleWeeks: plan.cycleWeeks,
      week: plan.week,
      daysPerWeek: plan.daysPerWeek,
      schemeId: plan.schemeId,
      weeks: (plan.weeks || []).map((week) => ({
        week: week.week,
        phase: week.phase,
        volumeMultiplier: week.volumeMultiplier,
        intensityMultiplier: week.intensityMultiplier,
        rpeTarget: week.rpeTarget,
        workouts: (week.workouts || []).map((workout) => ({
          id: workout.id,
          dayIndex: workout.dayIndex,
          focusKey: workout.focusKey,
          exerciseIds: (workout.exercises || []).map((exercise) => exercise.id),
          setCounts: (workout.exercises || []).map((exercise) => exercise.sets)
        }))
      }))
    } : null,
    exerciseLibrary: {
      count: state.exercises?.length || 0,
      productionReady: state.exercises?.filter((exercise) => exercise.productionReady !== false).length || 0,
      visualReady: state.exercises?.filter((exercise) => exercise.visualReady !== false && exercise.visual).length || 0
    },
    history: {
      workoutCount: state.logs?.length || 0,
      analysisCount: state.analyses?.length || 0
    }
  };
}

export function summarizeReport(report) {
  const tests = report.tests || [];
  const issues = (report.snapshots || []).flatMap((snapshot) => snapshot.issues || []);
  const visualFailures = (report.visualAudit?.visuals || []).filter((visual) => visual.visualReady && visual.response && visual.response.ok === false);
  const duplicateGroups = report.visualAudit?.duplicates?.length || 0;
  return {
    tests: {
      total: tests.length,
      passed: tests.filter((test) => test.status === "pass").length,
      warnings: tests.filter((test) => test.status === "warn").length,
      failed: tests.filter((test) => test.status === "fail").length
    },
    layout: {
      snapshots: report.snapshots?.length || 0,
      warnings: issues.filter((item) => item.severity === "warn").length,
      failed: issues.filter((item) => item.severity === "fail").length
    },
    visuals: {
      total: report.visualAudit?.visuals?.length || 0,
      broken: visualFailures.length,
      duplicateGroups
    },
    runtime: {
      console: report.runtime?.console?.length || 0,
      errors: report.runtime?.errors?.length || 0,
      rejections: report.runtime?.rejections?.length || 0,
      resourceErrors: report.runtime?.resourceErrors?.length || 0
    }
  };
}

export function downloadAuditJson(report) {
  const timestamp = new Date(report.generatedAt || Date.now()).toISOString().replace(/[:.]/g, "-");
  const version = report.environment?.app?.version || "unknown";
  const filename = `forma-ai-audit-v${version}-${timestamp}.json`;
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  return filename;
}
