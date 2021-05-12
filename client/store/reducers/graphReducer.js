import { CREATE_TRANSIT_GRAPH, UPDATE_TRANSIT_GRAPH } from "../action-creators";

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
    } else if (action.type === UPDATE_TRANSIT_GRAPH) {
        const { subJson } = action;
        return (state = {
            ...state,
            subGraphs: { ...state.subGraphs, json: subJson },
        });
    } else {
        return state;
    }
};
