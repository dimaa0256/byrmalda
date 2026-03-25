const CACHE = 'burmalda-v3';
const ASSETS = [
  '/index.html',
  '/slot.html',
  '/minesweeper.html',
  '/airplane.html',
  '/shariki.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  // Пропускаем внешние API без обработки
  if (url.includes('ipapi.co') ||
      url.includes('firebaseio.com') ||
      url.includes('googleapis.com') ||
      url.includes('firebaseapp.com') ||
      url.includes('gstatic.com') ||
      !url.startsWith('https://dimaa0256.github.io')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Кэшируем только успешные полные ответы
        if (res.ok && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
