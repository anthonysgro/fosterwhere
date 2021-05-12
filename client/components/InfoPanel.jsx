import React, { Component } from "react";

// React Router Imports
import { useHistory } from "react-router-dom";

const InfoPanel = () => {
    const history = useHistory();
    const redirectToHomepage = () => {
        history.push("/");
    };

    const panelContainerStyles = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
    };

    const infoPanelStyles = {
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

    return (
        <section className="info-panel-container" style={panelContainerStyles}>
            <div className="info-panel" style={infoPanelStyles}>
                <h3 style={titleStyles}>Info</h3>
                <div id="btn-container">
                    <button
                        onClick={redirectToHomepage}
                        className="primary-btn"
                    >
                        Back to Homepage
                    </button>
                </div>
            </div>
        </section>
    );
};

export default InfoPanel;
