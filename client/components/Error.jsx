import React, { Component } from "react";
import { connect } from "react-redux";

class ErrorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.redirectToHomepage = this.redirectToHomepage.bind(this);
    }

    redirectToHomepage = () => {
        this.props.history.push("/");
    };

    render() {
        const { errorMessage } = this.props;

        return (
            <div className="error-screen">
                <div className="error-msg">
                    {errorMessage ? (
                        <p>{errorMessage}</p>
                    ) : (
                        <p>
                            Unknown Error. Please check your excel file and try
                            again.
                        </p>
                    )}
                </div>
                <div id="btn-container">
                    <button
                        onClick={this.redirectToHomepage}
                        className="primary-btn"
                    >
                        Back to Homepage
                    </button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        errorMessage: state.error.message,
    };
}

export default connect(mapStateToProps)(ErrorScreen);
