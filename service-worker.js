const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/edit_workout.html',
  '/icon-192x192.png',
  // Add other assets you want to cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return fetch('b.json')
          .then(response => response.json())
          .then(data => {
            const videoUrls = data.Sheet1.map(activity => activity.newurl).filter(url => url);
            return cache.addAll([...urlsToCache, ...videoUrls]);
          });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
