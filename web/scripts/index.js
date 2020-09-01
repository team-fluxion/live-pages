/* global require process window module */

import { init } from '../../router/client';
import config from '../config';

import './pwa';
import '../styles/styles.less';

// const isProductionMode = process.env.NODE_ENV === 'production';

window.onload = () => {
    init(
        '[data-tf-router]',
        config.routes,
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
