/* global require module window */

module.exports = {
    // Version of config file format, only for validation purpose
    configVersion: 1,
    // Name of the app, not displayed to users
    appName: 'that-web-app',
    // Name of the app that's actually visible to users
    friendlyName: 'That Web App',
    // Description used in HTML open-graph and manifest
    description: 'A framework to build text-driven websites',
    // Type of web-app, only used in HTML open-graph
    type: 'article',
    // Domain of the web-app, the final web-address
    domain: 'http://localhost:8000',
    // Name of the directory to hold static assets
    staticPath: 'assets',
    // Colors to use for the progressive web-app
    colors: {
        themeColor: '#000',
        backgroundColor: '#000'
    },
    // Selector for the element where routing will occur
    pageElementSelector: '[data-tf-router]',
    // Prefix for CSS classnames to be appended on body while navigating
    // `${prefix}-live` stays for the entire navigation period
    // `${prefix}-out` is used while the page is being removed
    // `${prefix}-forward` is used for navigation through links
    // `${prefix}-backward` is used for navigation using browser history
    // `${prefix}-down` is used for route changes lower (and/or) deeper in the routes tree
    // `${prefix}-up` is used for route changes upwards (and/or) shallower in the routes tree
    // `${prefix}-in` is used while the page is being brought back
    navigationClassNamesPrefix: 'live-pages-nav',
    // Animation delay for navigation in milliseconds
    navigationAnimationDelay: 250,
    // Class to be appended to the active anchor tag, if present
    activeLinkClassName: 'live-pages-active-link',
    // Routes for the web-app
    routes: {
        // This is the mandatory route every web-app should have (`/`)
        url: '/',
        // Name of the template to be used for this route
        page: 'home',
        // The data dependency for this route
        data: () => ({
            timeRightNow: new Date()
        }),
        // Subroutes for this route as nested routes
        subRoutes: [
            {
                // Represents `/about`
                url: 'about',
                page: 'about',
                // The data for this route comes from a hard-coded literal object
                data: {
                    who: 'me'
                }
            },
            {
                // Represents `/epoch`
                url: 'epoch',
                page: 'epoch',
                // The data for this route comes from a function that returns a promise
                data: () => new Promise(
                    resolve => {
                        setTimeout(
                            () => {
                                resolve({ epoch: new Date().getTime() });
                            },
                            3000
                        );
                    }
                )
            },
            {
                // Represents `/calc` (partial route)
                url: 'calc',
                // More nesting as you can have virtually unlimited nested routes
                subRoutes: [
                    {
                        // Represents `/calc/add/{x}/{y}`
                        url: 'add',
                        page: 'calc',
                        // The data for this route depends on the route parameters,
                        // sum of the last two: `/calc/add/2/3` gives `5`
                        data: (x, y, a, b) => ({
                            operation: '+',
                            operationName: y,
                            a,
                            b,
                            result: +a + +b
                        })
                    },
                    {
                        // Represents `/calc/multiply/{x}/{y}`
                        url: 'multiply',
                        page: 'calc',
                        // The data for this route depends on the route parameters,
                        // product of the last two: `/calc/multiply/2/3` gives `6`
                        data: (x, y, a, b) => ({
                            operation: '*',
                            operationName: y,
                            a,
                            b,
                            result: +a * +b
                        })
                    }
                ]
            }
        ]
    },
    // Handler for invalid routes in case the web-app lands on such a route
    invalidRouteAction: url => {
        window.alert(`Invalid route: ${url}`, { autoClose: 5000 });
    },
    // Error message to be used on the server for routes that don't exist in the web-app
    invalidRouteMessage: 'You navigated to a URL that doesn\'t exist!',
    // The error message that can be used for all other kinds of errors
    genericErrorText: 'There was an error while displaying this page!'
};
