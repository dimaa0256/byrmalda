const CACHE = 'burmalda-v2';
const ASSETS = [
  '/index.html',
  '/slot.html',
  '/minesweeper.html',
  '/airplane.html',
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

// Network first — всегда берём свежие данные, кэш только если офлайн
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  // Не кэшируем Firebase, внешние API и не-200 ответы
  if (url.includes('firebaseio.com') || url.includes('googleapis.com') ||
      url.includes('firebaseapp.com') || !url.startsWith('http')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Кэшируем только успешные полные ответы (не 206 Partial)
        if (res.ok && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
