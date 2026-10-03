const FILES = ["./","./assets/index-CzuJTBsC.js","./assets/index-DnNh-MJr.css","./index.html","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./manifest.webmanifest"];
const VERSION = '4c66066228b6';
// Offline copy of the phone reader's own files (Plan/phone-reader pr8). GitHub
// API calls are never touched — note text and attachments live in IndexedDB.
// FILES and VERSION are prepended at build time by vite.phone.config.ts; a new
// deploy changes VERSION, so the browser installs the new copy and drops the old.
const CACHE = 'shell-' + VERSION;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Cache first: the app opens instantly with or without signal; a new deploy
// shows on the open after the one that downloads it.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Routes live in the #hash, so every page load is the one index.html.
  const key = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(caches.match(key).then((hit) => hit ?? fetch(req)));
});
