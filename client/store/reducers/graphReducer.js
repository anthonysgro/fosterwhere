import { CREATE_TRANSIT_GRAPH } from "../action-creators";

const initialState = {
    fullGraph: {
        structure: null,
        json: null,
    },
    subGraphs: {
        structure: [],
        json: [],
    },
};

export const graphReducer = (state = initialState, action) => {
    if (action.type === CREATE_TRANSIT_GRAPH) {
        const { fullGraph, subGraphs } = action;
        return (state = { fullGraph, subGraphs });
    } else {
        return state;
    }
};
