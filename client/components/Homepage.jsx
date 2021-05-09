import React, { Component } from "react";

// Component Imports
import ExcelDropzone from "./ExcelDropzone.jsx";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <main>
                <h1>Foster Where</h1>
                <ExcelDropzone />
            </main>
        );
    }
}

export default Homepage;
