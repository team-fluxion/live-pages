/* global require module */

const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
            from: `${templateDir}/manifest.json`,
            transform: (content, path) =>
                content.toString()
                .replace(/#manifest-origin#/g, '/')
        }
    ]);

    const html = new HtmlWebpackPlugin({
        template: `${templateDir}/index.ejs`,
        templateParameters: {
            titlePrefix: '[DEBUG] ',
            baseUrl: '/'
        },
        filename: 'index.html',
        chunks: ['app']
    });

    return WebpackMerge(
        commonConfig(options),
        {
            devtool: 'inline-source-map',
            plugins: [
                copy,
                html
            ]
        }
    );
};
