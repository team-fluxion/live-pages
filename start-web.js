/* global module require __dirname */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');

const { validate } = require('./config-validator');
const { init, handleRoute } = require('./router/server');
const config = require('./web/config');
const { fillTemplateWithData } = require('./router/common');

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

const showOffline = (_, res) => {
    res.set('Content-Type', 'text/html');
    res.send(readFile(basePath, './web/offline.html'));
};

const serveRequest = ({ headers, url }, res) => {
    if (config.redirects[url]) {
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

        // Fill body template with data
        fillTemplateWithData(bodyTemplate, { data: config.dataForBody }, '/', config)
            .then(
                template => {
                    // Replace placeholder with HTML DOM
                    const parentPageDomString = landingPageTemplate.replace(
                        '<!--body-tag-placeholder-->',
                        template
                    );

                    // Handle route with server router
                    handleRoute(url, parentPageDomString, res, basePath);
                }
            );
    }
};

module.exports = portNumber => {
    // Validate configs
    if (!validate(config)) {
        return;
    }

    // Create link to data directory if needed
    if (config.sourceForNestedDataDirectory
        && !fs.existsSync(path.join(basePath, 'public/data'))) {
        exec(`ln -s ${config.sourceForNestedDataDirectory} ${path.join(basePath, 'public/data')}`,
             (err, stdout, stderr) => {
                 if (err) {
                     return -1;
                 }

                 return 0;
             });
    }

    // Create web-app and perform init
    const app = express();
    init(config);

    // Setup statics
    app.use(`/${config.staticPath}`, express.static(path.join(basePath, 'public')));
    app.use(bodyParser.json());

    // Start the web server
    app.listen(
        portNumber,
        () => {
            console.log(config.appName, 'started on', portNumber);
        }
    );

    // Host all Web API handlers
    config.webApis.forEach(
        ({ url, handler }) => {
            app.post(
                url,
                (req, res) => {
                    res.send(handler(req));
                }
            );
        }
    );

    // Serve index page
    app.get('*', config.isOffline ? showOffline : serveRequest);

};
