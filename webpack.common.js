/* global require module __dirname */

const sourceDir = 'web';
const outputDir = 'public';

const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = require('./web/config');

const clean = new CleanWebpackPlugin([outputDir]);
const assetsToBeCopied = [
    {
        from: `${sourceDir}/favicon.ico`
    },
    {
        from: `${sourceDir}/icons`,
        to: 'icons'
    }
];
const copy = new CopyWebpackPlugin(
    assetsToBeCopied
        .concat(
            config.additionalAssetsToInclude.map(
                a => ({ from: `${sourceDir}/${a}`, to: a })
            )
        )
);
const extractCSS = new ExtractTextPlugin('styles/styles.css');
const optimizeCSS = new OptimizeCssAssetsPlugin();

module.exports = {
    mode: 'development',
    entry: {
        app: `./${sourceDir}/scripts/index.js`
    },
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        publicPath: '../'
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]',
                        publicPath: '../'
                    }
                }
            },
            {
                test: /\.(less|css)$/,
                use: ['extracted-loader'].concat(extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                }))
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.handlebars$/,
                exclude: /node_modules/,
                loader: 'handlebars-loader'
            },
            {
                test: /.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        clean,
        copy,
        extractCSS,
        optimizeCSS
    ],
    node: {
        fs: 'empty'
    },
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, outputDir),
        publicPath: ''
    }
};
