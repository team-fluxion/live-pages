/* global module require __dirname */

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');

const { init, renderOnServer, ERRORS } = require('./router/server');
const config = require('./web/config');

const readFile = (basePath, filePath) => {
    try {
        // Attempt reading file contents
        return fs.readFileSync(
            path.join(basePath, filePath),
            'utf8'
        );
    } catch (e) {
        // Return error string
        return '<Data couldn\'t be read>';
    }
};

module.exports = url => {
    // Create web-app
    const app = express();
    const basePath = path.join(__dirname, './');
    init(
        config.pageElementSelector,
        config.routes
    );

    // Setup statics
    app.use(`/${config.staticPath}`, express.static(path.join(basePath, 'public')));
    app.use(bodyParser.json());

    // Start the web server
    app.listen(
        url,
        () => {
            console.log(config.appName, 'started on', url);
        }
    );

    // Serve index page
    app.get(
        '*',
        ({ url }, res) => {
            let path = url;

            // Mask all requests to assets, for example from progressive app launch
            if (url.indexOf(`/${config.staticPath}`) === 0) {
                path = '/';
            }

            // Gather landing HTML page string components
            const htmlPageString = readFile(basePath, 'public/index.html');
            const bodyTemplate = Handlebars.compile(readFile(basePath, 'web/body.html'));

            try {
                // Construct HTML string
                res.send(
                    renderOnServer(
                        path,
                        htmlPageString.replace('<!--body-tag-placeholder-->', bodyTemplate())
                    )
                );
            } catch (ex) {
                if (ex === ERRORS.INVALID_ROUTE) {
                    // Handle invalid route according to configuration
                    if (config.maskInvalidRoutes) {
                        res.redirect('/');
                    } else {
                        res.send(config.genericErrorText);
                    }
                } else {
                    // Send a generic error message
                    res.send(config.genericErrorText);
                }
            }
        }
    );
};
