/* global document */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './pwa';

import '../styles/styles.less';

import App from './components/app.jsx';

global.jQuery = require('jquery');

const $ = global.jQuery,
    Bootstrap = require('bootstrap');

const configs = require('../../../configs.json'),
    isProductionMode = process.env.NODE_ENV === 'production',
    baseUrl = isProductionMode ? configs.origin : '/';

render(
    <BrowserRouter basename={baseUrl}>
        <App />
    </BrowserRouter>,
    document.getElementById('page')
);

if (module.hot) {
    module.hot.accept();
}
