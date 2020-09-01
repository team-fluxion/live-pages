/* global process window module */

import { alert } from 'ample-alerts';

import { init } from '../../router/client';
import config from '../config';

import './pwa';
import '../styles/styles.less';

// const isProductionMode = process.env.NODE_ENV === 'production';

const options = {};

if (!config.maskInvalidRoutes) {
    options.unknownRouteAction = url => {
        alert(`Invalid route: ${url}`, { autoClose: 5000 });
    };
}

window.onload = () => {
    init(
        config.pageElementSelector,
        config.routes,
        options
    );
};

if (module.hot) {
    module.hot.accept();
}
