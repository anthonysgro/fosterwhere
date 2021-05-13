import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import {
    trueLowestTime,
    trueHighestTime,
    manual,
    lowTimeWEquality,
    changeToTLT,
    changeToTHT,
    changeToManual,
    changeToLTWE,
} from "../store/action-creators";

class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = { value: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.redirectToHomepage = this.redirectToHomepage.bind(this);
    }

    componentDidMount() {
        this.setState({
            value: "trueLowestTime",
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.algorithm !== this.props.algorithm) {
            this.setState({
                value: this.props.algorithm,
            });
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value }, () => {
            if (event.target.value === "trueLowestTime") {
                this.props.changeToTLT();
            } else if (event.target.value === "trueHighestTime") {
                this.props.changeToTHT();
            } else if (event.target.value === "lowTimeWithEquality") {
                this.props.changeToLTWE();
            } else if (event.target.value === "manual") {
                this.props.changeToManual();
            }
        });
    }

    handleSubmit(event) {
        // alert("A name was submitted: " + this.state.value);
        event.preventDefault();
        const { data, fullGraph } = this.props;
        const { value } = this.state;
        if (value === "trueLowestTime") {
            this.props.trueLowestTime(fullGraph, data);
        } else if (value === "trueHighestTime") {
            this.props.trueHighestTime(fullGraph, data);
        } else if (value === "lowTimeWithEquality") {
            this.props.lowTimeWEquality(fullGraph, data);
        } else if (value === "manual") {
            this.props.manual(data);
        }
    }

    redirectToHomepage() {
        const { history } = this.props;
        history.push("/");
    }

    render() {
        const panelContainerStyles = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
        };

        const controlPanelStyles = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "200px",
            height: "auto",
            backgroundColor: "#FAF9F6",
            color: "#1e1e1e",
            borderRadius: "2px",
            padding: "4px",
        };

        const titleStyles = {
            margin: "5px 0px",
            textDecoration: "underline",
        };

        const { value } = this.state;

        return (
            <section
                className="control-panel-container"
                style={panelContainerStyles}
            >
                <div className="control-panel" style={controlPanelStyles}>
                    <h3 style={titleStyles}>Algorithms</h3>
                    <form onSubmit={this.handleSubmit} id="algo-form">
                        <div className="algo-container">
                            <label
                                htmlFor="true-lowest-time"
                                className="algo-label"
                            >
                                True Lowest Time
                            </label>
                            <input
                                type="radio"
                                className="algo-input"
                                id="true-lowest-time"
                                name="trueLowestTime"
                                value="trueLowestTime"
                                onChange={this.handleChange}
                                checked={value === "trueLowestTime"}
                            />
                        </div>
                        <div className="algo-container">
                            <label
                                htmlFor="true-highest-time"
                                className="algo-label"
                            >
                                True Highest Time
                            </label>
                            <input
                                type="radio"
                                className="algo-input"
                                id="true-highest-time"
                                name="trueHighestTime"
                                value="trueHighestTime"
                                onChange={this.handleChange}
                                checked={value === "trueHighestTime"}
                            />
                        </div>
                        <div className="algo-container">
                            <label
                                htmlFor="low-time-w-equality"
                                className="algo-label"
                            >
                                Low Time w/ Equality
                            </label>
                            <input
                                type="radio"
                                className="algo-input"
                                id="low-time-w-equality"
                                name="lowTimeWithEquality"
                                value="lowTimeWithEquality"
                                onChange={this.handleChange}
                                checked={value === "lowTimeWithEquality"}
                            />
                        </div>
                        <div className="algo-container">
                            <label htmlFor="manual" className="algo-label">
                                Manual
                            </label>
                            <input
                                className="algo-input"
                                type="radio"
                                id="manual"
                                name="manual"
                                value="manual"
                                onChange={this.handleChange}
                                checked={value === "manual"}
                            />
                        </div>
                        <button className="primary-btn algo-btn">Submit</button>
                    </form>
                </div>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        fullGraph: state.graphs.fullGraph.structure,
        algorithm: state.algorithms,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        trueLowestTime: (fullGraph, data) =>
            dispatch(trueLowestTime(fullGraph, data)),
        manual: (data) => dispatch(manual(data)),
        lowTimeWEquality: (fullGraph, data) =>
            dispatch(lowTimeWEquality(fullGraph, data)),
        trueHighestTime: (fullGraph, data) =>
            dispatch(trueHighestTime(fullGraph, data)),
        changeToTLT: () => dispatch(changeToTLT()),
        changeToManual: () => dispatch(changeToManual()),
        changeToLTWE: () => dispatch(changeToLTWE()),
        changeToTHT: () => dispatch(changeToTHT()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
