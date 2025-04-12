/* global require module */

const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');

const { findChildRoute, fillTemplateWithData, registerPartialsFromDir } = require('./common');

let appConfig;

// Function to mark active link
const markActiveLinks = (page, currentUrl) => {
    page(`a[href='${currentUrl}']`).addClass(appConfig.activeLinkClassName);
};

// Function to set values to dynamic elements
const setValuesToDynamicElements = (pageDom, route, currentUrl) => {
    appConfig.dynamicElements.forEach(
        ({ domSelector, assignValue }) => {
            const element = pageDom(domSelector);

            if (element) {
                element.html(assignValue(route, currentUrl));
            }
        }
    );
};

// Function to render a route page on server
const renderOnServer = (route, currentUrl, parentPageDomString, res, basePath) => {
    // Hydrate parent page DOM from string
    const parentPage = cheerio.load(parentPageDomString);

    // Load route page template
    const pageTemplate = Handlebars.compile(
        fs.readFileSync(
            path.join(basePath, `./web/pages/${route.page}.handlebars`),
            'utf8'
        )
    );

    // Get template filled with data for route, for currentUrl
    fillTemplateWithData(pageTemplate, route, currentUrl, appConfig)
        .then(
            template => {
                // Get a reference of router element, load template
                parentPage(appConfig.pageElementSelector)
                    .html(
                        cheerio.load(template).html()
                    );

                // Mark active link and current path
                markActiveLinks(parentPage, currentUrl);
                parentPage('body').attr('data-path', currentUrl);

                // Set dynamic DOM node values
                setValuesToDynamicElements(parentPage, route, currentUrl);

                // Return the server rendered page string
                res.send(parentPage.html());
            }
        );
};

// Function to handle route on server
const handleRoute = (currentUrl, parentPageDomString, res, basePath) => {
    // Find matching route
    const firstMatchingRoute = findChildRoute('/', appConfig.routes, currentUrl);

    if (firstMatchingRoute && firstMatchingRoute.page) {
        // Render page for matched route
        renderOnServer(
            firstMatchingRoute,
            currentUrl,
            parentPageDomString,
            res,
            basePath
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

    // Load the partial templates
    registerPartialsFromDir();
};

module.exports.handleRoute = handleRoute;
module.exports.init = init;

