const CACHE_NAME = 'sistema-lldm-v1';

// Lista de todos los archivos que deben funcionar sin internet
const ASSETS = [
  './',
  './index.html',
  './CENSOLLDM.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalación: Guarda los archivos en la memoria del celular
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cacheando archivos del sistema...');
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Borra versiones viejas de la app si haces cambios
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Estrategia de carga: Carga rápido desde memoria, pero actualiza si hay red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});