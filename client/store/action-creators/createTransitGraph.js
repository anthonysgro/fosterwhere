export const CREATE_TRANSIT_GRAPH = "CREATE_TRANSIT_GRAPH";
export const UPDATE_TRANSIT_GRAOH = "UPDATE_TRANSIT_GRAOH";

export const createTransitGraph = (fullGraph, fullJson, subGraphs, subJson) => {
    return {
        type: CREATE_TRANSIT_GRAPH,
        fullGraph: {
            structure: fullGraph,
            json: fullJson,
        },
        subGraphs: {
            structure: subGraphs,
            json: subJson,
        },
    };
};

export const updateTransitGraph = (subJson) => {
    return {
        type: UPDATE_TRANSIT_GRAOH,
        // fullGraph: {
        //     structure: fullGraph,
        //     json: fullJson,
        // },
        // subGraphs: {
        //     structure: subGraphs,
        //     json: subJson,
        // },
    };
};
