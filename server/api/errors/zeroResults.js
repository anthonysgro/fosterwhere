const findEmployeeAndClient = require("../helper-functions/findEmployeeAndClient");

function zeroResults(employees, employeeId, clients, clientId) {
    const { thisEmployee, thisClient } = findEmployeeAndClient(
        employees,
        employeeId,
        clients,
        clientId,
    );

    error = Error(
        `This form of travel not available for employee ${thisEmployee.name} and client #${thisClient.name} route`,
    );
    error.status = 400;
    throw error;
}

module.exports = zeroResults;
