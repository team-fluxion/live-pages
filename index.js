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

const serveRequest = ({ headers, url }, res) => {
    if (headers['x-forwarded-proto'] === 'http') {
        // Force redirection to https
        res.redirect(`https://${headers.host}${url}`);
    } else if (config.redirects[url]) {
        // Use the known redirect
        res.redirect(config.redirects[url]);
    } else if (url === '/sw.js') {
        // Serve the service worker script
        res.set('Content-Type', 'text/javascript');
        res.send(readFile(basePath, `public${url}`));
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
        ({ url, handler }) => {
            app.get(
                url,
                (req, res) => {
                    res.send(handler({
                        url: req.url,
                        query: req.query
                    }));
                }
            );
        }
    );

    // Serve index page
    app.get('*', serveRequest);
};
