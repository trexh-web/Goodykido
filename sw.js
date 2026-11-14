/* Goodykido Service Worker
   - يخزّن هيكل الموقع للعمل السريع وبدون إنترنت (الصفحة والأيقونات والملفات المحلية).
   - الصفحة الرئيسية: الشبكة أولاً (لتصلك التحديثات فوراً) ثم النسخة المخزنة عند انقطاع الإنترنت.
   - لا يتدخل أبداً في تسجيل الدخول (/__/auth) ولا في طلبات Firebase/YouTube API/مشغّل الفيديو.
   لإجبار جميع الأجهزة على تحديث الملفات المخزنة: غيّر رقم VERSION ثم انشر. */
const VERSION = 'v2';
const SHELL = 'goodykido-shell-' + VERSION;
const RUNTIME = 'goodykido-cdn-' + VERSION;
const THUMBS = 'goodykido-thumbs-' + VERSION;
const KEEP = [SHELL, RUNTIME, THUMBS];
const MAX_THUMBS = 150;

const PRECACHE = [
  '/', '/index.html', '/manifest.json', '/library.js', '/auth.js', '/translations.js',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png', '/icons/favicon-32.png', '/icons/icon.svg'
];

function isCdn(u) {
  return u.hostname === 'cdn.tailwindcss.com' || u.hostname === 'unpkg.com' ||
         u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com' ||
         (u.hostname === 'www.gstatic.com' && u.pathname.indexOf('/firebasejs/') === 0);
}
function isThumb(u) { return u.hostname === 'img.youtube.com' || u.hostname === 'i.ytimg.com'; }

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // كل ملف على حدة: غياب ملف واحد لا يُفشل التثبيت
    await Promise.all(PRECACHE.map(async url => {
      try { const res = await fetch(new Request(url, { cache: 'reload' })); if (res.ok) await cache.put(url, res); } catch (e) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.indexOf('goodykido-') === 0 && !KEEP.includes(n)).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

async function networkFirstPage(req) {
  const cache = await caches.open(SHELL);
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);          // اتصال بطيء: نعرض النسخة المخزنة
    const res = await fetch(req, { signal: ctl.signal });
    clearTimeout(timer);
    if (res.ok && !res.redirected) cache.put('/index.html', res.clone());
    return res;
  } catch (e) {
    return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('/index.html')) || (await cache.match('/')) || Response.error();
  }
}

function staleWhileRevalidate(event, cacheName) {
  return caches.open(cacheName).then(async cache => {
    const cached = await cache.match(event.request);
    const update = fetch(event.request).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(event.request, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(update); return cached; }
    return (await update) || Response.error();
  });
}

async function thumbCacheFirst(event) {
  const cache = await caches.open(THUMBS);
  const cached = await cache.match(event.request);
  if (cached) return cached;
  try {
    const res = await fetch(event.request);
    if (res && (res.ok || res.type === 'opaque')) { await cache.put(event.request, res.clone()); event.waitUntil(trim(THUMBS, MAX_THUMBS)); }
    return res;
  } catch (e) { return Response.error(); }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (url.pathname.indexOf('/__/') === 0 || url.pathname.indexOf('/api/') === 0) return;   // Firebase Auth وغيره: بدون تدخل
    if (req.mode === 'navigate') { event.respondWith(networkFirstPage(req)); return; }
    event.respondWith(staleWhileRevalidate(event, SHELL));
    return;
  }
  if (isCdn(url)) { event.respondWith(staleWhileRevalidate(event, RUNTIME)); return; }
  if (isThumb(url)) { event.respondWith(thumbCacheFirst(event)); return; }
  // أي شيء آخر (YouTube، Firebase، Google APIs): يمر مباشرة إلى الشبكة
});
