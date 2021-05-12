import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import axios from "axios";

// React Router Imports
import { useHistory } from "react-router-dom";

// Excel Imports
import * as XLSX from "xlsx";
import convertToJson from "../helper-functions/convertToJson";
import convertCommas from "../helper-functions/convertCommas";

// Helper Fn
import { graphMaker, findSubGraphs, graphToJson } from "../helper-functions";
import FAKE_DATA from "../FAKE_DATA";

// Redux Imports
import {
    dropFile,
    stopLoading,
    startLoading,
    createTransitGraph,
    createEmployeeMap,
    optimizeEmployeeMap,
} from "../store/action-creators";
import { useDispatch } from "react-redux";

const getColor = (props) => {
    if (props.isDragAccept) {
        return "#00e676";
    }
    if (props.isDragReject) {
        return "#ff1744";
    }
    if (props.isDragActive) {
        return "#2196f3";
    }
    return "#eeeeee";
};

const getBackgroundColor = (props) => {
    if (props.isDragAccept) {
        return "#d8f3dc";
    }
    if (props.isDragReject) {
        return "#ffb2b2";
    }
    if (props.isDragActive) {
        return "#c1c1c1";
    }

    return "#fafafa";
};

const getTextColor = (props) => {
    if (props.isDragReject) {
        return "white";
    }
    return "#bdbdbd";
};

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${(props) => getColor(props)};
    border-style: dashed;
    background-color: ${(props) => getBackgroundColor(props)};
    color: ${(props) => getTextColor(props)};
    box-shadow: 0px 7px 11px -8px #000000;
    outline: none;
    transition: border 0.24s ease-in-out, background-color 0.5s ease-in-out;
`;

function ExcelDropzone() {
    const dispatch = useDispatch();
    const history = useHistory();

    const testData = () => {
        const { jsonGeocodedData, transitMap } = FAKE_DATA;

        // Dispatch our geocoded data to redux store
        dispatch(dropFile(jsonGeocodedData));

        // Create graphs and json conversions
        const fullGraph = graphMaker(transitMap);
        const fullJson = graphToJson(fullGraph, jsonGeocodedData);

        // Creates subGraphs with json conversions
        const { subGraphs } = findSubGraphs(fullGraph);
        let subJson = [];
        for (const graph of subGraphs) {
            subJson.push(graphToJson(graph, jsonGeocodedData));
        }

        // Dispatch our graphs to redux store and stop loading, then redirect to map page
        dispatch(createTransitGraph(fullGraph, fullJson, subGraphs, subJson));

        // Stop loading and send to map screen!
        dispatch(stopLoading());
        history.push("/map");
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        // Should just be one file
        acceptedFiles.forEach(async (file) => {
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = async (evt) => {
                // Convert the worksheet into something we can work with in javascript
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const wsNoCommas = convertCommas(ws);

                // Get the data from the sheet
                const data = XLSX.utils.sheet_to_csv(wsNoCommas, { header: 1 });
                const jsonData = convertToJson(data);

                // Show the loading component on screen
                dispatch(startLoading());

                // Geocode the data so we get latitude and longitude
                const { data: jsonGeocodedData } = await axios.put(
                    "/api/geocode",
                    {
                        data: jsonData,
                    },
                );

                // Dispatch our geocoded data to redux store
                dispatch(dropFile(jsonGeocodedData));

                // Create a graph of the routes
                const { data: transitMap } = await axios.post("/api/transit", {
                    data: jsonGeocodedData,
                });

                // Create graphs and json conversions
                const fullGraph = graphMaker(transitMap);
                const fullJson = graphToJson(fullGraph, jsonGeocodedData);

                // Creates subGraphs with json conversions
                const { subGraphs } = findSubGraphs(fullGraph);
                let subJson = [];
                for (const graph of subGraphs) {
                    subJson.push(graphToJson(graph, jsonGeocodedData));
                }

                // Dispatch our graphs to redux store and stop loading, then redirect to map page
                dispatch(
                    createTransitGraph(fullGraph, fullJson, subGraphs, subJson),
                );

                // Stop loading and send to map screen!
                dispatch(stopLoading());
                history.push("/map");
            };

            reader.readAsBinaryString(file);
        });
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
    });

    return (
        <React.Fragment>
            <div id="excel-dropzone">
                <Container
                    {...getRootProps({
                        isDragActive,
                        isDragAccept,
                        isDragReject,
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragActive && isDragAccept ? (
                        <p>Drop the file here ...</p>
                    ) : isDragActive && isDragReject ? (
                        <p>This file is invalid</p>
                    ) : (
                        <React.Fragment>
                            <p>
                                Try dragging an excel file, or click to select
                                file
                            </p>
                            <em>
                                (Only *.xls and *.xlsx files will be accepted)
                            </em>
                        </React.Fragment>
                    )}
                </Container>
            </div>
            <div id="btn-container">
                <button onClick={testData} className="primary-btn">
                    Try With Test Data
                </button>
            </div>
        </React.Fragment>
    );
}

export default ExcelDropzone;
