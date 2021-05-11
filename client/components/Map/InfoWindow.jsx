import React, { Component } from "react";

const InfoWindow = (props) => {
    const { name, text, role, address, id } = props;

    const infoWindowStyle = {
        position: "relative",
        bottom: 150,
        left: "-45px",
        width: 220,
        backgroundColor: "white",
        boxShadow: "0 2px 7px 1px rgba(0, 0, 0, 0.3)",
        padding: 10,
        fontSize: 14,
        zIndex: 100,
    };

    const casedRole = role[0].toUpperCase() + role.substr(1).toLowerCase();

    return (
        <div style={infoWindowStyle}>
            <div style={{ fontSize: 16 }}>{name}</div>
            <div
                style={{
                    fontSize: 12,
                    color: `${role === "client" ? "grey" : "blue"}`,
                }}
            >
                {casedRole}
            </div>
            <div style={{ fontSize: 12 }}>{address}</div>
            <div style={{ fontSize: 12 }}>Id #{`${id}`}</div>
        </div>
    );
};

export default InfoWindow;
