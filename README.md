# live-pages

[![Code Climate](https://codeclimate.com/github/team-fluxion/live-pages.png)](https://codeclimate.com/github/team-fluxion/live-pages)
[![js-myterminal-style](https://img.shields.io/badge/code%20style-myterminal-blue.svg)](https://www.npmjs.com/package/eslint-config-myterminal)
[![License](https://img.shields.io/github/license/team-fluxion/live-pages.svg)](https://opensource.org/licenses/MIT)

A web container for config-driven modern websites.

> **PS:** Tested on Node version 12.22.9 and older, and may not work with newer versions. If you face error with peer dependencies while running an `npm install`, try running `npm install --save --legacy-peer-deps` instead.

## Background

As expectations from pages running inside web browsers skyrocketed, users started to expect too much from them, including minimal hops between pages, super pretty visuals, offline availability, and much more. This forced a lot more extra burden on the developers where now they often find themselves working on code that doesn't even remotely relate to the website in question. Much of this is repetitive, mostly working with boilerplate code that still needs to be just a little different for every single web app deployed to production, more so needing an update with another shift in technology trends.

*live-pages* aims to solve a hundred problems while developing a modern web app by abstracting as much part of that trivial code into a wrapper so that you only have to worry about the actual stuff that the users eventually see.

## What does *live-pages* comes with?

### Primarily, there's...

* A well-configured web server using [Express](https://expressjs.com)
* A comprehensive [webpack](https://webpack.js.org) configuration that takes care of all the heavy lifting of building your web app
* A simple-to-use router that remains invisible, is symmetrical across the client and server, supports implicit loading indication and active link annotation along with transition animations and more
* Automatic generation of service-worker scripts so that your implementation can also work offline as a progressive web app with no extra code
* A single configuration file for your entire website
* Push notifications to the browser when a change to the data is detected
* [ample-alerts](https://npmjs.com/package/ample-alerts) as a themeable alert library to replace native web-browser alerts, confirmations, and prompts

### And there's also...

* Centralized control over open-graph tags
* Support for [Handlebars](https://handlebarsjs.com) templates for pages and views
* Polyfill for JavaScript promises using [bluebird](https://www.npmjs.com/package/bluebird) so that you don't have to depend on the user's web browser for support
* Support for latest ES standards using Babel transpilation
* [{less}](http://lesscss.org) support for CSS along with a bunch of ready-made mixins from [effortless-css](https://www.npmjs.com/package/effortless-css)
* [Font Awesome](https://fontawesome.com) as the icon library for pretty icons
* A pre-configured linting setup using [ESLint](https://eslint.org)

and much more...

> **Note:** *live-pages* doesn't provide you with any styling as a CSS framework does, and that means that you will need to take of the styling by yourself.

## Pre-requisites

At a minimum, you'll need [Node.js](https://nodejs.org) installed on both, the development and the hosting machine. You may refer to the [official website](https://nodejs.org) for steps on installing Node.js.

You'll need a text editor to configure your website with *live-pages* and a command terminal to be able to run the server(s).

## How to use

*live-pages* acts as a container for your website, provides you with both the client and the server, and ensures all the interaction between the two is seamless. You only have to focus on what's important: the client-side code comprising the pages and visuals. Your web app resides in a directory called **web**, while *live-pages* provides you with commands to work with it.

As it goes without saying, before anything is usable, you need to install the dependencies that *live-pages* depends on. In order to do that, simply run `npm install` in a terminal anywhere in the project directory. Place your web app code in the **web** directory at the root, optionally running an `npm install` for it too, if your website has NPM dependencies of its own. Once all this is done, *live-pages* will take care of the rest.

One quick way to get started is to run `npm run init` and the [example](example) directory will be cloned as **web** directory so that you can use the example and build from there right away. The sample web app contains plenty of comments to explain the **what**s and **how**s as much as possible.

During development, just running `npm run develop` in a terminal window should take care of everything from building your code into a website and starting a local web (and socket) server, to making sure that you can debug your web app in your web browser's developer tools. It will also keep rebuilding the website and restarting the server on every change that you make with minimal delay.

If you just want to deploy your web app on a machine, simply running `npm run start` or `npm start` should take care of everything for you.


## *live-pages* in action

- [myTerminal's personal website](https://myterminal.me)
- [Masjid Rahmah's official website](https://masjidrahmah.us)

## To-Do

* Implement pattern matching for routes
* Externalize router into a reusable component
