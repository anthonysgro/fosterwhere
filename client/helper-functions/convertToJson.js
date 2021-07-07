import { badSyntax } from "../errors";
import _ from "lodash";

const convertToJson = (csv) => {
    const lines = csv.split("\n");
    let result = [];
    const groups = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        let obj = {};

        const currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j].toLowerCase();
            if (currentline[j]) {
                // Handles group insertion to accomodate any input for group (not just integers)
                if (header === "group") {
                    // If there is an unassigned...
                    if (currentline[j] === "unassigned") {
                        obj[header] = null;
                    } else {
                        if (!groups.includes(currentline[j])) {
                            groups.push(currentline[j]);
                        }
                        obj[header] = groups.indexOf(currentline[j]);
                    }
                } else {
                    // Handles all other cases of insertion
                    if (currentline[j] === "null") {
                        obj[header] = null;
                    } else {
                        obj[header] = currentline[j].replaceAll("~", ",");
                    }
                }
            }
        }

        if (_.isEmpty(obj)) break; // if there is an empty line, we are done

        const { name, address, method } = obj;

        if (!name) {
            throw badSyntax("Name missing from excel entry.");
        } else if (!address) {
            throw badSyntax("Address missing from excel entry.");
        } else if (
            obj.type === "employee" &&
            !["driving", "bicycling", "walking", "transit"].includes(method)
        ) {
            throw badSyntax(
                "Employee must have a valid method. Choose from 'driving', 'transit', 'bicycling', and 'walking'.",
            );
        } else {
            result.push(obj);
        }
    }

    return result;
};

export default convertToJson;
