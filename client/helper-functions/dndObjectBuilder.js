function dndObjectBuilder(employeeMap) {
    let clients = {};
    let employees = {};
    let employeeOrder = [];

    for (const employee of employeeMap) {
        employees[`employee-${employee.id}`] = {
            id: `employee-${employee.id}`,
            name: employee.name,
            role: "employee",
            totalCommute: employee.commute,
            clientIds: [],
        };

        for (const client of employee.clients) {
            clients[`client-${client.id}`] = {
                id: `client-${client.id}`,
                name: client.name,
                role: "client",
                commute: client.thisCommute,
            };
            employees[`employee-${employee.id}`].clientIds.push(
                `client-${client.id}`,
            );
        }
        employeeOrder.push(`employee-${employee.id}`);
    }

    return { clients, employees, employeeOrder };
}

export default dndObjectBuilder;
