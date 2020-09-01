/* global module */

module.exports = {
    domain: 'http://localhost:8000',
    staticPath: 'assets',
    routes: {
        url: '/',
        page: 'home',
        subRoutes: [
            {
                url: '/about',
                page: 'about'
            }
        ]
    }
};
