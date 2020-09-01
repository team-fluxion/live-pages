/* global window document require */

const path = require('path');
const url = require('url');

const { findChildRoute } = require('./common');

let pageElementSelector;
let routes;
let options;

// Function to push a navigation state to browser history
const pushToHistory = (pathname, state) => {
    window.history.pushState(
        state,
        '',
        url.resolve(window.location.origin, pathname)
    );
};

// Function to render a route page on client
const renderOnClient = route => {
    // Load template for route
    const pageTemplate = require(`../web/scripts/pages/${route.page}.handlebars`);

    // Attach page template in router
    document.querySelector(pageElementSelector).innerHTML = pageTemplate();
};

// Function to handle state changes
const reactToStateChange = ({ state }) => {
    // Retrieve path variables
    const { location: { pathname } } = document;
    const interceptedPath = pathname.slice(0, 1) !== '/' ? `/${pathname}` : pathname;

    // TODO: Remove logging
    console.log('Intercepted', interceptedPath, state);

    // Find top-most matching route
    const firstMatchingRoute = findChildRoute('/', routes, interceptedPath);

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
        if (isInternalUrl(path.join('/', href))) {
            // Navigate internally for internal URLs
            navigate(href);
        } else {
            // Navigate to the external URL
            window.location.href = href;
        }
    }
};

// Function to initialize the router
export const init = (appPageElementSelector, appRoutes, appOptions = {}) => {
    // Set variables
    pageElementSelector = appPageElementSelector;
    routes = appRoutes;
    options = appOptions;

    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('popstate', reactToStateChange);

    // TODO: Uncomment if a re-render is needed on init
    // reactToStateChange();
};

// Function to destroy the router
export const destroy = () => {
    document.removeEventListener('click', handleGlobalClick);
    window.removeEventListener('popstate', reactToStateChange);
};
