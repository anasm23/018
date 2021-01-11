// Declare files to cache
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./index.js",
    "./style.css",
];
/////
const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = 'data-cache-v1'
//////
const iconSizes = ["192"];
const iconFiles = iconSizes.map(
  (size) => `./icons/icon-${size}x${size}.png`
);
/////
// install
self.addEventListener("install", evt =>{
    evt.waitUntil(
        caches.open(DATA_CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)),
        console.log("success")
    );
    self.skipWaiting();
});
////
self.addEventListener('activate', evt => {
  evt.waitUntil(
      caches.keys().then(keyList => {
          return Promise.all(
              keyList.map( key => {
                  if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                      console.log('Data Removed', key);
                      return caches.delete(key);
                  }
              })
          );
      })
  );
  self.clients.claim();
});
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});
//////
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});
//////
self.addEventListener("fetch", (evt) => {
  if (evt.request.url.includes("/api/") && evt.request.method === "GET") {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(evt.request, response.clone());
              }

              return response;
            })
            .catch(() => {
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );
    return;
  }
////
evt.respondWith(
  caches.match(evt.request).then((response) => {
    return response || fetch(evt.request);
  })
);
});
