/* global require module window */

module.exports = {
    appName: 'that-web-app',
    friendlyName: 'That Web App',
    description: 'A framework to build text-driven websites',
    type: 'article',
    domain: 'http://localhost:8000',
    staticPath: 'assets',
    colors: {
        themeColor: '#000',
        backgroundColor: '#000'
    },
    pageElementSelector: '[data-tf-router]',
    routes: {
        url: '/',
        page: 'home',
        data: () => ({
            timeRightNow: new Date()
        }),
        subRoutes: [
            {
                url: 'about',
                page: 'about',
                data: {
                    who: 'me'
                }
            },
            {
                url: 'epoch',
                page: 'epoch',
                data: () => new Promise(
                    resolve => {
                        resolve({ epoch: new Date().getTime() });
                    }
                )
            },
            {
                url: 'calc',
                subRoutes: [
                    {
                        url: 'add',
                        page: 'calc',
                        data: (x, y, a, b) => ({
                            operation: '+',
                            a,
                            b,
                            result: +a + +b
                        })
                    },
                    {
                        url: 'multiply',
                        page: 'calc',
                        data: (x, y, a, b) => ({
                            operation: '*',
                            a,
                            b,
                            result: +a * +b
                        })
                    }
                ]
            }
        ]
    },
    invalidRouteAction: url => {
        window.alert(`Invalid route: ${url}`, { autoClose: 5000 });
    },
    invalidRouteMessage: 'You navigated to a URL that doesn\'t exist!',
    genericErrorText: 'There was an error while displaying this page!'
};
