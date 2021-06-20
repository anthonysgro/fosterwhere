import React, { Component, useState, useEffect } from "react";

// Stats
const { Stats } = require("fast-stats");

// React Router Imports
import { useHistory } from "react-router-dom";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { changeUnassigned } from "../store/action-creators";

// Helper Fns
import {
    dndObjectBuilder,
    lowestTimeNonBalanced,
    graphToJson,
} from "../helper-functions";

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
    minWidth: "200px",
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

const smallTitleStyles = {
    margin: "6px 0px",
};

const pStyles = {
    margin: "4px 8px 8px 8px",
};

const InfoPanel = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [mean, setMean] = useState(0);
    const [stdDev, setStdDev] = useState(0);
    const unassigned = useSelector((state) => state.options.unassigned);

    const data = useSelector((state) => state.data);
    const graphs = useSelector((state) => state.graphs);
    const fullGraph = graphs.fullGraph.structure;
    const fullGraphJson = graphs.fullGraph.json;
    const subGraphs = graphs.subGraphs.json;

    useEffect(() => {
        calculateMeanAndStdDev();
    });

    const redirectToHomepage = () => {
        history.push("/");
    };

    const calculateMeanAndStdDev = () => {
        let s = new Stats();

        for (const graph of subGraphs) {
            if (graph[0].name !== "Unassigned") {
                s.push(parseFloat(graph[0].totalCommute));
            }
        }

        setMean(s.amean().toFixed(2));
        setStdDev(s.stddev().toFixed(2));
    };

    return (
        <section className="info-panel-container" style={panelContainerStyles}>
            <div className="info-panel" style={infoPanelStyles}>
                <h3 style={titleStyles}>Manager Info</h3>
                <p className="info-panel-text">Mean: {mean}</p>
                <p className="info-panel-text">Std Dev: {stdDev}</p>
                <h3 style={titleStyles}>Options</h3>
                <div style={{ display: "flex", margin: "4px 8px 8px 8px" }}>
                    <label htmlFor="unassigned" id="unassigned-label">
                        View Unassigned: &nbsp;
                    </label>
                    <input
                        style={{ margin: "4px 0" }}
                        id="unassigned"
                        type="checkbox"
                        name="unassigned"
                        checked={unassigned}
                        onChange={() => dispatch(changeUnassigned())}
                    />
                </div>

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
