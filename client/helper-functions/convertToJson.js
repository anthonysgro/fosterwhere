import { badSyntax } from "../errors";
import _ from "lodash";

const convertToJson = (csv) => {
    const lines = csv.split("\n");
    let result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        let obj = {};
        const currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
            if (currentline[j]) {
                if (currentline[j] === "null") {
                    obj[headers[j].toLowerCase()] = null;
                } else {
                    obj[headers[j].toLowerCase()] = currentline[j].replaceAll(
                        "~",
                        ",",
                    );
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
