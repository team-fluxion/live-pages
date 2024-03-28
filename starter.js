/* global require */

const { appPort, socketPort, dataDirectoryPath } = require('./web/config');

require('./start-web')(appPort);

if (dataDirectoryPath) {
    require('./start-socket')(socketPort);
}
