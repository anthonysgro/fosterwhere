import React, { Component } from "react";
import { Roller } from "react-awesome-spinners";

// Redux Imports
import { connect } from "react-redux";

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { message } = this.props;
        return (
            <div className="loading-screen">
                <Roller color="#ffffff" sizeUnit="px" />
                {message ? <p>{message}</p> : <p>loading...</p>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        message: state.loading.message,
    };
}

export default connect(mapStateToProps)(Loading);
