// Tabi service worker — keeps visited pages usable offline (planes, trains, flaky wifi).
// Pages: network-first, cached as they're visited. Static assets: cache-first.
const PAGES = 'tabi-pages-v1';
const ASSETS = 'tabi-assets-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(PAGES).then((c) => c.add('/')));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== PAGES && k !== ASSETS).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  // Never cache mutations or server-action POSTs (already filtered by GET above).
  const url = new URL(request.url);

  // Static build assets are content-hashed → cache-first is safe.
  if (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/icons')) {
    e.respondWith(
      caches.open(ASSETS).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      }),
    );
    return;
  }

  // Page navigations + RSC payloads: network-first, fall back to last visited copy.
  if (request.mode === 'navigate' || request.headers.get('RSC')) {
    e.respondWith(
      caches.open(PAGES).then(async (cache) => {
        try {
          const res = await fetch(request);
          if (res.ok) cache.put(request, res.clone());
          return res;
        } catch {
          const hit = await cache.match(request, { ignoreSearch: false });
          return hit || cache.match('/');
        }
      }),
    );
  }
});
