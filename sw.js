const CACHE = 'burmalda-v3'; // Обновили версию
const ASSETS = [
  './index.html',
  './slot.html',
  './minesweeper.html',
  './airplane.html',
  './shariki.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  
  const url = e.request.url;
  
  // ПОЛНОСТЬЮ ИГНОРИРУЕМ FIREBASE И ВНЕШНИЕ API (пусть грузятся напрямую)
  if (url.includes('googleapis.com') || url.includes('firebase') || url.includes('ipapi.co')) {
    return;
  }

  // Для остальных файлов: Сначала кэш, если нет — сеть. Это МГНОВЕННО для UI.
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});
