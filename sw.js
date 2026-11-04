const CACHE_NAME = 'phantom-v1';
const urlsToCache = [
  './',
  './index.html',
  './finale.html',
  './finale.css',
  './finale.js',
  './schedule.json',
  './events.json',
  './manifest.json',
  './phantom_logo.png',
  './phantom_icon.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});
