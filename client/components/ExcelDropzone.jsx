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
import {
    graphMaker,
    findSubGraphs,
    graphToJson,
    originalGroupingGenerator,
    lowestTimeNonBalanced,
} from "../helper-functions";
import {
    fakeData1,
    fakeData2,
    fakeData1Unassigned,
    fakeData2Unassigned,
} from "../FAKE_DATA";

// Redux Imports
import {
    dropFile,
    stopLoading,
    startLoading,
    triggerError,
    createTransitGraph,
    createEmployeeMap,
    optimizeEmployeeMap,
    changeUnassigned,
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

    // Adds event listener for documentation accordions
    useEffect(() => {
        const acc = document.getElementsByClassName("accordion");

        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("active");
                let panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
    });

    const testData = (fakeDataset) => {
        const { jsonGeocodedData, transitMap } = fakeDataset;

        // window.localStorage.setItem(
        //     "jsonGeocodedData",
        //     JSON.stringify(jsonGeocodedData),
        // );

        // window.localStorage.setItem("transitMap", JSON.stringify(transitMap));

        // Dispatch our geocoded data to redux store
        dispatch(dropFile(jsonGeocodedData));

        // Create graphs and json conversions
        const fullGraph = graphMaker(transitMap);
        const fullJsonNoUnassigned = graphToJson(fullGraph, jsonGeocodedData);

        // Run the lowestTimeNonBalanced Algo to find closest worker
        const result = lowestTimeNonBalanced(fullGraph);

        // Parse out the subgraphs in json
        let employees = [];
        for (const sub of result.subGraphs) {
            employees.push(...graphToJson(sub, jsonGeocodedData));
        }

        let unassignedPOV = [];
        for (const entry of jsonGeocodedData) {
            if (entry.type === "employee") continue;
            for (const employee of employees) {
                for (const thisClient of employee.clients) {
                    if (thisClient.id === entry.id) {
                        unassignedPOV.push({
                            ...entry,
                            closestWorker: employee,
                            thisCommute: thisClient.thisCommute,
                        });

                        break;
                    }
                }
            }
        }

        const fullJson = [
            ...fullJsonNoUnassigned,
            {
                id: jsonGeocodedData.length + 1,
                address: null,
                clients: unassignedPOV,
                group: null,
                method: null,
                type: "employee",
            },
        ];

        // Creates subGraphs with json conversions
        const { subGraphs } = originalGroupingGenerator(
            fullGraph,
            jsonGeocodedData,
        );

        let subJson = [];
        for (const graph of subGraphs) {
            subJson.push(graphToJson(graph, jsonGeocodedData));
        }

        // Handle unassigned clients by creating an "employee" for them
        const unassigned = {
            id: jsonGeocodedData.length + 1,
            name: "Unassigned",
            group: null,
            type: "employee",
            clients: [],
        };

        let isThereUnassigned = false;
        for (const entry of unassignedPOV) {
            if (entry.group === null) {
                isThereUnassigned = true;
                unassigned.clients.push(entry);
            }
        }

        // if someone has no group, we will open unassigned group by default
        dispatch(changeUnassigned(isThereUnassigned));

        subJson.push([unassigned]);

        // Dispatch our graphs to redux store and stop loading, then redirect to map page
        dispatch(createTransitGraph(fullGraph, fullJson, subGraphs, subJson));

        // Stop loading and send to map screen!
        dispatch(stopLoading());
        history.push("/map");
    };

    const onDrop = useCallback(async ([file]) => {
        try {
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = async (evt) => {
                try {
                    // Show the loading component on screen
                    dispatch(startLoading());

                    // Convert the worksheet into something we can work with in javascript
                    const bstr = evt.target.result;
                    const wb = XLSX.read(bstr, { type: "binary" });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const wsNoCommas = convertCommas(ws);

                    // Get the data from the sheet
                    const data = XLSX.utils.sheet_to_csv(wsNoCommas, {
                        header: 1,
                    });

                    const jsonData = convertToJson(data);

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
                    const { data: transitMap } = await axios.post(
                        "/api/transit",
                        {
                            data: jsonGeocodedData,
                        },
                    );

                    // uncomment to save the data in browser
                    // window.localStorage.setItem(
                    //     "jsonGeocodedData",
                    //     JSON.stringify(jsonGeocodedData),
                    // );

                    // window.localStorage.setItem(
                    //     "transitMap",
                    //     JSON.stringify(transitMap),
                    // );

                    // Create graphs and json conversions
                    const fullGraph = graphMaker(transitMap);
                    const fullJsonNoUnassigned = graphToJson(
                        fullGraph,
                        jsonGeocodedData,
                    );

                    // Run the lowestTimeNonBalanced Algo to find closest worker
                    const result = lowestTimeNonBalanced(fullGraph);

                    // Parse out the subgraphs in json
                    let employees = [];
                    for (const sub of result.subGraphs) {
                        employees.push(...graphToJson(sub, jsonGeocodedData));
                    }

                    let unassignedPOV = [];
                    for (const entry of jsonGeocodedData) {
                        if (entry.type === "employee") continue;
                        for (const employee of employees) {
                            for (const thisClient of employee.clients) {
                                if (thisClient.id === entry.id) {
                                    unassignedPOV.push({
                                        ...entry,
                                        closestWorker: employee,
                                        thisCommute: thisClient.thisCommute,
                                    });

                                    break;
                                }
                            }
                        }
                    }

                    const fullJson = [
                        ...fullJsonNoUnassigned,
                        {
                            id: jsonGeocodedData.length + 1,
                            address: null,
                            clients: unassignedPOV,
                            group: null,
                            method: null,
                            type: "employee",
                        },
                    ];

                    // Creates subGraphs with json conversions
                    const { subGraphs } = originalGroupingGenerator(
                        fullGraph,
                        jsonGeocodedData,
                    );

                    let subJson = [];
                    for (const graph of subGraphs) {
                        subJson.push(graphToJson(graph, jsonGeocodedData));
                    }

                    // Handle unassigned clients by creating an "employee" for them
                    const unassigned = {
                        id: jsonGeocodedData.length + 1,
                        name: "Unassigned",
                        group: null,
                        type: "employee",
                        clients: [],
                    };

                    let isThereUnassigned = false;
                    for (const entry of unassignedPOV) {
                        if (entry.group === null || entry.group === "null") {
                            isThereUnassigned = true;
                            unassigned.clients.push(entry);
                        }
                    }

                    // if someone has no group, we will open unassigned group by default
                    dispatch(changeUnassigned(isThereUnassigned));

                    subJson.push([unassigned]);

                    // Dispatch our graphs to redux store and stop loading, then redirect to map page
                    dispatch(
                        createTransitGraph(
                            fullGraph,
                            fullJson,
                            subGraphs,
                            subJson,
                        ),
                    );

                    // Stop loading and send to map screen!
                    dispatch(stopLoading());
                    history.push("/map");
                } catch (err) {
                    console.error(err);
                    dispatch(triggerError(err));
                    history.push("/error");
                    dispatch(stopLoading());
                }
            };

            reader.readAsBinaryString(file);
        } catch (err) {
            console.error(err);
            dispatch(triggerError(err));
            history.push("/error");
            dispatch(stopLoading());
        }
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
            {/* <div className="blockquote">
                <p>
                    {
                        '"Our social workers keep quitting because they have to commute so far to reach their clients! I wish there was a better way..."'
                    }
                </p>
                <p>{"- My Boss"}</p>
            </div> */}
            <br />
            <div id="home-container">
                <div className="homepage-text home-subcontainer">
                    <h2>The Problem</h2>
                    <p>
                        Given a set of employee nodes and client nodes on a
                        directed, weighted graph, find the optimal mapping of
                        employees to clients.
                    </p>
                    <h3>Constraints</h3>
                    <p>
                        The graph is weighted: a weight is a commute from one
                        employee to one client.
                    </p>
                    <p>
                        The graph is directed: we only count the commute from
                        the employee node to the client node. You cannot travel
                        from an employee, to a client, to another employee.
                    </p>
                    <p>
                        Edges only exist between employees and clients.
                        Employees must "return home" before going to another
                        client.
                    </p>
                </div>
                <div
                    id="excel-dropzone"
                    className="home-subcontainer extra-pad"
                >
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
                                    Try dragging an excel file, or click to
                                    select file
                                </p>
                                <em>
                                    (Only *.xls and *.xlsx files will be
                                    accepted)
                                </em>
                            </React.Fragment>
                        )}
                    </Container>
                </div>
            </div>
            <div id="second-section-homepage">
                <div className="btn-container">
                    <button
                        onClick={() => testData(fakeData1)}
                        className="primary-homepage-btn"
                    >
                        Try Small Dataset
                    </button>
                </div>
                <div className="btn-container">
                    <button
                        onClick={() => testData(fakeData2)}
                        className="primary-homepage-btn"
                    >
                        Try Medium Dataset
                    </button>
                </div>
                <div className="btn-container">
                    <button
                        onClick={() => testData(fakeData2Unassigned)}
                        className="primary-homepage-btn"
                    >
                        Try Medium Dataset w/ Unassigned
                    </button>
                </div>
                <div id="pics-container">
                    <div id="doc-container">
                        <h2>Excel Example</h2>
                        <div className="img-container">
                            <img
                                src="./images/excelFormat.png"
                                alt=""
                                id="excel-example"
                            />
                        </div>
                        <p>All files must fit this format!</p>
                        <br />
                        <h3>Documentation</h3>
                        <button className="accordion">
                            <h4>Name</h4>
                        </button>
                        <div className="panel">
                            <p>Specifies name of client or employee.</p>
                        </div>
                        <button className="accordion">
                            <h4>Address</h4>
                        </button>
                        <div className="panel">
                            <p>
                                Utilizes Google Geocoding and Mapping API. Any
                                address found on Google Maps should work here.
                                If you encounter any problems, try to use the
                                precise formatting outlined in the example
                                above.
                            </p>
                        </div>
                        <button className="accordion">
                            <h4>Type</h4>
                        </button>
                        <div className="panel">
                            <p className="p-with-ul">
                                <span>
                                    Current app now supports a maximum of 21
                                    employees.
                                </span>{" "}
                                Keep in mind that due to API restrictions, using
                                a high number of employees will result in higher
                                loading times. The two options (enter as
                                appeared here in lowercase):
                            </p>
                            <ul>
                                <li>employee</li>
                                <li>client</li>
                            </ul>
                        </div>
                        <button className="accordion">
                            <h4>Method</h4>
                        </button>
                        <div className="panel">
                            <p className="p-with-ul">
                                <span>Required for employees.</span> Enter
                                "null" for clients. This app supports the
                                following modes of travel (enter as appeared
                                here in lowercase):
                            </p>
                            <ul>
                                <li>driving</li>
                                <li>transit</li>
                                <li>bicycling</li>
                                <li>walking</li>
                            </ul>
                        </div>
                        <button className="accordion">
                            <h4>Group</h4>
                        </button>
                        <div className="panel">
                            <p>
                                Current app supports a maximum of 21 groups. The
                                group allows you to designate the original
                                configuration of employees to clients so that
                                you can compare the supported algorithms against
                                yours.{" "}
                                <span>
                                    You must limit one employee to each group.
                                </span>
                            </p>
                        </div>
                    </div>
                    <br />
                    <div id="graph-example-container">
                        <h2>Graph Example</h2>
                        <div className="img-container">
                            <img
                                src="./images/graphExample.png"
                                alt=""
                                id="graph-example"
                            />
                        </div>
                    </div>
                    <br />
                    <p className="developer">Developed by Anthony Sgro</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ExcelDropzone;
