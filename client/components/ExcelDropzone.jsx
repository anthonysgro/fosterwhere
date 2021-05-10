import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import axios from "axios";

// Excel Imports
import * as XLSX from "xlsx";
import convertToJson from "../helper-functions/convertToJson";
import convertCommas from "../helper-functions/convertCommas";

// Redux Imports
import { dropFile, stopLoading } from "../store/action-creators";
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

                // Geocode the data so we get latitude and longitude
                const { data: jsonGeocodedData } = axios.put("/api/geocode", {
                    data: jsonData,
                });

                dispatch(dropFile(jsonGeocodedData));
                dispatch(stopLoading());
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
