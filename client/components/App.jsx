import React, { Component } from "react";

// React Router Imports
import { Route, Link, Switch } from "react-router-dom";

// Component Imports
import Homepage from "./Homepage.jsx";
import MapPage from "./Map/MapPage.jsx";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <React.Fragment>
                <main className="listing-main">
                    <Switch>
                        <Route exact path="/" component={Homepage} />
                        <Route exact path="/map" component={MapPage} />
                        {/* About us page and route to test load animation for fun */}
                        {/* <Route exact path="/about-us" component={AboutUs} />
                            <Route exact path="/loading" component={Loading} />
                            <Route component={NotFound} /> */}
                    </Switch>
                </main>
            </React.Fragment>
        );
    }
}

export default App;
