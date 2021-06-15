import React, { Component } from "react";

// React Router Imports
import { Route, Link, Switch } from "react-router-dom";

// Component Imports
import Homepage from "./Homepage.jsx";
import MapPage from "./Map/MapPage.jsx";
import ErrorScreen from "./Error.jsx";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <h1 className="title-font">FosterWhere</h1>
                <main className="listing-main">
                    <Switch>
                        <Route exact path="/" component={Homepage} />
                        <Route exact path="/map" component={MapPage} />
                        <Route exact path="/error" component={ErrorScreen} />
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
