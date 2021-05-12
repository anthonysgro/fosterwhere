import graphMaker from "./graphMaker";
import { cloneDeep } from "lodash";

function jsonToGraph(jsonGraph) {
    let newSubGraph = graphMaker({});
    const employee = cloneDeep(jsonGraph);

    let newMap = new Map();

    newMap.set(employee.id, employee);

    for (const [employeeId, employee] of newMap.entries()) {
        for (const client of employee.clients) {
            newSubGraph.addEdge(
                parseInt(employeeId),
                parseInt(client.id),
                client.thisCommute,
            );
        }
    }

    return newSubGraph;
}

export default jsonToGraph;
