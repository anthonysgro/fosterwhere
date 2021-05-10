const convertCommas = (worksheet) => {
    let newObj = {};
    for (const [name, cell] of Object.entries(worksheet)) {
        newObj[name] = cell;

        if (typeof cell === "object") {
            for (let [keyVal, str] of Object.entries(cell)) {
                if (typeof str === "string") {
                    str = str.replaceAll(",", "~");
                }
                newObj[name][keyVal] = str;
            }
        }
    }
    return newObj;
};

export default convertCommas;
