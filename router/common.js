/* global require module */

const path = require('path');
const nodeUrl = require('url');
const Promise = require('bluebird');
const axios = require('axios');

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

// Function to contruct query object for a URL
const parseActionAndQueryFromUrl = url => {
    // Capture the query string from the URL
    const [action, queryString] = url.split('?');

    return {
        action,
        query: queryString
            && queryString
                .split('&')
                .reduce(
                    (a, c) => {
                        const [key, value] = c.split('=');

                        a[key] = value;

                        return a;
                    },
                    {}
                )
    };
};

// Function to retrieve data from WebAPI handler
const getDataFromWebApiHandler = (template, route, url, appConfig, onDone) => {
    // Find the first matching handler in config
    const webApi = appConfig.webApis.filter(a => route.data.indexOf(a.url) > -1)[0];

    // Split action and query
    const { action, query } = parseActionAndQueryFromUrl(url);

    let result;
    if (typeof window === 'undefined') {
        // For server
        result = webApi.handler({
            body: { url, action, query }
        });
    } else {
        // For client
        result = axios.post(
            `${nodeUrl.resolve(appConfig.domain, route.data)}`,
            { url, action, query }
        );
    }

    // Check if the result is a promise
    if (result.then) {
        // Send response after the promise resolves
        result.then(
            ({ data }) => { onDone(template(data)); }
        );
    } else {
        // Return the template with generated result
        onDone(template(result));
    }
};

// Function to obtain data from a data function
const getDataFromFunction = (template, route, currentUrl, onDone) => {
    // Evaluate the data specification
    const data = route.data(...getUrlParams(currentUrl));

    // Check if the data function returned a promise
    if (data.then) {
        // Send response after the promise resolves
        data.then(
            d => { onDone(template(d)); }
        );
    } else {
        // Return the template with generated data
        onDone(template(data));
    }
};

// Function to fetch and fill data in for a template
const fillTemplateWithData = (template, route, currentUrl, appConfig) =>
    new Promise(
        resolve => {
            // For a route with no data specification
            if (!route.data) {
                resolve(template());
            }

            // For a route with data as a literal object
            if (typeof route.data === 'object') {
                resolve(template(route.data));
            }

            // For a route associated with a WebAPI request
            if (typeof route.data === 'string') {
                getDataFromWebApiHandler(template, route, currentUrl, appConfig, resolve);
                return;
            }

            // Get data by executing the data function
            getDataFromFunction(template, route, currentUrl, resolve);
        }
    );

module.exports.findChildRoute = findChildRoute;
module.exports.fillTemplateWithData = fillTemplateWithData;
