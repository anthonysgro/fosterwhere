import React, { Component, useState, useEffect } from "react";

// Stats
const { Stats } = require("fast-stats");

// React Router Imports
import { useHistory } from "react-router-dom";

// Redux Imports
import { useSelector } from "react-redux";

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
    margin: "6px 0px",
    textDecoration: "underline",
};

const pStyles = {
    margin: "4px 8px 8px 8px",
};

const InfoPanel = () => {
    const history = useHistory();
    const [mean, setMean] = useState(0);
    const [stdDev, setStdDev] = useState(0);

    const subGraphs = useSelector((state) => state.graphs.subGraphs.json);

    useEffect(() => {
        calculateMeanAndStdDev();
    });

    const redirectToHomepage = () => {
        history.push("/");
    };

    const calculateMeanAndStdDev = () => {
        let s = new Stats();

        for (const graph of subGraphs) {
            s.push(parseFloat(graph[0].totalCommute));
        }

        setMean(s.amean().toFixed(2));
        setStdDev(s.stddev().toFixed(2));
    };

    return (
        <section className="info-panel-container" style={panelContainerStyles}>
            <div className="info-panel" style={infoPanelStyles}>
                <h3 style={titleStyles}>Info</h3>
                <p className="info-panel-text">Mean: {mean}</p>
                <p className="info-panel-text">Std Dev: {stdDev}</p>
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
