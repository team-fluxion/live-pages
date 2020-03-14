import React from 'react';
import { Link, Switch, Route } from "react-router-dom";
import Home from "./components/home";
import About from "./components/about";

export default class Layout extends React.Component {
    render() {
        return (
            <div>
                <h1>Example website</h1>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </div>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/about" exact component={About} />
                </Switch>
            </div>
        );
    }
};
