import {
    CREATE_TRANSIT_GRAPH,
    UPDATE_TRANSIT_GRAPH,
    TRUE_LOWEST_TIME,
    MANUAL,
    LOW_TIME_W_EQUALITY,
    TRUE_HIGHEST_TIME,
    RANDOM,
    PURE_EQUALITY,
    TIME_EQUALITY_EXCHANGE,
    DEFAULT,
} from "../action-creators";

import {
    jsonToGraph,
    lowestTimeNonBalanced,
    highestTimeNonBalanced,
    randomGenerator,
    lowTimeWEquality,
    graphToJson,
    pureEqualityGenerator,
    timeEqualityExchangeGen,
    originalGroupingGenerator,
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

        subJson.sort((a, b) => a[0].id - b[0].id);
        // subJson.forEach((employee) =>
        //     employee[0].clients.sort((a, b) => a.id - b.id),
        // );

        return (state = {
            ...state,
            subGraphs: { structure: newSubgraphs, json: subJson },
        });
    } else if (action.type === TRUE_LOWEST_TIME) {
        const graph = action.graph;
        const data = action.data;

        console.time("true-lowest-time");
        const { subGraphs } = cloneDeep(lowestTimeNonBalanced(graph));
        console.timeEnd("true-lowest-time");

        let newSubJson = [];
        for (const graph of subGraphs) {
            newSubJson.push(graphToJson(graph, data));
        }

        newSubJson.sort((a, b) => a[0].id - b[0].id);
        newSubJson.forEach((employee) =>
            employee[0].clients.sort((a, b) => a.id - b.id),
        );

        return (state = {
            ...state,
            subGraphs: { structure: subGraphs, json: newSubJson },
        });
    } else if (action.type === TRUE_HIGHEST_TIME) {
        const graph = action.graph;
        const data = action.data;

        const { subGraphs } = cloneDeep(highestTimeNonBalanced(graph));

        let newSubJson = [];
        for (const graph of subGraphs) {
            newSubJson.push(graphToJson(graph, data));
        }

        newSubJson.sort((a, b) => a[0].id - b[0].id);
        newSubJson.forEach((employee) =>
            employee[0].clients.sort((a, b) => a.id - b.id),
        );

        return (state = {
            ...state,
            subGraphs: { structure: subGraphs, json: newSubJson },
        });
    } else if (action.type === RANDOM) {
        const graph = action.graph;
        const data = action.data;

        console.time("random");
        const { subGraphs } = cloneDeep(randomGenerator(graph));
        console.timeEnd("random");

        let newSubJson = [];
        for (const graph of subGraphs) {
            newSubJson.push(graphToJson(graph, data));
        }

        newSubJson.sort((a, b) => a[0].id - b[0].id);
        newSubJson.forEach((employee) =>
            employee[0].clients.sort((a, b) => a.id - b.id),
        );

        return (state = {
            ...state,
            subGraphs: { structure: subGraphs, json: newSubJson },
        });
    } else if (action.type === MANUAL) {
        return state;
    } else if (action.type === LOW_TIME_W_EQUALITY) {
        const graph = action.graph;
        const data = action.data;

        console.time("min-time-and-equality");
        const { subGraphs } = cloneDeep(lowTimeWEquality(graph));
        console.timeEnd("min-time-and-equality");

        let newSubJson = [];
        for (const graph of subGraphs) {
            newSubJson.push(graphToJson(graph, data));
        }

        newSubJson.sort((a, b) => a[0].id - b[0].id);
        newSubJson.forEach((employee) =>
            employee[0].clients.sort((a, b) => a.id - b.id),
        );

        return (state = {
            ...state,
            subGraphs: { structure: subGraphs, json: newSubJson },
        });
    } else if (action.type === PURE_EQUALITY) {
        const graph = action.graph;
        const data = action.data;

        console.time("strict-equality");
        const { subGraphs } = cloneDeep(pureEqualityGenerator(graph));
        console.timeEnd("strict-equality");

        let newSubJson = [];
        for (const graph of subGraphs) {
            newSubJson.push(graphToJson(graph, data));
        }

        newSubJson.sort((a, b) => a[0].id - b[0].id);
        newSubJson.forEach((employee) =>
            employee[0].clients.sort((a, b) => a.id - b.id),
        );

        return (state = {
            ...state,
            subGraphs: { structure: subGraphs, json: newSubJson },
        });
    } else if (action.type === TIME_EQUALITY_EXCHANGE) {
        const graph = action.graph;
        const data = action.data;

        console.time("two-phase-min-swap");
        const { subGraphs } = cloneDeep(timeEqualityExchangeGen(graph));
        console.timeEnd("two-phase-min-swap");

        let newSubJson = [];
        for (const graph of subGraphs) {
            newSubJson.push(graphToJson(graph, data));
        }

        newSubJson.sort((a, b) => a[0].id - b[0].id);
        newSubJson.forEach((employee) =>
            employee[0].clients.sort((a, b) => a.id - b.id),
        );

        return (state = {
            ...state,
            subGraphs: { structure: subGraphs, json: newSubJson },
        });
    } else if (action.type === DEFAULT) {
        const graph = action.graph;
        const data = action.data;

        console.time("default-grouping");
        const { subGraphs } = cloneDeep(originalGroupingGenerator(graph, data));
        console.timeEnd("default-grouping");

        let newSubJson = [];
        for (const graph of subGraphs) {
            newSubJson.push(graphToJson(graph, data));
        }

        newSubJson.sort((a, b) => a[0].id - b[0].id);
        newSubJson.forEach((employee) =>
            employee[0].clients.sort((a, b) => a.id - b.id),
        );

        return (state = {
            ...state,
            subGraphs: { structure: subGraphs, json: newSubJson },
        });
    } else {
        return state;
    }
};
