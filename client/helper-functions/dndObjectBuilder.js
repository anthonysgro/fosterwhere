function dndObjectBuilder(employeeMap) {
    let clients = {};
    let employees = {};
    let employeeOrder = [];

    for (const employee of employeeMap) {
        employees[`${employee.id}`] = {
            id: `${employee.id}`,
            name: employee.name,
            role: "employee",
            totalCommute: employee.totalCommute,
            method: employee.method,
            clientIds: [],
        };

        for (const client of employee.clients) {
            clients[`${client.id}`] = {
                id: `${client.id}`,
                name: client.name,
                role: "client",
                commute: client.thisCommute,
            };

            if (client.closestWorker) {
                clients[`${client.id}`] = {
                    ...clients[`${client.id}`],
                    closestWorker: client.closestWorker,
                };
            }

            employees[`${employee.id}`].clientIds.push(`${client.id}`);
        }
        employeeOrder.push(`${employee.id}`);
    }

    return { clients, employees, employeeOrder };
}

export default dndObjectBuilder;
