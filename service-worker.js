const CACHE_NAME = "tokenpocket-ui-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./usdt.html",
  "./tx-detail.html",
  "./tx-detail1.html",
  "./receive.html",
  "./TokenPocket1.css",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseCopy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseCopy);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});