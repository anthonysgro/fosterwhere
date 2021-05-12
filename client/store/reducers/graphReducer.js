import { CREATE_TRANSIT_GRAPH, UPDATE_TRANSIT_GRAPH } from "../action-creators";
import { jsonToGraph } from "../../helper-functions";

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

        let newSubgraphs = [];
        for (let i = 0; i < subJson.length; i++) {
            const subgraphJson = subJson[i][0];
            newSubgraphs.push(jsonToGraph(subgraphJson));
        }

        return (state = {
            ...state,
            subGraphs: { structure: newSubgraphs, json: subJson },
        });
    } else {
        return state;
    }
};
