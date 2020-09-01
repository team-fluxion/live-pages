/* global window document require module */

let pageElement;
let routes;
let options;

// Function to join two paths
const joinPaths = (path1, path2) => {
    // Start with `path1`
    let finalPath = path1;

    // Add separator if required
    if (path1.substr(path1.length - 1) !== '/') {
        finalPath += '/';
    }

    // Append `path2`
    if (path2.slice(0, 1) === '/') {
        finalPath += path2.slice(1);
    } else {
        finalPath += path2;
    }

    return finalPath;
};

// Function to push a navigation state to browser history
const pushToHistory = (pathname, state) => {
    window.history.pushState(
        state,
        '',
        joinPaths(window.location.origin, pathname)
    );
};

// Function to find a matching internal route
const findChildRoute = (parentUrl, tree, urlToFind) => {
    for (let i = 0; i < tree.subRoutes.length; i += 1) {
        // Check if the URL pattern matches
        if (urlToFind.indexOf(joinPaths(parentUrl, tree.subRoutes[i].url)) > -1) {
            // Check if there are subroutes
            if (tree.subRoutes[i].subRoutes) {
                // Return recursive matches
                return findChildRoute(
                    joinPaths(parentUrl, tree.subRoutes[i].url),
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

// Function to render a route page on client
const renderOnClient = route => {
    // Load template for route
    const pageTemplate = require(`./client/scripts/pages/${route.page}.handlebars`);

    // Attach page template in router
    pageElement.innerHTML = pageTemplate();
};

// Function to handle state changes
const reactToStateChange = ({ state }) => {
    // Retrieve path variables
    const { location: { pathname } } = document;
    const path = pathname.slice(0, 1) !== '/' ? `/${pathname}` : pathname;

    // TODO: Remove logging
    console.log('Intercepted', path, state);

    // Find top-most matching route
    const firstMatchingRoute = findChildRoute('/', routes, path);

    // TODO: Remove logging
    console.log(firstMatchingRoute);

    // Check for invalid routes and invoke action
    if (!firstMatchingRoute && options.unknownRouteAction) {
        options.unknownRouteAction(pathname);
    }

    // Render page for matched route
    if (firstMatchingRoute) {
        renderOnClient(firstMatchingRoute);
    }
};

// Function to check whether a URL is internal
const isInternalUrl = urlToMatch =>
    urlToMatch.indexOf('://') < 0
        && urlToMatch.indexOf('//');

// Function to navigate to a URL
const navigate = (pathname, state = {}) => {
    pushToHistory(pathname, state);
    reactToStateChange({ state });
};

// Global 'click' event handler
const handleGlobalClick = event => {
    const { target } = event;

    // Respond to events only from anchor tags
    if (target.tagName === 'A') {
        // Stop the default behavior of the event
        event.preventDefault();

        // Extract the `href` attribute
        const href = target.getAttribute('href');

        // Check whether URL is internal or external
        if (isInternalUrl(joinPaths('/', href))) {
            // Navigate internally for internal URLs
            navigate(href);
        } else {
            // Navigate to the external URL
            window.location.href = href;
        }
    }
};

// Function to initialize the router
const init = (appPageElement, appRoutes, appOptions = {}) => {
    // Set variables
    pageElement = appPageElement;
    routes = appRoutes;
    options = appOptions;

    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('popstate', reactToStateChange);

    // TODO: Uncomment if a re-render is needed on init
    // reactToStateChange();
};

// Function to destroy the router
const destroy = () => {
    document.removeEventListener('click', handleGlobalClick);
    window.removeEventListener('popstate', reactToStateChange);
};

module.exports.findChildRoute = findChildRoute;
module.exports.init = init;
module.exports.destroy = destroy;
