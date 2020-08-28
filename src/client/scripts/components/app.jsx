import React from 'react';
import {
    NavLink,
    Route
} from 'react-router-dom';

import Banner from './banner.jsx';
import Home from '../pages/home.jsx';
import About from '../pages/about.jsx';

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        return (
            <div>
                <Banner />
                <div className="navigation">
                    <NavLink to="/" exact className="navigation-button" activeClassName="active">
                        (
                        <span className="fas fa-home" />
                        ) Home
                    </NavLink>
                    <NavLink to="/about" className="navigation-button" activeClassName="active">
                        (
                        <span className="fas fa-info" />
                        ) About
                    </NavLink>
                    <div id="pwa-install" className="navigation-button" style={{ display: 'none' }}>
                        (
                        <span className="fas fa-plus" />
                        ) Install as app
                    </div>
                </div>
                <Route path="/" exact component={Home} />
                <Route path="/about" component={About} />
            </div>
        );
    }
}
