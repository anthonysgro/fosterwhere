import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import {
    trueLowestTime,
    trueHighestTime,
    lowTimeWEquality,
    pureEquality,
    timeEqualityExchange,
    random,
    manual,
    defaultGrouping,
    changeToTLT,
    changeToTHT,
    changeToManual,
    changeToLTWE,
    changeToRandom,
    changeToPureEquality,
    changeToTEE,
    changeToDefaultGrouping,
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
        const { data, fullGraph } = this.props;
        // this.props.changeToDefaultGrouping();
        // this.props.defaultGrouping(fullGraph, data);
        this.setState({
            value: "defaultGrouping",
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
            if (event.target.value === "defaultGrouping") {
                this.props.changeToDefaultGrouping();
            } else if (event.target.value === "trueLowestTime") {
                this.props.changeToTLT();
            } else if (event.target.value === "trueHighestTime") {
                this.props.changeToTHT();
            } else if (event.target.value === "lowTimeWithEquality") {
                this.props.changeToLTWE();
            } else if (event.target.value === "strictEquality") {
                this.props.changeToPureEquality();
            } else if (event.target.value === "timeEqualityExchange") {
                this.props.changeToTEE();
            } else if (event.target.value === "random") {
                this.props.changeToRandom();
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

        if (value === "defaultGrouping") {
            this.props.defaultGrouping(fullGraph, data);
        } else if (value === "trueLowestTime") {
            this.props.trueLowestTime(fullGraph, data);
        } else if (value === "trueHighestTime") {
            this.props.trueHighestTime(fullGraph, data);
        } else if (value === "lowTimeWithEquality") {
            this.props.lowTimeWEquality(fullGraph, data);
        } else if (value === "strictEquality") {
            this.props.pureEquality(fullGraph, data);
        } else if (value === "timeEqualityExchange") {
            this.props.timeEqualityExchange(fullGraph, data);
        } else if (value === "random") {
            this.props.random(fullGraph, data);
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
            margin: "6px 0px",
            textDecoration: "underline",
        };

        const smallStyles = {
            padding: "1px 6px 6px 6px",
        };

        const { value } = this.state;

        return (
            <React.Fragment>
                <div className="container-container">
                    <section
                        className="control-panel-container"
                        style={panelContainerStyles}
                    >
                        <div
                            className="control-panel"
                            style={controlPanelStyles}
                        >
                            <h3 style={titleStyles}>Algorithms</h3>
                            <form onSubmit={this.handleSubmit} id="algo-form">
                                <div className="algo-container">
                                    <label
                                        htmlFor="default-grouping"
                                        className="algo-label"
                                    >
                                        Default Grouping
                                    </label>
                                    <input
                                        type="radio"
                                        className="algo-input"
                                        id="default-grouping"
                                        name="defaultGrouping"
                                        value="defaultGrouping"
                                        onChange={this.handleChange}
                                        checked={value === "defaultGrouping"}
                                    />
                                </div>
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
                                {/* <div className="algo-container">
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
                                </div> */}
                                <div className="algo-container">
                                    <label
                                        htmlFor="strict-equality"
                                        className="algo-label"
                                    >
                                        Strict Equality
                                    </label>
                                    <input
                                        type="radio"
                                        className="algo-input"
                                        id="strict-equality"
                                        name="strictEquality"
                                        value="strictEquality"
                                        onChange={this.handleChange}
                                        checked={value === "strictEquality"}
                                    />
                                </div>
                                <div className="algo-container">
                                    <label
                                        htmlFor="low-time-w-equality"
                                        className="algo-label"
                                    >
                                        {`Min Time & Equality`}
                                    </label>
                                    <input
                                        type="radio"
                                        className="algo-input"
                                        id="low-time-w-equality"
                                        name="lowTimeWithEquality"
                                        value="lowTimeWithEquality"
                                        onChange={this.handleChange}
                                        checked={
                                            value === "lowTimeWithEquality"
                                        }
                                    />
                                </div>
                                <div className="algo-container">
                                    <label
                                        htmlFor="time-equality-exchange"
                                        className="algo-label"
                                    >
                                        {`Multi-Phase Swap`}
                                    </label>
                                    <input
                                        type="radio"
                                        className="algo-input"
                                        id="time-equality-exchange"
                                        name="timeEqualityExchange"
                                        value="timeEqualityExchange"
                                        onChange={this.handleChange}
                                        checked={
                                            value === "timeEqualityExchange"
                                        }
                                    />
                                </div>
                                <div className="algo-container">
                                    <label
                                        htmlFor="random"
                                        className="algo-label"
                                    >
                                        Random
                                    </label>
                                    <input
                                        type="radio"
                                        className="algo-input"
                                        id="random"
                                        name="random"
                                        value="random"
                                        onChange={this.handleChange}
                                        checked={value === "random"}
                                    />
                                </div>
                                <div className="algo-container">
                                    <label
                                        htmlFor="manual"
                                        className="algo-label"
                                    >
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
                                <button className="primary-btn algo-btn">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </section>
                    <section
                        className="control-panel-container"
                        style={panelContainerStyles}
                    >
                        <div
                            className="control-panel"
                            style={controlPanelStyles}
                        >
                            <h3 style={titleStyles}>Description</h3>
                            <small style={smallStyles}>
                                {value === "trueLowestTime"
                                    ? '"The Manager\'s Algorithm", this algo optimizes for minimizing total travel. Good if you are a manager paying for gas on a budget. Or you maybe you are just lazy?'
                                    : value === "trueHighestTime"
                                    ? '"The Sardonic Algorithm", this algo optimizes for maximizing total travel. This option is only for managers who either hate their jobs or need therapy. Employees will not be happy...'
                                    : value === "lowTimeWithEquality"
                                    ? '"The Egalitarian Algorithm", this algo optimizes for minimum commutes and workload variance. It might not be the most efficient, but your workers will be content.'
                                    : value === "random"
                                    ? '"The Chaos Algorithm", you could not be bothered to do some basic math. Or care about your employees. You are neither ruthless nor merciful, you just want to see the world burn.'
                                    : value === "manual"
                                    ? '"The YOU Algorithm", who needs fancy optimization anyway? You are calculated with all your decisions, and your needs go beyond what mere computers can do.'
                                    : value === "strictEquality"
                                    ? '"The Utopian Algorithm", this algo optimizes for the least commute variance. Your workers commute equally, but is this optimal? I got another hammer and sickle if you want!'
                                    : value === "timeEqualityExchange"
                                    ? '"The Pragmatist\'s Algorithm", this algo optimizes for travel and variance by asking employees to swap clients in multiple rounds with varying rules. Trades excess fairness for efficiency!'
                                    : value === "defaultGrouping"
                                    ? '"The Original Configuration", this is configuration you specified when you uploaded your file. You can change this by editing the "groups" column of your excel sheet.'
                                    : ""}
                            </small>
                        </div>
                    </section>
                </div>
            </React.Fragment>
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
        random: (fullGraph, data) => dispatch(random(fullGraph, data)),
        manual: (data) => dispatch(manual(data)),
        lowTimeWEquality: (fullGraph, data) =>
            dispatch(lowTimeWEquality(fullGraph, data)),
        pureEquality: (fullGraph, data) =>
            dispatch(pureEquality(fullGraph, data)),
        trueHighestTime: (fullGraph, data) =>
            dispatch(trueHighestTime(fullGraph, data)),
        timeEqualityExchange: (fullGraph, data) =>
            dispatch(timeEqualityExchange(fullGraph, data)),
        defaultGrouping: (fullGraph, data) =>
            dispatch(defaultGrouping(fullGraph, data)),
        changeToTLT: () => dispatch(changeToTLT()),
        changeToManual: () => dispatch(changeToManual()),
        changeToLTWE: () => dispatch(changeToLTWE()),
        changeToTHT: () => dispatch(changeToTHT()),
        changeToRandom: () => dispatch(changeToRandom()),
        changeToPureEquality: () => dispatch(changeToPureEquality()),
        changeToTEE: () => dispatch(changeToTEE()),
        changeToDefaultGrouping: () => dispatch(changeToDefaultGrouping()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
