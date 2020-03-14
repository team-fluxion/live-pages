/* global require module */

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common.js');

module.exports = options => {
    const {
        project: {
            templateDir,
            sourceDir,
            outputDir
        },
        configs
    } = options;

    const copy = new CopyWebpackPlugin([
        {
            from: `${templateDir}/sw.js`,
            transform: (content, path) =>
                content.toString()
                .replace(/#sw-cache-string#/g, (new Date().getTime()))
                .replace(/#sw-origin#/g, configs.origin)
        },
        {
            from: `${templateDir}/manifest.json`,
            transform: (content, path) =>
                content.toString()
                .replace(/#manifest-origin#/g, configs.origin)
        }
    ]);

    const html = new HtmlWebpackPlugin({
        template: `${templateDir}/index.ejs`,
        templateParameters: {
            titlePrefix: '',
            baseUrl: configs.domain + configs.origin
        },
        filename: 'index.html',
        chunks: ['app'],
        hash: true
    });

    return WebpackMerge(
        commonConfig(options),
        {
            mode: 'production',
            plugins: [
                copy,
                new UglifyJSPlugin(),
                html
            ]
        }
    );
};
