import lowestTimeNonBalanced from "./lowestTimeNonBalanced";
import originalGroupingGenerator from "./originalGroupingGenerator";

function findSubGraphs(graph, data) {
    // console.log(graph);
    const { optimizedMap, subGraphs } = lowestTimeNonBalanced(graph);
    return { graph, subGraphs };
}

export default findSubGraphs;
