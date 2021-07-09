function findEmployeeAndClient(employees, employeeId, clients, clientId) {
    let thisEmployee = null;
    for (const employee of employees) {
        if (employee.id === employeeId) {
            thisEmployee = employee;
            break;
        }
    }

    let thisClient = null;
    for (const client of clients) {
        if (client.id === clientId) {
            thisClient = client;
            break;
        }
    }

    return { thisEmployee, thisClient };
}

module.exports = findEmployeeAndClient;
