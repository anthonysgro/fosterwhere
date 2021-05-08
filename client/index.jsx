import React from "react";
import ReactDom from "react-dom";

// Redux Imports
import { Provider } from "react-redux";
// import store from "./store";

ReactDom.render(
    // <Provider store={store}>
    "Hello World!",
    // </Provider>,
    document.querySelector("#app"),
);
