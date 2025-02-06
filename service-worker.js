const CACHE_NAME = 'workout-app-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/saturday.html',  // صفحه روز شنبه
  '/sunday.html',    // صفحه روز یکشنبه
  '/monday.html',    // صفحه روز دوشنبه
  '/tuesday.html',    // صفحه روز سه شنبه
  '/wednesday.html',    // صفحه روز چهارشنبه
  '/edit_workout.html',      // صفحه ویرایش حرکت
  '/style.css',
  '/script.js',
  '/icons/icon-256x256.png'
];

// نصب سرویس‌ورکر و کش کردن فایل‌ها
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(urlsToCache);  // کش کردن فایل‌ها
    })
  );
});

// فعال‌سازی سرویس‌ورکر و حذف کش‌های قدیمی
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting Old Cache', cache);
            return caches.delete(cache);  // حذف کش‌های قدیمی
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // نمایش صفحه اصلی در حالت آفلاین
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
    );
  });
  