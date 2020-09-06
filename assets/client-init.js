import { alert } from 'ample-alerts';

import { init } from '../router/client';
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
    init(config);
};
