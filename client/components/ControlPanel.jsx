import React, { Component } from "react";

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

    handleChange(event) {
        console.log(event.target);
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert("A name was submitted: " + this.state.value);
        event.preventDefault();
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
                            <label htmlFor="trueLowestTime">
                                True Lowest Time
                            </label>
                            <input
                                type="radio"
                                id="true-lowest-time"
                                name="trueLowestTime"
                                value="trueLowestTime"
                                onChange={this.handleChange}
                                checked={value === "trueLowestTime"}
                            />
                        </div>
                        <div className="algo-container">
                            <label htmlFor="manual">Manual</label>
                            <input
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

export default ControlPanel;
