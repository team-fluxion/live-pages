/* global require module */

const fs = require('fs');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const { findChildRoute, fillTemplateWithData } = require('./common');

let appConfig;

// Function to render a route page on server
const renderOnServer = (route, currentUrl, parentPageDomString, res) => {
    // Hydrate parent page DOM from string
    const parentPage = cheerio.load(parentPageDomString);

    // Load route page template
    const pageTemplate = Handlebars.compile(
        fs.readFileSync(
            `./web/pages/${route.page}.handlebars`,
            'utf8'
        )
    );

    // Get template filled with data for route, for currentUrl
    fillTemplateWithData(pageTemplate, route, currentUrl)
        .then(
            template => {
                // Get a reference of router element, load template
                parentPage(appConfig.pageElementSelector)
                    .html(
                        cheerio.load(template).html()
                    );

                // Return the server rendered page string
                res.send(parentPage.html());
            }
        );
};

// Function to handle route on server
const handleRoute = (currentUrl, parentPageDomString, res) => {
    // Find matching route
    const firstMatchingRoute = findChildRoute('/', appConfig.routes, currentUrl);

    if (firstMatchingRoute) {
        // Render page for matched route
        renderOnServer(
            firstMatchingRoute,
            currentUrl,
            parentPageDomString,
            res
        );
    } else if (appConfig.invalidRouteMessage) {
        // Render the configured message for invalid route
        res.send(appConfig.invalidRouteMessage);
    } else {
        // Redirect to root
        res.redirect('/');
    }
};

const init = config => {
    appConfig = config;
};

module.exports.handleRoute = handleRoute;
module.exports.init = init;

