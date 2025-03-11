const CACHE_NAME = 'pos-system-v1';
const ASSETS_TO_CACHE = [
  '/index.html',
  '/styles.css',
  '/app.js',
  '/inventory.js',
  '/storage.js',
  '/validation.js',
  '/pdfExport.js',
  '/manifest.json'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((fetchedResponse) => {
        if (!fetchedResponse || fetchedResponse.status !== 200 || fetchedResponse.type !== 'basic') {
          return fetchedResponse;
        }
        const responseToCache = fetchedResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return fetchedResponse;
      });
    })
  );
});