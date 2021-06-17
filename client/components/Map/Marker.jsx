import React, { Component } from "react";

import InfoWindow from "./InfoWindow.jsx";

const Marker = ({
    role,
    name,
    address,
    show,
    id,
    color,
    clickFn,
    hoverEnterFn,
    hoverLeaveFn,
}) => {
    const markerStyle = {
        border: `${
            role === "employee" ? "1px solid black" : "1px dotted black"
        }`,
        height: 2,
        width: 2,
        cursor: "pointer",
        zIndex: `${role === "employee" ? 11 : 10}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "black",
        background: `${color}`,
        padding: `${role === "employee" ? "9px 9px" : "7px 7px"}`,
        display: "inline-flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "100%",
        transform: "translate(-50%, -50%)",
    };

    return (
        <React.Fragment>
            <div
                style={markerStyle}
                onMouseEnter={() => hoverEnterFn(id)}
                onMouseLeave={hoverLeaveFn}
                onClick={clickFn}
            ></div>
            {show && (
                <InfoWindow name={name} role={role} address={address} id={id} />
            )}
        </React.Fragment>
    );
};

export default Marker;
