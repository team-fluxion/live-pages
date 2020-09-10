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

// Function to mark active link
const markActiveLink = currentUrl => {
    const previouslyActiveLink = document.querySelector(`.${appConfig.activeLinkClassName}`);

    // Unmark previously active link
    previouslyActiveLink.className = previouslyActiveLink.className
        .replace(appConfig.activeLinkClassName)
        .trim();

    // Mark currently active link
    document.querySelector(`a[href='${currentUrl}']`).className += ` ${appConfig.activeLinkClassName}`;
};

// Function to toggle visual loading state
const setLoading = isLoading => {
    let bodyClassName = document.body.className || '';

    bodyClassName = bodyClassName.replace(` ${appConfig.loadingClassName}`, '');

    if (isLoading) {
        document.body.className = `${bodyClassName} ${appConfig.loadingClassName}`;
    } else {
        document.body.className = bodyClassName;
    }
};

// Function to render a route page on client
const renderOnClient = (route, currentUrl) => {
    // Load template for route
    const pageTemplate = require(`../web/pages/${route.page}.handlebars`);

    // Get template filled with data for route, for currentUrl
    fillTemplateWithData(pageTemplate, route, currentUrl)
        .then(
            template => {
                // Attach page template in router
                document.querySelector(appConfig.pageElementSelector)
                    .innerHTML = template;

                // Mark active link
                markActiveLink(currentUrl);

                // Reset loading
                setLoading(false);
            }
        );
};

// Function to handle route changes on client
const handleRoute = ({ state }) => {
    // Set loading
    setLoading(true);

    // Retrieve path variables
    const { location: { pathname } } = document;
    const interceptedPath = pathname.slice(0, 1) !== '/' ? `/${pathname}` : pathname;

    // Find top-most matching route
    const firstMatchingRoute = findChildRoute('/', appConfig.routes, interceptedPath);

    if (firstMatchingRoute && firstMatchingRoute.page) {
        // Render page for matched route
        renderOnClient(firstMatchingRoute, interceptedPath);
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

// Function to check whether a route is duplicate
const isRouteDuplicate = pathname =>
    pathname === window.location.pathname;

// Function to navigate to a URL
const navigate = (pathname, state = {}) => {
    // Only act if route is not duplicate
    if (!isRouteDuplicate(pathname)) {
        pushToHistory(pathname, state);
        handleRoute({ state });
    }
};

// Global 'click' event handler
const handleGlobalClick = event => {
    const { currentTarget: { activeElement } } = event;

    // Respond to events only from anchor tags
    if (activeElement.tagName === 'A') {
        // Stop the default behavior of the event
        event.preventDefault();

        // Extract the `href` attribute
        const href = activeElement.getAttribute('href');

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
    window.addEventListener('popstate', handleRoute);

    // TODO: Uncomment if a re-render is needed on init
    // handleRoute();
};

// Function to destroy the router
export const destroy = () => {
    document.removeEventListener('click', handleGlobalClick);
    window.removeEventListener('popstate', handleRoute);
};
