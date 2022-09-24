import { init, handleRoute } from '../router/client';
import socketClient from './socket-client';

import config from '../web/config';

import './pwa';
import '../web/styles/styles.less';

export default () => {
    init(config);
    socketClient(config, handleRoute);
};
