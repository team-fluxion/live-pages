import { init } from '../router/client';
import config from '../web/config';

import './pwa';
import '../web/styles/styles.less';

export default () => {
    init(config);
};
