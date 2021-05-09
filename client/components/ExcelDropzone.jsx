import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import convertToJson from "../helper-functions/convertToJson";
import * as XLSX from "xlsx";

function ExcelDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];

                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                /* Update state */
                console.log("Data>>>" + data); // shows that excel data is read
                console.log(convertToJson(data)); // shows data in json format
                // Do whatever you want with the file contents
            };
            reader.readAsBinaryString(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
            )}
        </div>
    );
}

export default ExcelDropzone;
