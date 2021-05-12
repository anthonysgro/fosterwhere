import {
    TRUE_LOWEST_TIME,
    MANUAL,
    UPDATE_TRANSIT_GRAPH,
    CHANGE_TO_TLT,
    CHANGE_TO_MANUAL,
    STOP_LOADING,
} from "../action-creators";

export const algorithmReducer = (state = "", action) => {
    if (action.type === TRUE_LOWEST_TIME) {
        return (state = "trueLowestTime");
    } else if (action.type === MANUAL) {
        return (state = "manual");
    } else if (action.type === UPDATE_TRANSIT_GRAPH) {
        return (state = "manual");
    } else if (action.type === CHANGE_TO_TLT) {
        return (state = "trueLowestTime");
    } else if (action.type === CHANGE_TO_MANUAL) {
        return (state = "manual");
    } else if (action.type === STOP_LOADING) {
        return (state = "trueLowestTime");
    } else {
        return state;
    }
};
