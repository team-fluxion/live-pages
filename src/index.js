/* global module require __dirname */

const appName = 'that-web-app';

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const router = require('./router-cjs');
const routes = require('./client/routes.json');
const configs = require('../web/configs.json');

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

    // Setup statics
    app.use(`/${configs.origin}`, express.static(path.join(basePath, 'public')));
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
            if (url.indexOf(`/${configs.origin}`) === 0) {
                return;
            }

            // Find matching route
            const firstMatchingRoute = router.findChildRoute('/', routes, url);

            // Read the parent page from file-system
            const parentPageDomString = readFile(basePath, 'public/index.html');

            // Hydrate parent page DOM from string
            const parentPage = cheerio.load(parentPageDomString);

            // Load route page template
            const pageTemplate = Handlebars.compile(
                readFile(basePath, `./src/client/scripts/pages/${firstMatchingRoute.page}.handlebars`)
            );

            // Get a reference of router element, load template
            parentPage('[data-tf-router]').html(cheerio.load(pageTemplate()).html());

            // Return the server rendered page string
            res.send(
                parentPage.html()
            );
        }
    );
};
