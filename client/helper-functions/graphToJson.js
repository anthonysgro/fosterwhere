function optimizeGraphToObject(originalData, graph) {
    //     const { optimizedMap, subGraphs } = lowestTimeNonBalanced(graph);
    //     let updatedEmployeeMap = [];
    //     for (const [employeeNode, clientArr] of optimizedMap.entries()) {
    //         const employee = originalData.filter(
    //             (entry) => entry.id === parseInt(employeeNode.val),
    //         )[0];
    //         // Create some new properties with our new information
    //         employee.clients = [];
    //         employee.commute = graph.getCommuteFromClients(employeeNode, clientArr);
    //         // Get client properties
    //         for (const clientNode of clientArr) {
    //             const client = originalData.filter(
    //                 (entry) => entry.id === parseInt(clientNode.val),
    //             )[0];
    //             const thisCommute = graph.getSingleCommute(
    //                 employeeNode,
    //                 clientNode,
    //             );
    //             employee.clients.push({
    //                 ...client,
    //                 thisCommute,
    //             });
    //         }
    //         updatedEmployeeMap.push(employee);
    //     }
    //     return updatedEmployeeMap;
}
import { cloneDeep } from "lodash";

function graphToJson(graph, data) {
    const newGraph = cloneDeep(graph);
    const newData = cloneDeep(data);

    let jsonGraph = [];
    const employeeNodes = newGraph.getEmployees();
    const clientNodes = newGraph.getClients();

    let jsonMap = new Map();
    for (const entry of newData) {
        jsonMap.set(entry.id, entry);
    }

    for (const { val, neighbors } of employeeNodes) {
        const employeeData = cloneDeep(jsonMap.get(val));
        employeeData.clients = [];
        let totalCommute = 0;
        for (const [clientNode, weight] of neighbors.entries()) {
            let clientData = cloneDeep(jsonMap.get(clientNode.val));

            clientData.thisCommute = weight;
            totalCommute += weight;
            employeeData.clients.push(clientData);
        }
        employeeData.totalCommute = totalCommute.toFixed(2);
        jsonGraph.push(employeeData);
    }

    return jsonGraph;
}

export default graphToJson;
