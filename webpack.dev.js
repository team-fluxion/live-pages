/* global require module */

const templatesDir = 'assets';

const WebpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const config = require('./web/config');

const { getProcessedAppDomain } = require('./assets/common');

const html = new HtmlWebpackPlugin({
    template: `${templatesDir}/index.ejs`,
    templateParameters: {
        name: config.friendlyName,
        title: `[DEBUG] ${config.friendlyName}: ${config.description}`,
        description: config.description,
        type: config.type,
        appDomain: getProcessedAppDomain(config),
        baseUrl: `${getProcessedAppDomain(config)}/${config.staticPath}/`
    },
    filename: 'index.html',
    chunks: ['app']
});

module.exports = WebpackMerge(
    commonConfig,
    {
        devtool: 'inline-source-map',
        plugins: [
            html
        ]
    }
);
