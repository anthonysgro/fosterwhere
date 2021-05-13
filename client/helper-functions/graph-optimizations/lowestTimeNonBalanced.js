import graphMaker from "../graphMaker";

function lowestTimeNonBalanced(graph) {
    const employeeNodes = graph.getEmployees();
    const clientNodes = graph.getClients();
    const numOfEmployees = employeeNodes.length;
    const numOfCients = clientNodes.length;

    // Find whichever employee has the fastest commute to the client, and assign
    let optimizedMap = new Map();
    for (const client of clientNodes) {
        let minCommute = Number.POSITIVE_INFINITY;
        let minEmployee = null;

        for (const employee of employeeNodes) {
            const commute = employee.getWeight(client);
            if (commute < minCommute) {
                minCommute = commute;
                minEmployee = employee;
            }
        }

        // Creates a map of optimal pairings
        if (!optimizedMap.has(minEmployee)) {
            optimizedMap.set(minEmployee, [client]);
        } else {
            optimizedMap.set(minEmployee, [
                ...optimizedMap.get(minEmployee),
                client,
            ]);
        }
    }

    // If employee wasn't assigned anyone...
    if (numOfEmployees > optimizedMap.size) {
        // find employee
        for (const employee of employeeNodes) {
            if (!optimizedMap.has(employee)) {
                optimizedMap.set(employee, []);
            }
        }
    }

    // Create subgraphs for each employee
    let subGraphs = [];
    for (const [employeeNode, clientArr] of optimizedMap.entries()) {
        const employeeId = parseInt(employeeNode.val);
        const employeeNeighbors = employeeNode.neighbors;
        const subGraph = graphMaker({});

        // SubMap to trade memory for space, keep track of neighbors
        let subMap = new Map();
        for (const [neighbor, weight] of employeeNeighbors.entries()) {
            subMap.set(neighbor, weight);
        }

        // Add edges to our subgraph
        for (const [idx, clientNode] of clientArr.entries()) {
            const weight = subMap.get(clientNode);
            const clientId = clientNode.val;
            subGraph.addEdge(employeeId, parseInt(clientId), weight);
        }

        // If employee had no edges, we have to add them as a vertex
        if (subGraph.getEmployees().length === 0) {
            subGraph.addVertex(employeeId);
        }

        subGraphs.push(subGraph);
    }

    return { optimizedMap, subGraphs };
}

export default lowestTimeNonBalanced;
