/* global require module */

const path = require('path');
const Promise = require('bluebird');

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

// Function to get individual elements of a URL
const getUrlParams = url =>
    url.split('/').slice(1);

// Function to fetch and fill data in for a template
const fillTemplateWithData = (template, route, currentUrl) =>
    new Promise(
        (resolve, reject) => {
            // For a route with no data specification
            if (!route.data) {
                resolve(template());
            }

            // For a route with data as a literal object
            if (typeof route.data === 'object') {
                resolve(template(route.data));
            }

            // Evaluate the data specification
            const data = route.data(...getUrlParams(currentUrl));

            // Check if the data function returned a promise
            if (data.then) {
                // Send response after the promise resolves
                data.then(
                    d => { resolve(template(d)); }
                );
            } else {
                // Return the template with generated data
                resolve(template(data));
            }
        }
    );

module.exports.findChildRoute = findChildRoute;
module.exports.fillTemplateWithData = fillTemplateWithData;
