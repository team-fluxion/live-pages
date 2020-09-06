/* global require module */

const fs = require('fs');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const { ERRORS, findChildRoute, fillTemplateWithData } = require('./common');

let appConfig;

// Function to render a route page on server
const renderOnServer = (url, parentPageDomString) => {
    // Find matching route
    const firstMatchingRoute = findChildRoute('/', appConfig.routes, url);

    // Throw an error if no matching route is found
    if (!firstMatchingRoute) {
        throw ERRORS.INVALID_ROUTE;
    }

    // Hydrate parent page DOM from string
    const parentPage = cheerio.load(parentPageDomString);

    // Load route page template
    const pageTemplate = Handlebars.compile(
        fs.readFileSync(
            `./web/pages/${firstMatchingRoute.page}.handlebars`,
            'utf8'
        )
    );

    // Get a reference of router element, load template
    parentPage(appConfig.pageElementSelector)
        .html(
            cheerio.load(
                fillTemplateWithData(pageTemplate, firstMatchingRoute)
            ).html()
        );

    // Return the server rendered page string
    return parentPage.html();
};

// Function to handle route on server
const handleRoute = (path, parentPageDomString, res) => {
    try {
        // Construct HTML string
        res.send(
            renderOnServer(
                path,
                parentPageDomString
            )
        );
    } catch (ex) {
        if (ex === ERRORS.INVALID_ROUTE) {
            // Handle invalid route according to configuration
            if (!appConfig.invalidRouteMessage) {
                res.redirect('/');
            } else {
                res.send(appConfig.invalidRouteMessage);
            }
        } else {
            // Send a generic error message
            res.send(appConfig.genericErrorText);
        }
    }
};

const init = config => {
    appConfig = config;
};

module.exports.ERRORS = ERRORS;
module.exports.handleRoute = handleRoute;
module.exports.init = init;

