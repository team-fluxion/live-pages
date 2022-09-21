/* global require module */

const templatesDir = 'assets';

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
        from: `${templatesDir}/manifest.json`,
        transform: (content, path) =>
            content.toString()
            .replace(/#short-name#/g, `${config.friendlyName}`)
            .replace(/#long-name#/g, `${config.friendlyName} - ${config.description}`)
            .replace(/#static-path#/g, `${config.staticPath}`)
            .replace(/#background-color#/g, `${config.colors.backgroundColor}`)
            .replace(/#theme-color#/g, `${config.colors.themeColor}`)
    }
]);
const html = new HtmlWebpackPlugin({
    template: `${templatesDir}/index.ejs`,
    templateParameters: {
        name: config.friendlyName,
        title: `${config.friendlyName}: ${config.description}`,
        description: config.description,
        type: config.type,
        appDomain: config.appDomain,
        baseUrl: `${config.appDomain}/${config.staticPath}/`
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
