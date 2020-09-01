/* global module */

module.exports = {
    appName: 'that-web-app',
    friendlyName: 'That Web App',
    description: 'A framework to build text-driven websites',
    domain: 'http://localhost:8000',
    staticPath: 'assets',
    colors: {
        themeColor: '#000',
        backgroundColor: '#000'
    },
    routes: {
        url: '/',
        page: 'home',
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
