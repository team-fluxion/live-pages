/* global require module */

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');

const devConfig = require('./webpack.dev.js');

module.exports = options => {
    const {
        project: {
            templateDir,
            sourceDir,
            outputDir,
        },
        configs
    } = options;

    return WebpackMerge(
        devConfig(options),
        {
            devServer: {
                contentBase: `./${outputDir}`,
                historyApiFallback: true,
                hot: true
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin()
            ]
        }
    );
};
