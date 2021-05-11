import lowestTimeNonBalanced from "./lowestTimeNonBalanced";

function optimizeGraphToObject(originalData, graph) {
    const optimizedMap = lowestTimeNonBalanced(graph);

    let updatedEmployeeMap = [];
    for (const [employeeNode, clientArr] of optimizedMap.entries()) {
        const employee = originalData.filter(
            (entry) => entry.id === parseInt(employeeNode.val),
        )[0];

        // Create some new properties with our new information
        employee.clients = [];
        employee.commute = graph.getCommuteFromClients(employeeNode, clientArr);

        // Get client properties
        for (const clientNode of clientArr) {
            const client = originalData.filter(
                (entry) => entry.id === parseInt(clientNode.val),
            )[0];

            const thisCommute = graph.getSingleCommute(
                employeeNode,
                clientNode,
            );

            employee.clients.push({
                ...client,
                thisCommute,
            });
        }

        updatedEmployeeMap.push(employee);
    }

    return updatedEmployeeMap;
}

export default optimizeGraphToObject;
