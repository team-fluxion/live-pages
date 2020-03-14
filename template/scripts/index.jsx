/* global document */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './pwa';

import '../styles/styles.less';

import Layout from './components/layout.jsx';

render(
    <Router>
        <Layout />
    </Router>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
}
