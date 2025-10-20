// ===== MSS:TRS Uplink PWA Service Worker =====
// Safe: GET-only + same-origin. Leaves cross-origin and POST/PUT/etc. untouched.

const CACHE_NAME = "loader-shell-v1"; // bump this when you change PRECACHE_URLS

// Detect base path dynamically (e.g., "/TSR-80_MSS-84_LOADER/")
const BASE = new URL('./', self.location).pathname;

// Keep the precache tiny & resilient to missing files:
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",

];

// ---- Install: best-effort shell precache (ignore 404s) ----
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of PRECACHE_URLS) {
      try { await cache.add(url); } catch (_) { /* ignore missing files */ }
    }
  })());
});

// ---- Activate: purge old caches when version changes ----
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))));
  })());
});

// Helpers to test paths under BASE
const under = (path) => (p) => p.startsWith(BASE + path);
const isAssets = under("assets/");
const isData   = under("data/");

// ---- Fetch strategies with guardrails ----
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle same-origin GET
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  // A) Navigations → network-first (fallback to cached index for offline)
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const net = await fetch(req);
        const c = await caches.open(CACHE_NAME);
        c.put(req, net.clone());
        return net;
      } catch {
        return (await caches.match("./index.html")) ||
               (await caches.match(req)) ||
               new Response("Offline", { status: 503, statusText: "Offline" });
      }
    })());
    return;
  }

  // B) Shell files → cache-first (fast)
  const isShell = PRECACHE_URLS.some(u => url.pathname.endsWith(u.replace("./", "/")));
  if (isShell) {
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
        return res;
      }))
    );
    return;
  }

  // C) Project data → stale-while-revalidate
  if (isAssets(path) || isData(path)) {
    event.respondWith(
      caches.match(req).then(cached => {
        const net = fetch(req).then(res => {
          caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
          return res;
        }).catch(() => cached || Promise.reject("offline"));
        return cached || net;
      })
    );
    return;
  }

  // D) Default → network-first with cache fallback
  event.respondWith(
    fetch(req).then(res => {
      caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req))
  );
});
