const CACHE_NAME = 'control-lldm-v1';
const ASSETS = [
  './index.html',
  './manifest.json'
];

// Instalación y almacenamiento en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Estrategia: Carga desde caché y actualiza si hay red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});