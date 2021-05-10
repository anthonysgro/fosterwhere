import React, { Component } from "react";

import InfoWindow from "./InfoWindow.jsx";

const Marker = ({ role, name, address, show }) => {
    const markerStyle = {
        border: "1px solid white",
        height: 2,
        width: 2,
        cursor: "pointer",
        zIndex: 10,
        color: "white",
        background: `${role === "client" ? "grey" : "blue"}`,
        padding: "7px 7px",
        display: "inline-flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "100%",
        transform: "translate(-50%, -50%)",
    };

    return (
        <React.Fragment>
            <div style={markerStyle}></div>;
            {show && <InfoWindow name={name} role={role} address={address} />}
        </React.Fragment>
    );
};

export default Marker;
