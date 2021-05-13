import {
    TRUE_LOWEST_TIME,
    MANUAL,
    UPDATE_TRANSIT_GRAPH,
    CHANGE_TO_TLT,
    CHANGE_TO_MANUAL,
    STOP_LOADING,
    LOW_TIME_W_EQUALITY,
    CHANGE_TO_LTWE,
    TRUE_HIGHEST_TIME,
    CHANGE_TO_THT,
    CHANGE_TO_RANDOM,
    RANDOM,
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
    } else if (action.type === LOW_TIME_W_EQUALITY) {
        return (state = "lowTimeWithEquality");
    } else if (action.type === CHANGE_TO_LTWE) {
        return (state = "lowTimeWithEquality");
    } else if (action.type === TRUE_HIGHEST_TIME) {
        return (state = "trueHighestTime");
    } else if (action.type === CHANGE_TO_THT) {
        return (state = "trueHighestTime");
    } else if (action.type === RANDOM) {
        return (state = "random");
    } else if (action.type === CHANGE_TO_RANDOM) {
        return (state = "random");
    } else {
        return state;
    }
};
