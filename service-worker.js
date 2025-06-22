const CACHE_NAME = 'my-pwa-cache-v1';
const FILES_TO_CACHE = [
    "/",
    "/types.js",
    "/components/Key.js",
    "/WordlessApiMock.js",
    "/components/Keyboard.js",
    "/components/GuessLetter.js",
    "/components/GuessWord.js",
    "/CumulativeStats.js",
    "/components/StatBar.js",
    "/components/Stats.js",
    "/components/LineEdit.js",
    "/components/GameContainer.js",
    "/lib/vue.js",
    "/fonts/Caveat-Medium.ttf",
    "/app.js"

];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
