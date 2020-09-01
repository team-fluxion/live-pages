/* global require module */

const sourceDir = 'web';

const WebpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const config = require('./web/config');

const html = new HtmlWebpackPlugin({
    template: `${sourceDir}/index.ejs`,
    templateParameters: {
        titlePrefix: '[DEBUG] ',
        baseUrl: `${config.domain}/${config.staticPath}/`
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
