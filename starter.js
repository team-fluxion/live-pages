/* global require */

const { appPort, socketPort } = require('./web/config');

require('./start-web')(appPort);
require('./start-socket')(socketPort);
