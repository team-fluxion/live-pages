# live-pages

[![Code Climate](https://codeclimate.com/github/team-fluxion/live-pages.png)](https://codeclimate.com/github/team-fluxion/live-pages)
[![js-myterminal-style](https://img.shields.io/badge/code%20style-myterminal-blue.svg)](https://www.npmjs.com/package/eslint-config/myterminal)  
[![Dependency Status](https://david-dm.org/team-fluxion/live-pages.svg)](https://david-dm.org/team-fluxion/live-pages)
[![devDependency Status](https://david-dm.org/team-fluxion/live-pages/dev-status.svg)](https://david-dm.org/team-fluxion/live-pages#info=devDependencies)
[![peer Dependency Status](https://david-dm.org/team-fluxion/live-pages/peer-status.svg)](https://david-dm.org/team-fluxion/live-pages#info=peerDependencies)  
[![License](https://img.shields.io/github/license/team-fluxion/live-pages.svg)](https://opensource.org/licenses/MIT)

A tool/template to quickly build text-driven websites

## Background

Since websites have become web-apps, there's much more to them than just markup, styling, and some simple interaction logic. In a "typical" web-app: users expect minimal hops between pages, pretty visuals, offline operation when the situation demands, and much more. This adds a lot of extra work on the development side where the developer finds themselves working with code that is not even remotely related to the actual web-app being developed. Much of it is repetitive, mostly working with boilerplate code that still needs to be just a little different for every single web-app that gets deployed to production.

That is only a small part of the horror story developers find themselves learning a framework or library than to develop the web-app itself, that is only if they could decide on which one to use.

*live-pages* aims to solve that problem by abstracting as much part of that *trivial* and *boring* code of your web-app into a template so that you almost only have to worry about the actual stuff that the users eventually see.

## Features

* A sufficiently configured web-server using [Express](https://expressjs.com)
* A comprehensive [webpack](https://webpack.js.org) configuration that takes care of the heavy-lifting of building your web-app
* A simple-to-use router that's totally invisible works almost exactly the same on the server as it does on the client
* Automatic generation of service-worker scripts so that your implementation can also work offline as a progressive web-app
* Support for open-graph tags without needing to configure them manually
* A pre-configured linting setup using [ESLint](https://eslint.org)
* Single-file configuration for metadata, routes, and other preferences
* [Font Awesome](https://fontawesome.com) as the icon library for pretty icons
* [ample-alerts](https://npmjs.com/package/ample-alerts) as an alert library to replace boring native web-browser alerts, confirmations, and prompts
* [{less}](http://lesscss.org) support for CSS along with a bunch of ready-made mixins from [effortless-css](https://www.npmjs.com/package/effortless-css)
* Support for latest ES standards using Babel transpilation
* Full support for JavaScript promises using [bluebird](https://www.npmjs.com/package/bluebird) so that you don't have to depend on user's web-browser for support
* Support for [Handlebars](https://handlebarsjs.com) templates for pages and views
* Much more...

## Pre-requisites

If nothing else, you'll definitely need [Node.js](https://nodejs.org) installed on both, the development and the hosting machine. You may refer to the [official website] for steps on installing Node.js on your computer.

Apart from Node.js, you'll need a command terminal to be able to run the web-server and anything that allows you to edit text to configure *live-pages*.

## How to use

*live-pages* has at least two moving parts that you need to run in order to use it: client and server.

You almost won't have to worry about the server and can only focus on the rest, which is the client. Place your web-app code in [web](web) directory and *live-pages* will take care of the rest. The sample web-app contains plenty of comments to explain the **what**s and **how**s as much as possible.

Before anything is usable, you need to install the dependencies that *live-pages* depends on. In order to do that, simply run `npm install` in a terminal anywhere in the project directory.

During development, just running `npm run develop` in a terminal window should take care of everything from building your code into a website and starting a local web-server, to making sure that you can debug your web-app in your web-browser's developer tools. It will also keep rebuilding the website and restarting the server on every change that you make with a delay or only a second or two.

If you just want to deploy your web-app on a machine, simply running `npm run start` or `npm start` should take care of everything for you.

## To-Do

* Add support for [Sass](https://sass-lang.com)
