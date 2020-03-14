/* global require module __dirname */

const path = require('path');
const webpack = require('webpack');

const webpackDev = require('./webpack.dev');

module.exports.compile = options => {
    const {
            project: {
                sourceDir,
                outputDir
            },
            configs
    } = options;

    webpack(
        webpackDev({
            project: {
                templateDir: path.join(__dirname, './template'),
                sourceDir,
                outputDir,
            },
            configs
        }),
        (err, stats) => {
            if (err) {
                console.error(err.stack || err);
                if (err.details) {
                    console.error(err.details);
                }
                return;
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                console.error(info.errors);
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings);
            }
        }
    );
}
