/*
 * Service worker: guarda los archivos de la app la primera vez que se abre,
 * y después la sirve desde el teléfono aunque no haya internet.
 * Si cambiás algún archivo, subí el número de VERSION para que se actualice.
 */
const VERSION = "respira-v1";
const FILES = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/data.js",
  "./js/storage.js",
  "./js/breath.js",
  "./js/sequence.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
