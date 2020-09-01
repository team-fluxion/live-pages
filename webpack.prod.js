/* global require module */

const sourceDir = 'src/client';

const path = require('path');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const config = require('./web/config');

const copy = new CopyWebpackPlugin([
    {
        from: `${sourceDir}/sw.js`,
        transform: (content, path) =>
            content.toString()
            .replace(/#sw-cache-string#/g, (new Date().getTime()))
            .replace(/#sw-origin#/g, `/${config.staticPath}/`)
    },
    {
        from: `${sourceDir}/manifest.json`,
        transform: (content, path) =>
            content.toString()
            .replace(/#manifest-origin#/g, `/${config.staticPath}/`)
    }
]);
const html = new HtmlWebpackPlugin({
    template: `${sourceDir}/index.ejs`,
    templateParameters: {
        titlePrefix: '',
        baseUrl: `${config.domain}/${config.staticPath}/`
    },
    filename: 'index.html',
    chunks: ['app'],
    hash: true
});

module.exports = WebpackMerge(
    commonConfig,
    {
        mode: 'production',
        plugins: [
            copy,
            new UglifyJSPlugin(),
            html
        ]
    }
);
