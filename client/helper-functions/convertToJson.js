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

        if (obj.address && obj.name) {
            result.push(obj);
        }
    }

    //return result; //JavaScript object
    // return JSON.stringify(result); //JSON
    return result;
};

export default convertToJson;
