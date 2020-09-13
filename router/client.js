/* global window document require */

const path = require('path');
const url = require('url');

const { findChildRoute, fillTemplateWithData } = require('./common');
const { addClassesToBody, removeClassesFromBody } = require('./dom');

let appConfig;

// Function to add incremental weights to routes
const addWeightsToRoutes = (tree, level = 0) => {
    for (let i = 0; i < tree.subRoutes.length; i += 1) {
        tree.subRoutes[i].weight = (10 ** level) + i;

        // Recurse for sub-routes
        if (tree.subRoutes[i].subRoutes) {
            addWeightsToRoutes(tree.subRoutes[i], level + 1);
        }
    }
};

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
        .replace(appConfig.activeLinkClassName, '')
        .trim();

    // Mark currently active link
    document.querySelector(`a[href='${currentUrl}']`).className += ` ${appConfig.activeLinkClassName}`;
};

// Function to mark navigation in progress
const markNavigationStart = (horizontalDirection, verticalDirection) => {
    // Mark navigation start
    addClassesToBody([
        `${appConfig.navigationClassNamesPrefix}-live`,
        `${appConfig.navigationClassNamesPrefix}-out`
    ]);

    window.setTimeout(
        () => {
            // Mark navigation direction
            addClassesToBody([
                `${appConfig.navigationClassNamesPrefix}-${horizontalDirection ? 'forward' : 'backward'}`,
                `${appConfig.navigationClassNamesPrefix}-${verticalDirection ? 'down' : 'up'}`
            ]);

            // Unmark navigation start
            window.setTimeout(
                () => {
                    removeClassesFromBody([
                        `${appConfig.navigationClassNamesPrefix}-out`
                    ]);
                },
                appConfig.navigationAnimationDelay
            );
        },
        20
    );
};

// Function to mark navigation end
const markNavigationEnd = (horizontalDirection, verticalDirection) => {
    // Flip navigation direction
    removeClassesFromBody([
        `${appConfig.navigationClassNamesPrefix}-${horizontalDirection ? 'forward' : 'backward'}`,
        `${appConfig.navigationClassNamesPrefix}-${verticalDirection ? 'down' : 'up'}`
    ]);
    addClassesToBody([
        `${appConfig.navigationClassNamesPrefix}-${!horizontalDirection ? 'forward' : 'backward'}`,
        `${appConfig.navigationClassNamesPrefix}-${!verticalDirection ? 'down' : 'up'}`
    ]);

    window.setTimeout(
        () => {
            // Prepare for navigation end
            addClassesToBody([
                `${appConfig.navigationClassNamesPrefix}-in`
            ]);

            // Unmark navigation direction
            removeClassesFromBody([
                `${appConfig.navigationClassNamesPrefix}-${!horizontalDirection ? 'forward' : 'backward'}`,
                `${appConfig.navigationClassNamesPrefix}-${!verticalDirection ? 'down' : 'up'}`
            ]);

            window.setTimeout(
                () => {
                    // End navigation
                    removeClassesFromBody([
                        `${appConfig.navigationClassNamesPrefix}-in`,
                        `${appConfig.navigationClassNamesPrefix}-live`
                    ]);
                },
                appConfig.navigationAnimationDelay
            );
        },
        20
    );
};

// Function to stop/cancel/unmark navigation
const unmarkNavigation = () => {
    removeClassesFromBody([
        `${appConfig.navigationClassNamesPrefix}-live`,
        `${appConfig.navigationClassNamesPrefix}-out`,
        `${appConfig.navigationClassNamesPrefix}-in`,
        `${appConfig.navigationClassNamesPrefix}-backward`,
        `${appConfig.navigationClassNamesPrefix}-forward`,
        `${appConfig.navigationClassNamesPrefix}-down`,
        `${appConfig.navigationClassNamesPrefix}-up`
    ]);
};

// Function to render a route page on client
const renderOnClient = (route, currentUrl, horizontalDirection, verticalDirection) => {
    // Load template for route
    const pageTemplate = require(`../web/pages/${route.page}.handlebars`);

    // Get template filled with data for route, for currentUrl
    fillTemplateWithData(pageTemplate, route, currentUrl)
        .then(
            template => {
                window.setTimeout(
                    () => {
                        // Attach page template in router
                        document.querySelector(appConfig.pageElementSelector)
                            .innerHTML = template;

                        // Mark active link and current path
                        markActiveLink(currentUrl);
                        document.body.setAttribute('data-path', currentUrl);

                        // Start marking navigation end
                        markNavigationEnd(horizontalDirection, verticalDirection);
                    },
                    appConfig.navigationAnimationDelay
                );
            }
        );
};

// Function to get vertical direction of route change
const getVerticalDirectionForNavigation = (previousRoute, currentRoute) => {
    if (!previousRoute || !currentRoute) {
        // Default to downward
        return true;
    } else {
        // Compare weights, positive meaning downward
        return (currentRoute.weight || 0) - (previousRoute.weight || 0) > 0;
    }
};

// Function to handle route changes on client
const handleRoute = ({ state }, horizontalDirection = false) => {
    // Retrieve path variables
    const { location: { pathname } } = document;
    const interceptedPath = pathname.slice(0, 1) !== '/' ? `/${pathname}` : pathname;

    // Find matching route, determine vertical direction
    const firstMatchingRoute = findChildRoute('/', appConfig.routes, interceptedPath);
    const previousRoute = findChildRoute('/', appConfig.routes, document.body.getAttribute('data-path'));
    const verticalDirection = getVerticalDirectionForNavigation(previousRoute, firstMatchingRoute);

    // Set navigation progress
    markNavigationStart(horizontalDirection, verticalDirection);

    window.setTimeout(
        () => {
            if (firstMatchingRoute && firstMatchingRoute.page) {
                // Render page for matched route
                renderOnClient(
                    firstMatchingRoute,
                    interceptedPath,
                    horizontalDirection,
                    verticalDirection
                );
            } else if (appConfig.invalidRouteAction) {
                // Invoke action for invalid route
                appConfig.invalidRouteAction(pathname);

                // Disable navigation progress as not required
                unmarkNavigation();
            } else {
                // Treat as root route
                navigate('/');
            }
        },
        appConfig.navigationAnimationDelay
    );
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
        handleRoute({ state }, true);
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

    // Add weights to routes
    addWeightsToRoutes(appConfig.routes);

    // Add event listeners
    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('popstate', handleRoute);
};

// Function to destroy the router
export const destroy = () => {
    // Remove event listeners
    document.removeEventListener('click', handleGlobalClick);
    window.removeEventListener('popstate', handleRoute);
};
