import { init } from '../router/client';
import config from '../../../src/config';

import './pwa';
import '../../../src/styles/styles.less';

export default () => {
    init(config);
};
