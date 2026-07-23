const CACHE_NAME = "ebazaar-v2";
const ASSETS = [
  "index.html",
  "css/styles.css",
  "css/category.css",
  "js/script.js",
  "js/api.js",
  "js/auth.js",
  "images/logo.svg",
  "manifest.json"
];

// Install Event - Pre-cache assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline assets");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve pages with Network-First, others with Cache-First
self.addEventListener("fetch", (e) => {
  // Only intercept GET requests
  if (e.request.method !== "GET") return;

  // Skip chrome-extension or other non-http schemes
  if (!e.request.url.startsWith("http")) return;

  const url = e.request.url;
  const isHtmlRequest = e.request.mode === "navigate" || url.endsWith(".html") || !url.split("/").pop().includes(".");

  if (isHtmlRequest) {
    // Network First Strategy for pages to avoid loading stale HTML caches
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || caches.match("index.html");
          });
        })
    );
  } else {
    // Cache First with network fallback & dynamic caching for other resources
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(e.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
              return networkResponse;
            }

            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, clone);
            });

            return networkResponse;
          });
      })
    );
  }
});
