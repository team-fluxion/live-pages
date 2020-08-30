/* global window document */

let pageElement;
let routes;
const options = {};

// Function to join two paths
const joinPaths = (path1, path2) => {
    let finalPath = path1;

    if (path1.substr(path1.length - 1) !== '/') {
        finalPath += '/';
    }

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
        if (urlToFind.indexOf(joinPaths(parentUrl, tree.subRoutes[i].url)) > -1) {
            if (tree.subRoutes[i].subRoutes) {
                return findChildRoute(
                    joinPaths(parentUrl, tree.subRoutes[i].url),
                    tree.subRoutes[i],
                    urlToFind
                );
            } else {
                return tree.subRoutes[i];
            }
        }
    }

    return tree.url !== '/' || tree.url === urlToFind ? tree : null;
};

const renderPage = route => {
    const pageTemplate = require(`./client/scripts/pages/${route.page}.handlebars`);
    pageElement.innerHTML = pageTemplate();
};

// Function to handle state changes
const reactToStateChange = state => {
    const { location: { pathname } } = document;
    const path = pathname.slice(0, 1) !== '/' ? `/${pathname}` : pathname;

    // TODO: Remove logging
    console.log('Intercepted', path, state);

    const firstMatchingRoute = findChildRoute('/', routes, path);
    // TODO: Remove logging
    console.log(firstMatchingRoute);

    // Invoke action for invalid route
    if (!firstMatchingRoute && options.unknownRouteAction) {
        options.unknownRouteAction(pathname);
    }

    if (firstMatchingRoute) {
        renderPage(firstMatchingRoute);
    }
};

// Function to check whether a URL is internal
const isInternalUrl = urlToMatch =>
    urlToMatch.indexOf('://') < 0
        && urlToMatch.indexOf('//');

// Function to navigate to a URL
const navigate = (pathname, state = {}) => {
    pushToHistory(pathname, state);
    reactToStateChange(state);
};

// Global 'click' event handler
const onDocumentClick = event => {
    const { target } = event;

    if (target.tagName === 'A') {
        event.preventDefault();

        const href = target.getAttribute('href');

        if (isInternalUrl(joinPaths('/', href))) {
            navigate(href);
        } else {
            window.location.href = href;
        }
    }
};

// Event handler for 'popstate'
const onPopState = event => {
    reactToStateChange(event.state);
};

// Function to initialize the router
export const init = (appPageElement, appRoutes, appOptions = {}) => {
    // Set variables
    pageElement = appPageElement;
    routes = appRoutes;
    options.unknownRouteAction = appOptions.unknownRouteAction;

    document.addEventListener('click', onDocumentClick);
    window.addEventListener('popstate', onPopState);

    // TODO: Figure out if we need a re-render on init
    // reactToStateChange();
};

// Function to destroy the router
export const destroy = () => {
    document.removeEventListener('click', onDocumentClick);
    window.removeEventListener('popstate', onPopState);
};
