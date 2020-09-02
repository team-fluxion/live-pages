/* global require module */

const fs = require('fs');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const { findChildRoute } = require('./common');

let pageElementSelector;
let routes;
let options;

const ERRORS = {
    INVALID_ROUTE: 'Invalid route'
};

const renderOnServer = (url, parentPageDomString) => {
    // Find matching route
    const firstMatchingRoute = findChildRoute('/', routes, url);

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
    parentPage(pageElementSelector).html(cheerio.load(pageTemplate()).html());

    // Return the server rendered page string
    return parentPage.html();
};

const init = (appPageElementSelector, appRoutes, appOptions = {}) => {
    // Set variables
    pageElementSelector = appPageElementSelector;
    routes = appRoutes;
    options = appOptions;
};

module.exports.ERRORS = ERRORS;
module.exports.renderOnServer = renderOnServer;
module.exports.init = init;

