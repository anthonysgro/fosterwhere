import React from "react";
import ReactDom from "react-dom";

// Redux Imports
import { Provider } from "react-redux";
import store from "./store";

// Component Imports
import Homepage from "./components/Homepage.jsx";

ReactDom.render(
    <Provider store={store}>
        <Homepage />
    </Provider>,
    document.querySelector("#app"),
);
