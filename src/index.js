/* global module require __dirname */

const appName = 'that-web-app';

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const router = require('./router/server');
const routes = require('./client/routes.json');
const configs = require('../web/configs');

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
    const basePath = path.join(__dirname, '../');
    router.init(
        '[data-tf-router]',
        routes
    );

    // Setup statics
    app.use(`/${configs.staticPath}`, express.static(path.join(basePath, 'public')));
    app.use(bodyParser.json());

    // Start the web server
    app.listen(
        url,
        () => {
            console.log(appName, 'started on', url);
        }
    );

    // Serve index page
    app.get(
        '*',
        ({ url }, res) => {
            // Mask all requests to assets, just in case they make their way here
            if (url.indexOf(`/${configs.staticPath}`) === 0) {
                return;
            }

             // Return the server rendered page string
            res.send(
                router.renderOnServer(
                    url,
                    readFile(basePath, 'public/index.html')
                )
            );
        }
    );
};
