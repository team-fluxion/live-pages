/* global caches fetch skipWaiting */

const cacheName = '#sw-cache-string#',
    origin = '#sw-origin#';

this.addEventListener(
    'install',
    event => {
        event.waitUntil(
            caches.open(cacheName)
                .then(
                    cache => cache.addAll(
                        [
                            origin,
                            origin + 'index.html',
                            origin + 'styles/styles.css',
                            origin + 'scripts/app.js',
                            origin + 'images/me.jpg',
                            origin + 'images/social-phone.png',
                            origin + 'images/social-web.png',
                            origin + 'images/social-calendar.png',
                            origin + 'images/social-github.png',
                            origin + 'images/social-stackoverflow.png',
                            origin + 'images/social-twitter.png',
                            origin + 'images/social-dev.png',
                            origin + 'images/social-linkedin.png',
                            origin + 'images/page-me.jpg',
                            origin + 'images/page-diary.jpg',
                            origin + 'images/page-projects.jpg',
                            origin + 'images/page-resume.jpg',
                            origin + 'images/wooden-canvas.jpg',
                            origin + 'images/never-stop-writing-code.jpg',
                            origin + 'images/paper-halftone.png',
                            origin + 'fonts/fontawesome-webfont.woff2',
                            origin + 'fonts/OpenSans-Light.ttf',
                            origin + 'fonts/OpenSans-Regular.ttf',
                            origin + 'fonts/Overlock-Regular.ttf',
                            origin + 'fonts/Jura-Regular.otf',
                            origin + 'fonts/Sofia-Regular.otf',
                            origin + 'icons/launcher-icon-1x.png',
                            origin + 'icons/launcher-icon-2x.png',
                            origin + 'icons/launcher-icon-4x.png',
                            origin + 'manifest.json',
                            origin + 'favicon.ico'
                        ]
                    )
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
                                if (key !== cacheName) {
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
