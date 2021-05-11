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
import { graphMaker, optimizeGraphToObject } from "../helper-functions";

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
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;
`;

function ExcelDropzone() {
    const dispatch = useDispatch();
    const history = useHistory();

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

                // Keep ahold of our initial employee transit map
                dispatch(createEmployeeMap(transitMap));

                // Create an initial graph out of the employee transit map
                const transitGraph = graphMaker(transitMap);

                // Dispatch our graph to redux store and stop loading, then redirect to map page
                dispatch(createTransitGraph(transitGraph));

                // Optimize the graph and convert to object
                const optimizedEmployeeMap = optimizeGraphToObject(
                    jsonGeocodedData,
                    transitGraph,
                );
                dispatch(optimizeEmployeeMap(optimizedEmployeeMap));

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
    });

    return (
        <div className="container">
            <Container
                {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>
                        Drag 'n' drop some files here, or click to select files
                    </p>
                )}
            </Container>
        </div>
    );
}

export default ExcelDropzone;
