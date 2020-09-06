/* global require module */

const fs = require('fs');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const { findChildRoute, fillTemplateWithData } = require('./common');

let appConfig;

const ERRORS = {
    INVALID_ROUTE: 'Invalid route'
};

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

const init = config => {
    appConfig = config;
};

module.exports.ERRORS = ERRORS;
module.exports.renderOnServer = renderOnServer;
module.exports.init = init;

