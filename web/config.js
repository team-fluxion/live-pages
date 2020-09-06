/* global module */

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
                url: '/about',
                page: 'about'
            }
        ]
    },
    maskInvalidRoutes: false,
    genericErrorText: 'There was an error while displaying this page!'
};
