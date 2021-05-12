import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

// Redux Imports
import { connect } from "react-redux";

// Helper Fn
import centerLatLng from "../../helper-functions/centerLatLng";
import { cloneDeep } from "lodash";

// Colors
import COLORS from "./colors";

// Component Imports
import Marker from "./Marker.jsx";
import Loading from "../Loading.jsx";

class SimpleMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.closeText = this.closeText.bind(this);
    }

    componentDidMount() {
        const { data, graphs } = this.props;

        const subGraphs = cloneDeep(graphs.subGraphs.json);

        let flattenedMap = [];
        for (let i = 0; i < subGraphs.length; i++) {
            flattenedMap.push({
                ...subGraphs[i][0],
                color: COLORS[i].employee,
            });

            for (const client of subGraphs[i][0].clients) {
                flattenedMap.push({ ...client, color: COLORS[i].client });
            }
        }

        const newData = flattenedMap.map((item) => {
            const newItem = { ...item };
            newItem.show = false;
            return newItem;
        });

        this.setState({
            data: newData,
            loading: false,
        });
    }

    // Handles the text box for clicking on maps
    onMarkerClick(key) {
        const { data } = this.state;
        const newData = data.map((entry) => {
            const newEntry = { ...entry };
            if (newEntry.id === parseInt(key)) {
                newEntry.show = true;
            } else {
                newEntry.show = false;
            }

            return newEntry;
        });

        this.setState({
            ...this.state,
            data: newData,
        });
    }

    closeText() {
        const { data } = this.state;
        const newData = data.map((item) => {
            const newItem = { ...item };
            newItem.show = false;
            return newItem;
        });

        this.setState({
            ...this.state,
            data: newData,
        });
    }

    render() {
        const { data, loading } = this.state;

        if (loading) {
            return <Loading />;
        }

        // Create arrays of all the latitude and longitude values
        const latLngArr = data.map(({ latitude, longitude }) => {
            return { latitude, longitude };
        });

        // Finds center of all latitude and longitude
        const center = centerLatLng(latLngArr);

        return (
            <div style={{ height: "50vh", width: "75%" }} id="map-container">
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyAQbRDbgyBDdsnUi0-jBf8ij2KW_mqlHs8",
                    }}
                    defaultCenter={center}
                    defaultZoom={11}
                    onChildClick={this.onMarkerClick}
                    onClick={this.closeText}
                >
                    {data.map((entry) => (
                        <Marker
                            key={entry.id}
                            lat={entry.latitude}
                            lng={entry.longitude}
                            name={entry.name}
                            role={entry.type}
                            address={entry.address}
                            show={entry.show}
                            id={entry.id}
                            color={entry.color}
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
        graphs: state.graphs,
    };
}

export default connect(mapStateToProps)(SimpleMap);
