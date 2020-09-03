import { alert } from 'ample-alerts';

import { init as initRouter } from '../router/client';
import config from '../web/config';

import './pwa';
import '../web/styles/styles.less';

const options = {};

if (!config.maskInvalidRoutes) {
    options.unknownRouteAction = url => {
        alert(`Invalid route: ${url}`, { autoClose: 5000 });
    };
}

export default () => {
    initRouter(
        config.pageElementSelector,
        config.routes,
        options
    );
};
