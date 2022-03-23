/* global require module */

const appConfig = require('./web/config');

const knownConfigs = {
    1: [
        'configVersion',
        'appName',
        'friendlyName',
        'description',
        'type',
        'domain',
        'staticPath',
        'colors',
        'pageElementSelector',
        'navigationClassNamesPrefix',
        'navigationAnimationDelay',
        'activeLinkClassName',
        'routes',
        'webApis',
        'dynamicElements',
        'onNavigate',
        'additionalAssetsToInclude',
        'exceptionsForStaticDirectory',
        'redirects',
        'invalidRouteAction',
        'invalidRouteMessage',
        'genericErrorText'
    ]
};

// Function to validate app configs with known config specifications
module.exports.validate = () => {
    // Gather required data
    const configVersion = appConfig.configVersion;
    const knownConfigKeys = knownConfigs[configVersion];

    // Check if the config version is known
    if (!knownConfigKeys) {
        // Invalidate the config
        console.log('Invalid config file found! Please check ./web/config.js.');
        return false;
    }

    const expectedKeys = knownConfigKeys.slice();
    const availableKeys = Object.keys(appConfig);

    // Find missing keys
    const missingKeys = expectedKeys.filter(
        k => availableKeys.indexOf(k) < 0
    );
    if (missingKeys.length) {
        console.log(
            'The following keys are missing:',
            missingKeys.join()
        );
    }

    // Find redundant keys
    const redundantKeys = availableKeys.filter(
        k => expectedKeys.indexOf(k) < 0
    );
    if (redundantKeys.length) {
        console.log(
            'The following keys are redundant:',
            redundantKeys.join()
        );
    }

    return !missingKeys.length;
};
