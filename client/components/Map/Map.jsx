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

const GOOGLE_CLIENT_KEY = "AIzaSyAj0xOuDNjewo1RSTYVap126YZAZihv0CQ";

class SimpleMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
            hoveredOver: NaN,
        };
        this.onMapClick = this.onMapClick.bind(this);
        this.onMarkerEnter = this.onMarkerEnter.bind(this);
        this.onMarkerLeave = this.onMarkerLeave.bind(this);
    }

    componentDidMount() {
        const { data, graphs } = this.props;

        const subGraphs = cloneDeep(graphs.subGraphs.json);

        subGraphs.sort((a, b) => a[0].id - b[0].id);

        let flattenedMap = [];
        for (let i = 0; i < subGraphs.length; i++) {
            if (subGraphs[i][0].name !== "Unassigned") {
                flattenedMap.push({
                    ...subGraphs[i][0],
                    color: COLORS[i].employee,
                });
            }

            for (const client of subGraphs[i][0].clients) {
                if (subGraphs[i][0].name === "Unassigned") {
                    flattenedMap.push({ ...client, color: "#b5b3b4" });
                } else {
                    flattenedMap.push({ ...client, color: COLORS[i].client });
                }
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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.graphs !== this.props.graphs) {
            const { data, graphs } = this.props;

            const subGraphs = cloneDeep(graphs.subGraphs.json);

            subGraphs.sort((a, b) => a[0].id - b[0].id);

            let flattenedMap = [];
            for (let i = 0; i < subGraphs.length; i++) {
                if (subGraphs[i][0].name !== "Unassigned") {
                    flattenedMap.push({
                        ...subGraphs[i][0],
                        color: COLORS[i].employee,
                    });
                }

                for (const client of subGraphs[i][0].clients) {
                    if (subGraphs[i][0].name === "Unassigned") {
                        flattenedMap.push({ ...client, color: "#b5b3b4" });
                    } else {
                        flattenedMap.push({
                            ...client,
                            color: COLORS[i].client,
                        });
                    }
                }
            }

            const newData = flattenedMap.map((item) => {
                const newItem = { ...item };
                newItem.show = false;
                return newItem;
            });

            // let includedIds = [];
            // for (const { id } of newData) {
            //     includedIds.push(id);
            // }

            // let unassigned = [];
            // for (const entry of data) {
            //     if (
            //         !includedIds.includes(entry.id) &&
            //         entry.type === "client"
            //     ) {
            //         unassigned.push({
            //             ...entry,
            //             color: "#b5b3b4",
            //             show: false,
            //         });
            //     }
            // }

            // const totalData = [...newData];

            this.setState({
                data: newData,
                loading: false,
            });
        }
    }

    onMarkerEnter(id) {
        this.setState({ hoveredOver: id });
    }

    onMarkerLeave() {
        this.setState({ hoveredOver: NaN });
    }

    // Handles the text box for clicking on maps
    onMapClick() {
        const { data, hoveredOver } = this.state;

        const newData = data.map((entry) => {
            const newEntry = { ...entry };

            if (isNaN(hoveredOver)) {
                newEntry.show = false;
            } else {
                if (newEntry.id === parseInt(hoveredOver)) {
                    newEntry.show = true;
                } else {
                    newEntry.show = false;
                }
            }

            return newEntry;
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
            <div
                style={{
                    height: "450px",
                    width: "650px",
                    overflow: "hidden",
                    borderRadius: ".2rem",
                }}
                id="map-container"
            >
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: GOOGLE_CLIENT_KEY,
                    }}
                    center={center}
                    defaultZoom={11}
                    // onChildClick={this.onMarkerClick}
                    onClick={this.onMapClick}
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
                            clickFn={this.onMapClick}
                            hoverEnterFn={this.onMarkerEnter}
                            hoverLeaveFn={this.onMarkerLeave}
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
