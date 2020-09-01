/* global require process window document module */

import { init } from '../../router.js';
import routes from '../routes.json';

import './pwa';
import '../styles/styles.less';

// const isProductionMode = process.env.NODE_ENV === 'production';

window.onload = () => {
    init(
        document.querySelector('[data-tf-router]'),
        routes,
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
