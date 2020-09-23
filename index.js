#!/usr/bin/env node

/* global require module */

const yargs = require('yargs').argv;
const webpack = require('webpack');

const webpackConfigDev = require('./webpack.dev');
const webpackConfigProd = require('./webpack.prod');
const startWebServer = require('./web-server');
const { generateSW } = require('./sw-generator');

// Function to generate handler for webpack compiler response
const getHandlerForWebpackCompiler = isReleaseMode =>
      (err, stats) => {
          if (err) {
              console.error(err.stack || err);
              if (err.details) {
                  console.error(err.details);
              }
              return;
          }

          const info = stats.toJson();

          if (stats.hasErrors()) {
              console.error(info.errors);
          }

          if (stats.hasWarnings()) {
              console.warn(info.warnings);
          }

          if (isReleaseMode) {
              generateSW();
          }
      };

// Function to compile client code in debug mode
const compileClientInDebugMode = () => {
    webpack(webpackConfigDev).run(
        getHandlerForWebpackCompiler()
    );
};

// Function to compile client code in develop mode
const compileClientInDevelopMode = () => {
    webpack(webpackConfigDev).watch(
        {},
        getHandlerForWebpackCompiler()
    );
};

// Function to compile client code in production mode
const compileClientInReleaseMode = () => {
    webpack(webpackConfigProd).run(
        getHandlerForWebpackCompiler(true)
    );
};

// Function to compile with watch and start web-server
const develop = port => {
    compileClientInDevelopMode();
    startWebServer(port);
};

// Function to compile in release and start web-server
const start = port => {
    compileClientInReleaseMode();
    startWebServer(port);
};

// Function to throw a message about a missing argument
const reportErrorForArgument = argumentName => {
    console.log(`Please specify value for '${argumentName}'!`);
};

// The 'main' function
const main = () => {
    if (yargs.compile) {
        switch (yargs.mode) {
        case 'debug':
            compileClientInDebugMode();
            break;
        case 'develop':
            compileClientInDevelopMode();
            break;
        case 'release':
            compileClientInReleaseMode();
            break;
        default:
            console.log('Please specify a mode for \'compile\': debug, develop or release');
        }
    } else {
        if (!yargs.port) {
            reportErrorForArgument('port');
        }

        if (yargs.start) {
            start(yargs.port);
        } else if (yargs.develop) {
            develop(yargs.port);
        } else if (yargs.serve) {
            startWebServer(yargs.port);
        }
    }
};

// Start 'main'
main();

// Export web-server for external use
module.exports = startWebServer;
