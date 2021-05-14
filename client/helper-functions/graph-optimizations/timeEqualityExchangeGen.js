import graphMaker from "../graphMaker";
import { cloneDeep } from "lodash";
const { Stats } = require("fast-stats");

function findMeanAndStdDev(subGraphs) {
    let s = new Stats();
    let stdDev = undefined;
    let mean = undefined;

    subGraphs.forEach((singleGraph) => {
        const thisEmployee = singleGraph.getEmployees()[0];
        const theirCommute = singleGraph.getTotalCommute(thisEmployee);
        // console.log(thisEmployee, theirCommute);
        s.push(theirCommute);
    });

    mean = s.amean();
    stdDev = s.stddev();

    return { mean, stdDev };
}

function findNextSwap(subGraphs, graph) {
    // Get a map of all commute times so we can compare
    let graphMap = {};
    for (const employee of graph.getEmployees()) {
        graphMap[employee.val] = {};

        for (const [clientNode, weight] of employee.neighbors.entries()) {
            graphMap[employee.val][clientNode.val] = weight;
        }
    }

    // Find the best mean and best standard dev to beat
    const stats = findMeanAndStdDev(subGraphs);
    let bestMean = stats.mean;
    let bestStdDev = stats.stdDev;

    // Loops over all subgraph clients
    for (let i = 0; i < subGraphs.length; i++) {
        const thisSubGraph = subGraphs[i];
        const clients = thisSubGraph.getClients();
        const employee = thisSubGraph.getEmployees()[0];

        // Loops over clients of each subgraph again, comparing swaps
        for (let j = 0; j < clients.length; j++) {
            const client = clients[j];

            // for each client, loop over all subgraphs again
            for (let k = 0; k < subGraphs.length; k++) {
                const comparisonGraph = subGraphs[k];
                const compEmployee = comparisonGraph.getEmployees()[0];
                const compClients = comparisonGraph.getClients();

                if (employee.val !== compEmployee.val) {
                    // And specifically their clients
                    for (let l = 0; l < compClients.length; l++) {
                        const swappable = compClients[l];
                        const testGraph = cloneDeep(thisSubGraph);
                        const testCompGraph = cloneDeep(comparisonGraph);

                        // Get weights of nodes involved in swap
                        const empTakeWeight =
                            graphMap[employee.val][swappable.val];
                        const compEmpTakeWeight =
                            graphMap[compEmployee.val][client.val];

                        // Get nodes involved in swap
                        const clientNode = testGraph.findNodeByVal(client.val);
                        const employeeNode = testGraph.findNodeByVal(
                            employee.val,
                        );
                        const swappableNode = testCompGraph.findNodeByVal(
                            swappable.val,
                        );
                        const compEmployeeNode = testCompGraph.findNodeByVal(
                            compEmployee.val,
                        );

                        // Perform a test swap to see if it beats our best mean and std dev
                        employeeNode.removeAdjacentByVal(clientNode.val);
                        compEmployeeNode.removeAdjacentByVal(swappableNode.val);
                        testGraph.removeVertex(client.val);
                        testCompGraph.removeVertex(swappable.val);

                        testGraph.addEdge(
                            employeeNode.val,
                            swappableNode.val,
                            empTakeWeight,
                        );
                        testCompGraph.addEdge(
                            compEmployeeNode.val,
                            clientNode.val,
                            compEmpTakeWeight,
                        );

                        // We have the complete graphs! Now lets get the
                        // others not affected by the swap so we can see
                        // if this set is better
                        const otherGraphs = subGraphs.filter(
                            (sg) =>
                                ![employee.val, compEmployee.val].includes(
                                    sg.getEmployees()[0].val,
                                ),
                        );

                        // Find mean and stdDev to determine if this is a better graph
                        const { mean, stdDev } = findMeanAndStdDev([
                            testGraph,
                            testCompGraph,
                            ...otherGraphs,
                        ]);

                        if (mean < bestMean && stdDev < bestStdDev) {
                            // return after first good one is found
                            return [testGraph, testCompGraph, ...otherGraphs];
                        }
                    }
                }
            }
        }
    }

    // If no better graph was found, we return the original one
    return subGraphs;
}

function isGoodTradeOff(emp1, emp2, cli1, cli2, graph) {
    let graphMap = {};
    for (const employee of graph.getEmployees()) {
        graphMap[employee.val] = {};

        for (const [clientNode, weight] of employee.neighbors.entries()) {
            graphMap[employee.val][clientNode.val] = weight;
        }
    }

    // Booleans to track if employees are willing to swap
    let emp1Willing = false;
    let emp2Willing = false;

    // Get weights of nodes involved in swap
    const empGiveWeight = graphMap[emp1.val][cli1.val];
    const empTakeWeight = graphMap[emp1.val][cli2.val];
    const compEmpTakeWeight = graphMap[emp2.val][cli1.val];
    const compEmpGiveWeight = graphMap[emp2.val][cli2.val];

    // If the trade lowers an employee's commute, they are willing to trade
    if (empTakeWeight < empGiveWeight) {
        emp1Willing = true;
    }

    if (compEmpTakeWeight < compEmpGiveWeight) {
        emp2Willing = true;
    }

    return emp1Willing && emp2Willing;
}

// Second Phase
function findNextSwap2(subGraphs, graph) {
    // Get a map of all commute times so we can compare
    let graphMap = {};
    for (const employee of graph.getEmployees()) {
        graphMap[employee.val] = {};

        for (const [clientNode, weight] of employee.neighbors.entries()) {
            graphMap[employee.val][clientNode.val] = weight;
        }
    }

    // Loops over all subgraph clients
    for (let i = 0; i < subGraphs.length; i++) {
        const thisSubGraph = subGraphs[i];
        const clients = thisSubGraph.getClients();
        const employee = thisSubGraph.getEmployees()[0];

        // Loops over clients of each subgraph again, comparing swaps
        for (let j = 0; j < clients.length; j++) {
            const client = clients[j];

            // for each client, loop over all subgraphs again
            for (let k = 0; k < subGraphs.length; k++) {
                const comparisonGraph = subGraphs[k];
                const compEmployee = comparisonGraph.getEmployees()[0];
                const compClients = comparisonGraph.getClients();

                if (employee.val !== compEmployee.val) {
                    // And specifically their clients
                    for (let l = 0; l < compClients.length; l++) {
                        const swappable = compClients[l];

                        const isValidTradeOff = isGoodTradeOff(
                            employee,
                            compEmployee,
                            client,
                            swappable,
                            graph,
                        );

                        if (isValidTradeOff) {
                            const testGraph = cloneDeep(thisSubGraph);
                            const testCompGraph = cloneDeep(comparisonGraph);

                            // Get weights of nodes involved in swap
                            const empTakeWeight =
                                graphMap[employee.val][swappable.val];
                            const compEmpTakeWeight =
                                graphMap[compEmployee.val][client.val];

                            // Get nodes involved in swap
                            const clientNode = testGraph.findNodeByVal(
                                client.val,
                            );
                            const employeeNode = testGraph.findNodeByVal(
                                employee.val,
                            );
                            const swappableNode = testCompGraph.findNodeByVal(
                                swappable.val,
                            );
                            const compEmployeeNode =
                                testCompGraph.findNodeByVal(compEmployee.val);

                            // Perform a test swap to see if it beats our best mean and std dev
                            employeeNode.removeAdjacentByVal(clientNode.val);
                            compEmployeeNode.removeAdjacentByVal(
                                swappableNode.val,
                            );
                            testGraph.removeVertex(client.val);
                            testCompGraph.removeVertex(swappable.val);

                            testGraph.addEdge(
                                employeeNode.val,
                                swappableNode.val,
                                empTakeWeight,
                            );
                            testCompGraph.addEdge(
                                compEmployeeNode.val,
                                clientNode.val,
                                compEmpTakeWeight,
                            );

                            // We have the complete graphs! Now lets get the
                            // others not affected by the swap so we can see
                            // if this set is better
                            const otherGraphs = subGraphs.filter(
                                (sg) =>
                                    ![employee.val, compEmployee.val].includes(
                                        sg.getEmployees()[0].val,
                                    ),
                            );

                            // return after first good one is found
                            return [testGraph, testCompGraph, ...otherGraphs];
                        }
                    }
                }
            }
        }
    }

    // If no better graph was found, we return the original one
    return subGraphs;
}

function timeEqualityExchangeGen(graph) {
    const employeeNodes = graph.getEmployees();
    const clientNodes = graph.getClients();

    const numOfEmployees = employeeNodes.length;
    const numOfCients = clientNodes.length;

    // Find whichever employee has the fastest commute to the client, and assign
    let optimizedMap = new Map();

    let idx = 0;
    while (idx <= numOfCients - 1) {
        const employee = employeeNodes[idx % numOfEmployees];
        if (!optimizedMap.has(employee)) {
            optimizedMap.set(employee, [clientNodes[idx]]);
        } else {
            optimizedMap.set(employee, [
                ...optimizedMap.get(employee),
                clientNodes[idx],
            ]);
        }
        idx++;
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

    // Swap until the best swap is the same graph we are on!
    while (subGraphs !== findNextSwap(subGraphs, graph)) {
        subGraphs = findNextSwap(subGraphs, graph);
    }

    // We now have a graph equal to the min time equality one. But now!
    // we will ask employees to exchange nodes if it makes sense
    while (subGraphs !== findNextSwap2(subGraphs, graph)) {
        subGraphs = findNextSwap2(subGraphs, graph);
    }

    return { optimizedMap, subGraphs };
}

export default timeEqualityExchangeGen;
