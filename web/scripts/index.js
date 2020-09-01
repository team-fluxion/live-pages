/* global process window module */

import { alert } from 'ample-alerts';

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
                alert(`Invalid route: ${url}`, { autoClose: 5000 });
            }
        }
    );
};

if (module.hot) {
    module.hot.accept();
}
