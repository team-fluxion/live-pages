/* global window document require */

const path = require('path');
const url = require('url');

const { findChildRoute, fillTemplateWithData } = require('./common');

let appConfig;

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
    const pageTemplate = require(`../web/pages/${route.page}.handlebars`);

    // Attach page template in router
    document.querySelector(appConfig.pageElementSelector)
        .innerHTML = fillTemplateWithData(pageTemplate, route);
};

// Function to handle state changes
const reactToStateChange = ({ state }) => {
    // Retrieve path variables
    const { location: { pathname } } = document;
    const interceptedPath = pathname.slice(0, 1) !== '/' ? `/${pathname}` : pathname;

    // TODO: Remove logging
    console.log('Intercepted', interceptedPath, state);

    // Find top-most matching route
    const firstMatchingRoute = findChildRoute('/', appConfig.routes, interceptedPath);

    // TODO: Remove logging
    console.log(firstMatchingRoute);

    if (firstMatchingRoute) {
        // Render page for matched route
        renderOnClient(firstMatchingRoute);
    } else if (appConfig.invalidRouteAction) {
        // Invoke action for invalid route
        appConfig.invalidRouteAction(pathname);
    } else {
        // Treat as root route
        navigate('/');
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
export const init = config => {
    appConfig = config;

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
