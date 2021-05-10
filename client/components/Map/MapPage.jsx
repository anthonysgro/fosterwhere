import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";

// Component Imports
import Map from "./Map.jsx";
import ResultList from "../ResultList.jsx";

class MapPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { data, history } = this.props;

        if (!data) {
            history.push("/");
        }
    }

    render() {
        const { data } = this.props;

        // Quick render if there's no data, just to get through to the redirect
        if (!data) {
            return <div></div>;
        }

        return (
            <div>
                <h1>Map Page</h1>
                <Map />
                <ResultList />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
    };
}

export default connect(mapStateToProps)(MapPage);
