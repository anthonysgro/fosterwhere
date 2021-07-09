function formatTransitResponse(dataWithRouteInfo) {
    // Change that to the format we want
    const finalObj = {};
    for (const entry of dataWithRouteInfo) {
        const { empId, cliId, travelTime, travelDistance } = entry;

        if (finalObj.hasOwnProperty(empId)) {
            finalObj[empId][cliId] = {
                travelTime,
                travelDistance,
            };
        } else {
            finalObj[empId] = {
                [cliId]: {
                    travelTime,
                    travelDistance,
                },
            };
        }
    }

    return finalObj;
}

module.exports = formatTransitResponse;
