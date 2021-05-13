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

function findMeanDevOfStrip(subGraphs) {
    console.log(subGraphs);
}

function lowTimeWEquality(graph) {
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

    let graphMap = {};
    for (const employee of graph.getEmployees()) {
        graphMap[employee.val] = {};

        for (const [clientNode, weight] of employee.neighbors.entries()) {
            graphMap[employee.val][clientNode.val] = weight;
        }
    }

    const stats = findMeanAndStdDev(subGraphs);
    let bestMean = stats.mean;
    let bestStdDev = stats.stdDev;

    let lastChanged = null;
    let bestSubGraphGroup = subGraphs;

    let changed = false;

    // Loops over all subgraph clients twice
    for (let i = 0; i < subGraphs.length; i++) {
        const thisSubGraph = subGraphs[i];
        const clients = thisSubGraph.getClients();
        const employee = thisSubGraph.getEmployees()[0];
        // console.log(employee);

        // Loops over clients of each subgraph
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

                        // Get weights
                        const empTakeWeight =
                            graphMap[employee.val][swappable.val];
                        const compEmpTakeWeight =
                            graphMap[compEmployee.val][client.val];

                        // Get nodes
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

                        // employeeNode.addAdjacent(swappableNode, empTakeWeight);
                        // compEmployeeNode.addAdjacent(
                        //     clientNode,
                        //     compEmpTakeWeight,
                        // );

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

                        // We have two complete graphs! Now lets get the
                        // last one so we can see if this set is better
                        const lastGraph = subGraphs.filter(
                            (sg) =>
                                ![employee.val, compEmployee.val].includes(
                                    sg.getEmployees()[0].val,
                                ),
                        )[0];

                        const { mean, stdDev } = findMeanAndStdDev([
                            testGraph,
                            testCompGraph,
                            lastGraph,
                        ]);

                        if (mean < bestMean && stdDev < bestStdDev) {
                            // console.log(mean, stdDev);
                            console.log(employeeNode.val, swappableNode.val);
                            console.log(compEmployeeNode.val, clientNode.val);
                            console.log([testGraph, testCompGraph, lastGraph]);
                            // console.log([
                            //     testGraph,
                            //     testCompGraph,
                            //     lastGraph,
                            // ]);

                            bestSubGraphGroup = [
                                testGraph,
                                testCompGraph,
                                lastGraph,
                            ];

                            bestMean = mean;
                            bestStdDev = stdDev;

                            changed = true;
                            subGraphs = [testGraph, testCompGraph, lastGraph];
                            return { optimizedMap, subGraphs };
                        }
                    }
                }
            }
        }
    }

    return { optimizedMap, subGraphs };
}

export default lowTimeWEquality;
