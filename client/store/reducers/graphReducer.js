import { CREATE_TRANSIT_GRAPH } from "../action-creators";

export const graphReducer = (state = null, action) => {
    if (action.type === CREATE_TRANSIT_GRAPH) {
        return (state = action.graph);
    } else {
        return state;
    }
};
