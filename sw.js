/* Lưu sẵn toàn bộ game để chơi được khi không có mạng (chỉ hoạt động qua https). */
var CACHE = 'be-hoc-vui-v3';
var FILES = [
  './', './index.html', './manifest.json', './css/style.css',
  './js/audio.js', './js/art.js', './js/fx.js', './js/games.js', './js/app.js',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png',
  './audio/voice/manifest.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

// Ưu tiên bản mới trên mạng, mất mạng thì dùng bản đã lưu.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true });
    })
  );
});
