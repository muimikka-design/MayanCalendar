const CACHE_NAME = 'maya-calculator-v1';
const urlsToCache = [
  './',
  './index.html',
  './script.js',
  './manifest.json'
  // 如果您希望離線時也能看到圖騰，可以把重要的圖片路徑也加進來
  // 例如: './images/Imox.png', 
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截網路請求，若有快取就直接回傳，沒有才去網路抓
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; 
        }
        return fetch(event.request);
      })
  );
});