import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// Claim clients immediately
self.skipWaiting();
clientsClaim();

// Cache disease knowledge base
registerRoute(
  /\/api\/disease-info/,
  new NetworkFirst({
    cacheName: 'disease-kb',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 })
    ]
  })
);

// Cache static assets
registerRoute(
  /\.(?:js|css|png|jpg|svg|json)$/,
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
  })
);

// Cache weather data
registerRoute(
  /\/api\/weather/,
  new StaleWhileRevalidate({ cacheName: 'weather-data' })
);

// Listen for messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ Service Worker registered - Offline support enabled');