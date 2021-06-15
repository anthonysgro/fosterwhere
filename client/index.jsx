import React from "react";
import ReactDom from "react-dom";

// import "semantic-ui-css/semantic.min.css";

// React Router Imports
import { HashRouter as Router } from "react-router-dom";

// Redux Imports
import { Provider } from "react-redux";
import store from "./store";

// Component Imports
import App from "./components/App.jsx";

ReactDom.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.querySelector("#app"),
);
