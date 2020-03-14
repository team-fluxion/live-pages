/* global require */

const livePages = require('../../');

const configs = require('./configs.json');

livePages.compile({
    project: {
        sourceDir: './examples/simple',
        outputDir: './public'
    },
    configs
});
