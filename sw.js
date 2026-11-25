/* Let Us PDF - service worker: works offline once visited, and receives files shared from other apps (Android) */
const VERSION='v28';
const CACHE = 'letuspdf-' + VERSION;
const SHARE = 'letuspdf-share';
const ASSETS = [
  './', './index.html', './app.js', './manifest.webmanifest',
  './lib/pdf.min.mjs', './lib/pdf.worker.min.mjs', './lib/pdf-lib.min.js', './lib/fontkit.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './favicon32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('letuspdf-') && k !== CACHE && k !== SHARE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  /* a PDF shared to the app: park it in a cache, then reload the page, which opens it */
  if (req.method === 'POST' && url.pathname.endsWith('/share-target')) {
    e.respondWith((async () => {
      try {
        const form = await req.formData();
        const files = form.getAll('file').filter(f => f && f.name !== undefined);
        const c = await caches.open(SHARE);
        let i = 0;
        for (const f of files) {
          await c.put('./shared/' + (i++), new Response(f, { headers: { 'Content-Type': f.type || 'application/pdf', 'X-Name': encodeURIComponent(f.name || 'document.pdf') } }));
        }
        return Response.redirect('./?shared=' + i, 303);
      } catch (err) {
        return Response.redirect('./', 303);
      }
    })());
    return;
  }

  /* the font engine (loaded from a CDN the first time fonts are imported) is kept for offline use */
  if (req.method === 'GET' && /fontkit/.test(url.pathname) && /(jsdelivr|unpkg)/.test(url.host)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
    return;
  }

  if (req.method !== 'GET' || url.origin !== location.origin) return;

  /* the page itself and the app code: network first (fresh when online), cache when offline */
  const isCode = req.mode === 'navigate' || url.pathname.endsWith('/') || /\/(index\.html|app\.js|sw\.js|manifest\.webmanifest)$/.test(url.pathname);
  if (isCode) {
    e.respondWith(
      fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  /* libraries, icons: cache first */
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }))
  );
});
