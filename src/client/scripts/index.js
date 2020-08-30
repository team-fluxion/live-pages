/* global require process window document module */

import { init } from '../../router.js';

import './pwa';

import '../styles/styles.less';

// const configs = require('../../../configs.json');

// const isProductionMode = process.env.NODE_ENV === 'production';
// const baseUrl = isProductionMode ? configs.origin : '/';

window.onload = () => {
    init(
        document.querySelector('[data-tf-router]'),
        {
            url: '/',
            page: 'home',
            subRoutes: [
                {
                    url: '/about',
                    page: 'about'
                }
            ]
        },
        {
            unknownRouteAction: url => {
                window.alert(`Invalid route: ${url}`);
            }
        }
    );
};

if (module.hot) {
    module.hot.accept();
}
