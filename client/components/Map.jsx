import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

// Redux Imports
import { connect } from "react-redux";

// Helper Fn
import centerLatLng from "../helper-functions/centerLatLng";

const AnyReactComponent = ({ text, role }) => (
    <div
        style={{
            color: "white",
            background: `${role === "client" ? "grey" : "blue"}`,
            padding: "10px 10px",
            display: "inline-flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "100%",
            transform: "translate(-50%, -50%)",
        }}
    >
        {text}
    </div>
);

class SimpleMap extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { data } = this.props;
        const latLngArr = data.map(({ latitude, longitude }) => {
            return { latitude, longitude };
        });

        const center = centerLatLng(latLngArr);

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: "100vh", width: "100%" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyAg3q9ru_1Y0cao5BzS-b5PfFVVa6fUppA",
                    }}
                    defaultCenter={center}
                    defaultZoom={11}
                >
                    {data.map((entry) => (
                        <AnyReactComponent
                            key={entry.id}
                            lat={entry.latitude}
                            lng={entry.longitude}
                            text={entry.name}
                            role={entry.type}
                        />
                    ))}
                </GoogleMapReact>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
    };
}

export default connect(mapStateToProps)(SimpleMap);
