/* global module require __dirname */

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');

const { validate } = require('./config-validator');
const { init, handleRoute } = require('./router/server');
const config = require('./web/config');

const basePath = path.join(__dirname, './');

const readFile = (basePath, filePath) => {
    try {
        // Attempt reading file contents
        return fs.readFileSync(
            path.join(basePath, filePath),
            'utf8'
        );
    } catch (e) {
        // Return error string
        return config.genericErrorText;
    }
};

const serveRequest = ({ url }, res) => {
    if (config.redirects[url]) {
        // Use the known redirect
        res.redirect(config.redirects[url]);
    } else if (config.exceptionsForStaticDirectory.indexOf(url) > -1) {
        // Serve the file and end the response
        res.send(readFile(basePath, `public${url}`));
    } else {
        // Gather landing HTML page string components
        const landingPageTemplate = readFile(basePath, 'public/index.html');
        const bodyTemplate = Handlebars.compile(readFile(basePath, 'web/body.html'));
        const parentPageDomString = landingPageTemplate.replace(
            '<!--body-tag-placeholder-->',
            bodyTemplate()
        );

        // Handle route with server router
        handleRoute(url, parentPageDomString, res, basePath);
    }
};

module.exports = url => {
    // Validate configs
    if (!validate(config)) {
        return;
    }

    // Create web-app and perform init
    const app = express();
    init(config);

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

    // Host all Web API handlers
    config.webApis.forEach(
        ({ url, handler, verb }) => {
            app.methodToBeUsed = undefined;

            switch (verb) {
                case 'POST':
                    app.methodToBeUsed = app.post;
                    break;
                case 'PUT':
                    app.methodToBeUsed = app.put;
                    break;
                case 'PATCH':
                    app.methodToBeUsed = app.patch;
                    break;
                case 'DELETE':
                    app.methodToBeUsed = app.delete;
                    break;
                case 'HEAD':
                    app.methodToBeUsed = app.head;
                    break;
                case 'OPTIONS':
                    app.methodToBeUsed = app.options;
                    break;
                case 'CONNECT':
                    app.methodToBeUsed = app.connect;
                    break;
                case 'TRACE':
                    app.methodToBeUsed = app.trace;
                    break;
                default:
                    app.methodToBeUsed = app.get;
            }

            app.methodToBeUsed(
                url,
                (req, res) => {
                    const response = handler({
                        url: req.url,
                        req: req,
                        res: res
                    });

                    if (response) {
                        res.send(response);
                    }
                }
            );
        }
    );

    // Serve index page
    app.get('*', serveRequest);
};
