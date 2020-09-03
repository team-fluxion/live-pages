/* global caches fetch skipWaiting */

this.addEventListener(
    'install',
    event => {
        event.waitUntil(
            caches.open('swCacheString')
                .then(
                    cache => cache.addAll('outputFileList')
                )
                .catch(
                    err => {
                        console.log(err);
                    }
                )
        );
    });

this.addEventListener(
    'fetch',
    event => {
        const urlWithoutQueryParams = event.request.url.split('?')[0];

        event.respondWith(
            caches.match(urlWithoutQueryParams)
                .then(
                    response => {
                        if (response) {
                            return response;
                        }

                        return fetch(event.request);
                    }
                )
        );
    }
);

this.addEventListener(
    'activate',
    event => {
        event.waitUntil(
            caches.keys()
                .then(
                    keyList => Promise.all(
                        keyList.map(
                            key => {
                                if (key !== 'swCacheString') {
                                    return caches.delete(key);
                                } else {
                                    return null;
                                }
                            }
                        )
                    )
                )
        );
    }
);

this.addEventListener(
    'message',
    messageEvent => {
        if (messageEvent.data === 'skipWaiting') {
            return skipWaiting();
        } else {
            return null;
        }
    }
);
