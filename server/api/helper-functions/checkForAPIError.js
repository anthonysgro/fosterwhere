// const requestDenied = require("../errors/requestDenied");
// const overQueryLimit = require("../errors/overQueryLimit");
// const zeroResults = require("../errors/zeroResults");
const { zeroResults, overQueryLimit, requestDenied } = require("../errors");

function checkForAPIError(data, employees, employee, clients, client) {
    const { status, error_message } = data;

    // Error handling
    if (status === "REQUEST_DENIED") {
        throw requestDenied(error_message);
    } else if (status === "OVER_QUERY_LIMIT") {
        throw overQueryLimit(error_message);
    } else if (status === "ZERO_RESULTS") {
        throw zeroResults(employees, employee, clients, client);
    }
}

module.exports = checkForAPIError;
