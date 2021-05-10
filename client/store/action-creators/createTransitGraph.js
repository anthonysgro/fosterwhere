export const CREATE_TRANSIT_GRAPH = "CREATE_TRANSIT_GRAPH";

export const createTransitGraph = (graph) => {
    return {
        type: CREATE_TRANSIT_GRAPH,
        graph,
    };
};
