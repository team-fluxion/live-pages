/* global module */

const getProcessedAppDomain = ({ appDomain, appPort }) =>
    (appDomain.indexOf('localhost') === -1
        ? `https://${appDomain}`
        : `http://${appDomain}:${appPort}`);

module.exports.getProcessedAppDomain = getProcessedAppDomain;
