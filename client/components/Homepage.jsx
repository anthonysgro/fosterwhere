import React, { Component } from "react";

// Component Imports
import ExcelDropzone from "./ExcelDropzone.jsx";
import Loading from "./Loading.jsx";

// Redux Imports
import { connect } from "react-redux";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { data, loading } = this.props;
        return (
            <main>
                <h1>Foster Where</h1>
                {loading ? <Loading /> : <ExcelDropzone />}
            </main>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        loading: state.loading,
    };
}

export default connect(mapStateToProps)(Homepage);
