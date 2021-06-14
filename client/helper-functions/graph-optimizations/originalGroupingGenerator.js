import graphMaker from "../graphMaker";

function originalGroupingGenerator(graph, data) {
    const employeeNodes = graph.getEmployees();
    const clientNodes = graph.getClients();
    const numOfEmployees = employeeNodes.length;
    const numOfCients = clientNodes.length;

    // Assign clients to employees based on "group".
    let optimizedMap = new Map();

    const employeeEntries = data.filter((entry) => entry.type === "employee");

    for (const employee of employeeEntries) {
        const clientIds = data
            .filter((entry) => {
                return (
                    entry.type === "client" && entry.group === employee.group
                );
            })
            .map((client) => client.id);

        const employeeNode = employeeNodes.filter(
            (node) => node.val === employee.id,
        )[0];

        const clientsBelongingToThisEmployee = clientNodes.filter((node) =>
            clientIds.includes(node.val),
        );

        optimizedMap.set(employeeNode, clientsBelongingToThisEmployee);
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

export default originalGroupingGenerator;
