/* global require module */

const fs = require('fs');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const { findChildRoute, fillTemplateWithData } = require('./common');

let appConfig;

// Function to render a route page on server
const renderOnServer = (route, currentUrl, parentPageDomString) => {
    // Hydrate parent page DOM from string
    const parentPage = cheerio.load(parentPageDomString);

    // Load route page template
    const pageTemplate = Handlebars.compile(
        fs.readFileSync(
            `./web/pages/${route.page}.handlebars`,
            'utf8'
        )
    );

    // Get a reference of router element, load template
    parentPage(appConfig.pageElementSelector)
        .html(
            cheerio.load(
                fillTemplateWithData(pageTemplate, route)
            ).html()
        );

    // Return the server rendered page string
    return parentPage.html();
};

// Function to handle route on server
const handleRoute = (currentUrl, parentPageDomString, res) => {
    // Find matching route
    const firstMatchingRoute = findChildRoute('/', appConfig.routes, currentUrl);

    if (firstMatchingRoute) {
        // Render page for matched route
        res.send(
            renderOnServer(
                firstMatchingRoute,
                currentUrl,
                parentPageDomString
            )
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

