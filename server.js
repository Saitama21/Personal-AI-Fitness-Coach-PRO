import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatePlan, analyzeWorkout } from "./src/plan-engine.js";
import { coachReply } from "./src/ai.js";
import { exerciseList } from "./src/exercises.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
const MAX_BODY = 512 * 1024;
const rateBuckets = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function applySecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self'; manifest-src 'self'; worker-src 'self';"
  );
}

function getIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function rateLimited(req) {
  if (!req.url.startsWith("/api/")) return false;
  const key = getIp(req);
  const now = Date.now();
  const windowMs = 60_000;
  const limit = 80;
  const current = rateBuckets.get(key);
  if (!current || current.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) {
      const error = new Error("Payload too large");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON");
    error.status = 400;
    throw error;
  }
}

function validateProfile(profile = {}) {
  const errors = [];
  if (!Number(profile.age) || profile.age < 14 || profile.age > 90) errors.push("Возраст должен быть от 14 до 90 лет.");
  if (!Number(profile.height) || profile.height < 120 || profile.height > 230) errors.push("Рост должен быть от 120 до 230 см.");
  if (!Number(profile.weight) || profile.weight < 30 || profile.weight > 300) errors.push("Вес должен быть от 30 до 300 кг.");
  if (!profile.goal) errors.push("Выберите цель.");
  return errors;
}

function validateWorkoutAnalysis(payload = {}) {
  const errors = [];
  if (!Array.isArray(payload.entries) || payload.entries.length === 0) {
    errors.push("entries должен содержать хотя бы одно упражнение.");
  }
  const readiness = payload.readiness;
  if (!readiness || typeof readiness !== "object") {
    errors.push("readiness обязателен.");
  } else {
    for (const key of ["sleep", "energy", "mood"]) {
      const value = Number(readiness[key]);
      if (!Number.isFinite(value) || value < 1 || value > 10) errors.push(`readiness.${key} должен быть от 1 до 10.`);
    }
  }
  return errors;
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/config") {
    return sendJson(res, 200, {
      appName: process.env.APP_NAME || "FORMA AI",
      version: "0.4.3",
      aiEnabled: Boolean(process.env.OPENAI_API_KEY),
      aiModel: process.env.OPENAI_MODEL || "gpt-5-mini",
      mode: process.env.OPENAI_API_KEY ? "hybrid" : "local"
    });
  }

  if (req.method === "GET" && url.pathname === "/api/exercises") {
    return sendJson(res, 200, { exercises: exerciseList });
  }

  if (req.method === "POST" && url.pathname === "/api/plan/generate") {
    const body = await readJson(req);
    const errors = validateProfile(body.profile);
    if (errors.length) return sendJson(res, 422, { error: "profile_invalid", details: errors });
    return sendJson(res, 200, { plan: generatePlan(body.profile, { cycleNumber: body.cycleNumber }) });
  }

  if (req.method === "POST" && url.pathname === "/api/workout/analyze") {
    const body = await readJson(req);
    const errors = validateWorkoutAnalysis(body);
    if (errors.length) return sendJson(res, 422, { error: "workout_invalid", details: errors });
    return sendJson(res, 200, { analysis: analyzeWorkout(body) });
  }

  if (req.method === "POST" && url.pathname === "/api/coach") {
    const body = await readJson(req);
    const message = String(body.message || "").trim();
    if (!message) return sendJson(res, 422, { error: "message_required" });
    if (message.length > 3000) return sendJson(res, 422, { error: "message_too_long" });
    const reply = await coachReply({ message, context: body.context || {} });
    return sendJson(res, 200, { reply });
  }

  return sendJson(res, 404, { error: "not_found" });
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const requested = path.normalize(path.join(publicDir, pathname));
  if (!requested.startsWith(publicDir)) return sendJson(res, 403, { error: "forbidden" });

  let filePath = requested;
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = path.join(filePath, "index.html");
    const content = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const cache = [".png", ".webp", ".svg"].includes(ext)
      ? "public, max-age=86400"
      : "no-cache";
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Content-Length": content.length,
      "Cache-Control": cache
    });
    if (req.method === "HEAD") return res.end();
    res.end(content);
  } catch {
    // SPA navigation gets the app shell, but a missing concrete asset must stay a real 404.
    if (path.extname(pathname)) return sendJson(res, 404, { error: "not_found" });

    try {
      const fallback = await readFile(path.join(publicDir, "index.html"));
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Length": fallback.length,
        "Cache-Control": "no-cache"
      });
      if (req.method === "HEAD") return res.end();
      res.end(fallback);
    } catch {
      sendJson(res, 404, { error: "not_found" });
    }
  }
}

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, {
      status: "healthy",
      version: "0.4.3",
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    });
  }

  if (rateLimited(req)) return sendJson(res, 429, { error: "rate_limited" });

  try {
    if (url.pathname.startsWith("/api/")) return await handleApi(req, res, url);
    if (!["GET", "HEAD"].includes(req.method)) return sendJson(res, 405, { error: "method_not_allowed" });
    return await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return sendJson(res, error.status || 500, {
      error: error.status ? error.message : "internal_server_error"
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`FORMA AI listening on http://${HOST}:${PORT}`);
});
