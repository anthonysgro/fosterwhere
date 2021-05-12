import lowestTimeNonBalanced from "./lowestTimeNonBalanced";

function findSubGraphs(graph) {
    const { optimizedMap, subGraphs } = lowestTimeNonBalanced(graph);
    return { graph, subGraphs };
}

export default findSubGraphs;
