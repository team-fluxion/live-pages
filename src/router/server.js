/* global require module */

const fs = require('fs');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const path = require('path');

let pageElementSelector;
let routes;
let options;

// Function to find a matching internal route
const findChildRoute = (parentUrl, tree, urlToFind) => {
    for (let i = 0; i < tree.subRoutes.length; i += 1) {
        // Check if the URL pattern matches
        if (urlToFind.indexOf(path.join(parentUrl, tree.subRoutes[i].url)) > -1) {
            // Check if there are subroutes
            if (tree.subRoutes[i].subRoutes) {
                // Return recursive matches
                return findChildRoute(
                    path.join(parentUrl, tree.subRoutes[i].url),
                    tree.subRoutes[i],
                    urlToFind
                );
            } else {
                // Return sub tree
                return tree.subRoutes[i];
            }
        }
    }

    // Check for matches or root, otherwise report no matches
    return tree.url !== '/' || tree.url === urlToFind ? tree : null;
};

const renderOnServer = (url, parentPageDomString) => {
    // Find matching route
    const firstMatchingRoute = findChildRoute('/', routes, url);

    // Hydrate parent page DOM from string
    const parentPage = cheerio.load(parentPageDomString);

    // Load route page template
    const pageTemplate = Handlebars.compile(
        fs.readFileSync(
            `./src/client/scripts/pages/${firstMatchingRoute.page}.handlebars`,
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

module.exports.findChildRoute = findChildRoute;
module.exports.renderOnServer = renderOnServer;
module.exports.init = init;

