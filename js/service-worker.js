const CACHE_NAME = 'tabletop-app-cache-v1';
const urlsToCache = [
    '../',
    '../index.html',
    '../manifest.json',
    '../favicon.ico',
    '../css/tabletop2025.css',
    '../css/tabletop_animations.css',
    '../icons/tabletop-pwa-icon-192.png',
    '../icons/tabletop-pwa-icon-512.png',
    '../js/tabletop.js',
    '../js/main.js'
];

// Install event: cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        )
    );
    self.clients.claim();
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});