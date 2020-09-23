#!/usr/bin/env node

/* global require module */

const yargs = require('yargs').argv;
const webpack = require('webpack');

const webpackConfigDev = require('./webpack.dev');
const webpackConfigProd = require('./webpack.prod');
const startWebServer = require('./web-server');

// Function to validate input arguments
const validateInputArguments = () => {
    // TODO: Implement validations
};

// Function to compile client code in debug mode
const compileClientInDebugMode = () => {
    // TODO: Implement
    // webpack --config webpack.dev.js
};

// Function to compile client code in develop mode
const compileClientInDevelopMode = () => {
    // TODO: Implement
    // webpack --config webpack.dev.js --watch
};

// Function to compile client code in production mode
const compileClientInProductionMode = () => {
    // TODO: Implement
    // webpack --config webpack.prod.js && node sw-generator.js
};

// Function to compile with watch and start web-server
const develop = () => {
    // TODO: Implement
    // compileClientInDevelopMode(); startWebserver(portNumber);
};

// Function to compile in release and start web-server
const start = () => {
    // TODO: Implement
    // compileClientInProductionMode(); startWebServer(portNumber);
};

// The 'main' function
const main = () => {
    console.log('nice!');
    console.log(yargs);

    // TODO: Validate arguments

    // TODO: Check for 'start'

    // TODO: Check for 'develop'

    // TODO: Check for 'compile'

    // // TODO: Check for 'webpack-debug'
    // // TODO: Check for 'webpack-develop
    // // TODO: Check for 'webpack'
};

// Start 'main'
main();

// Export web-server for external use
module.exports = startWebServer;
