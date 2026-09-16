/* Service worker: keeps images, audio and the app shell available offline.
   Pages themselves are never cached — they depend on who is logged in. */
const VERSION = 'v1';
const STATIC = `rs-static-${VERSION}`;
const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC)
      .then((cache) => cache.addAll([OFFLINE_URL, '/icons/icon-192.png']))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch { return; }
  if (url.origin !== self.location.origin) return;

  // A page request: always go to the network, fall back to the offline notice.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL).then((hit) => hit || Response.error())));
    return;
  }

  const cacheable = url.pathname.startsWith('/media/')
    || url.pathname.startsWith('/icons/')
    || url.pathname.startsWith('/_next/static/');
  if (!cacheable) return;

  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(STATIC).then((cache) => cache.put(req, copy)).catch(() => undefined);
      }
      return res;
    })),
  );
});
