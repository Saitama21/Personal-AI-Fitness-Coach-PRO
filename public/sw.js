const CACHE = "forma-ai-v0.4.2-audit2";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/diagnostics.js",
  "/workout-state.js",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/assets/exercises/calf_raise.webp",
  "/assets/exercises/dead_bug.webp",
  "/assets/exercises/dumbbell_row.webp",
  "/assets/exercises/face_pull.webp",
  "/assets/exercises/glute_bridge.webp",
  "/assets/exercises/goblet_squat.webp",
  "/assets/exercises/hip_thrust.webp",
  "/assets/exercises/incline_pushup.webp",
  "/assets/exercises/lateral_raise.webp",
  "/assets/exercises/plank.webp",
  "/assets/exercises/rear_delt_fly.webp",
  "/assets/exercises/reverse_lunge.webp",
  "/assets/exercises/romanian_deadlift.webp",
  "/assets/exercises/split_squat.webp",
  "/assets/exercises/step_up.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).pathname.startsWith("/api/")) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/index.html")))
  );
});
