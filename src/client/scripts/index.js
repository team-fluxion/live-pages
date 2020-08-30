/* global require process window module */

import { init } from '../../router.js';

import './pwa';

import '../styles/styles.less';

// const configs = require('../../../configs.json');

// const isProductionMode = process.env.NODE_ENV === 'production';
// const baseUrl = isProductionMode ? configs.origin : '/';

window.onload = () => {
    init(
        {
            url: '/',
            data: 'This is root!',
            subRoutes: [
                {
                    url: '/1',
                    data: 'one'
                },
                {
                    url: '/2',
                    data: 'two'
                },
                {
                    url: '/3',
                    data: 'This is OK.',
                    subRoutes: [
                        {
                            url: '/good',
                            data: 'This is great!'
                        },
                        {
                            url: '/bad',
                            data: 'This is even better!'
                        }
                    ]
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
