/* Lưu sẵn toàn bộ game để chơi được khi không có mạng (chỉ hoạt động qua https). */
var CACHE = 'be-hoc-vui-v7';        // phần khung game: đổi số mỗi khi sửa code
var VOICE_CACHE = 'be-hoc-vui-voice'; // giọng đọc: giữ qua các phiên bản, tên tệp đổi khi nội dung đổi
var FILES = [
  './', './index.html', './manifest.json', './css/style.css',
  './js/audio.js', './js/art.js', './js/fx.js', './js/games.js', './js/app.js',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png',
  './audio/voice/manifest.json'
];
var VOICE_DIR = './audio/voice/';

function isVoiceFile(url) {
  return url.indexOf('/audio/voice/') >= 0 && /\.mp3$/.test(url);
}

// Tải sẵn mọi tệp giọng đọc còn thiếu (từng nhóm nhỏ), xoá tệp không còn dùng.
function cacheVoices() {
  return fetch(VOICE_DIR + 'manifest.json').then(function (r) { return r.json(); }).then(function (m) {
    var wanted = Object.keys(m).map(function (k) { return new URL(VOICE_DIR + m[k], self.location).href; });
    return caches.open(VOICE_CACHE).then(function (c) {
      return c.keys().then(function (have) {
        var haveUrls = have.map(function (req) { return req.url; });
        var stale = have.filter(function (req) { return wanted.indexOf(req.url) < 0; });
        var missing = wanted.filter(function (u) { return haveUrls.indexOf(u) < 0; });
        var i = 0;
        var batch = function () {
          if (i >= missing.length) return Promise.resolve();
          var group = missing.slice(i, i + 8);
          i += 8;
          return Promise.all(group.map(function (u) {
            return c.add(u).catch(function () { /* thử lại ở lần mở sau */ });
          })).then(batch);
        };
        return Promise.all(stale.map(function (req) { return c.delete(req); })).then(batch);
      });
    });
  }).catch(function () { /* không có mạng: dùng những gì đã có */ });
}

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE)
    .then(function (c) { return c.addAll(FILES); })
    .then(cacheVoices));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== VOICE_CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(cacheVoices)); // bổ sung tệp còn thiếu nếu lần cài trước bị gián đoạn
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  // Giọng đọc: lấy trong máy trước, chỉ tải khi chưa có.
  if (isVoiceFile(e.request.url)) {
    e.respondWith(caches.open(VOICE_CACHE).then(function (c) {
      return c.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (res) {
          if (res.ok) c.put(e.request, res.clone());
          return res;
        });
      });
    }));
    return;
  }

  // Phần còn lại: ưu tiên bản mới trên mạng, mất mạng thì dùng bản đã lưu.
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
