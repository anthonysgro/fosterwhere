import React, { Component } from "react";

import InfoWindow from "./InfoWindow.jsx";

const Marker = ({ role, name, address, show, id, color }) => {
    const markerStyle = {
        border: "2px solid black",
        height: 2,
        width: 2,
        filter: `${role === "employee" ? "saturate(100%)" : "opacity(150%)"}`,
        cursor: "pointer",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "black",
        background: `${color}`,
        padding: "5px 5px",
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
            {show && (
                <InfoWindow name={name} role={role} address={address} id={id} />
            )}
        </React.Fragment>
    );
};

export default Marker;
