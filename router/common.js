/* global require module */

const path = require('path');

// Enum for error types
const ERRORS = {
    INVALID_ROUTE: 'Invalid route'
};

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

// Function to fetch and fill data in for a template
const fillTemplateWithData = (template, route) => {
    // Check if the route has data specification
    if (route.data) {
        return template(route.data());
    }

    // Return the static template
    return template();
};

module.exports.ERRORS = ERRORS;
module.exports.findChildRoute = findChildRoute;
module.exports.fillTemplateWithData = fillTemplateWithData;
