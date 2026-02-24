const CACHE_NAME = 'sistema-lldm-v5'; // Subimos versión para forzar el cambio

const ASSETS = [
  './',
  './index.html',
  './CENSOLLDM.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. INSTALACIÓN: Guardado uno por uno para que un error no detenga todo
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Sistema LLDM: Guardando archivos en memoria...');
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => 
            console.warn(`No se pudo guardar en caché: ${url}. Revisa si el archivo existe.`)
          );
        })
      );
    })
  );
  self.skipWaiting(); // Obliga al nuevo SW a tomar el control de inmediato
});

// 2. ACTIVACIÓN: Limpieza profunda de versiones antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Sistema LLDM: Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Toma el control de las pestañas abiertas inmediatamente
});

// 3. ESTRATEGIA: Primero Red, luego Caché (Network First)
// Ideal para sistemas de censo donde los datos actualizados son prioridad
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then(response => {
        if (response) return response;

        // Si el usuario navega a una ruta interna sin red, devolver el index
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
