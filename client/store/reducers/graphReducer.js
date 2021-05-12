import {
    CREATE_TRANSIT_GRAPH,
    UPDATE_TRANSIT_GRAPH,
    TRUE_LOWEST_TIME,
    MANUAL,
} from "../action-creators";

import {
    jsonToGraph,
    lowestTimeNonBalanced,
    graphToJson,
} from "../../helper-functions";
import { cloneDeep } from "lodash";

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
    } else if (action.type === TRUE_LOWEST_TIME) {
        const graph = action.graph;
        const data = action.data;
        const { subGraphs } = cloneDeep(lowestTimeNonBalanced(graph));

        let newSubJson = [];
        for (const graph of subGraphs) {
            newSubJson.push(graphToJson(graph, data));
        }

        return (state = {
            ...state,
            subGraphs: { structure: subGraphs, json: newSubJson },
        });
    } else if (action.type === MANUAL) {
        return state;
    } else {
        return state;
    }
};
