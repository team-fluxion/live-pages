/* global require module __dirname */

const libraryFileName = 'live-pages';
const libraryName = 'livePages';

const sourceDir = 'src';
const outputDir = 'build';

const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const clean = new CleanWebpackPlugin([outputDir]);
const extractCSS = new ExtractTextPlugin(`styles/${libraryFileName}.css`);
const optimizeCSS = new OptimizeCssAssetsPlugin();

module.exports = {
    mode: 'development',
    entry: {
        [libraryFileName]: `./${sourceDir}/scripts/${libraryFileName}.js`
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
                test: /\.(less|css)$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
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
            }
        ]
    },
    plugins: [
        clean,
        extractCSS,
        optimizeCSS
    ],
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, outputDir),
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
};
