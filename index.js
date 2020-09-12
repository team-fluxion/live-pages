/* global module require __dirname */

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');

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
    // Gather landing HTML page string components
    const landingPageTemplate = readFile(basePath, 'public/index.html');
    const bodyTemplate = Handlebars.compile(readFile(basePath, 'web/body.html'));
    const parentPageDomString = landingPageTemplate.replace(
        '<!--body-tag-placeholder-->',
        bodyTemplate()
    );

    // Handle route with server router
    handleRoute(url, parentPageDomString, res);
};

module.exports = url => {
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

    // Serve index page
    app.get('*', serveRequest);
};
