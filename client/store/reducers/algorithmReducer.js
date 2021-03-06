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
    PURE_EQUALITY,
    CHANGE_TO_PURE_EQUALITY,
    RANDOM,
    TIME_EQUALITY_EXCHANGE,
    CHANGE_TO_TEE,
    CHANGE_TO_DEFAULT,
    DEFAULT,
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
    } else if (action.type === PURE_EQUALITY) {
        return (state = "strictEquality");
    } else if (action.type === CHANGE_TO_PURE_EQUALITY) {
        return (state = "strictEquality");
    } else if (action.type === RANDOM) {
        return (state = "random");
    } else if (action.type === CHANGE_TO_RANDOM) {
        return (state = "random");
    } else if (action.type === TIME_EQUALITY_EXCHANGE) {
        return (state = "timeEqualityExchange");
    } else if (action.type === CHANGE_TO_TEE) {
        return (state = "timeEqualityExchange");
    } else if (action.type === CHANGE_TO_DEFAULT) {
        return (state = "defaultGrouping");
    } else if (action.type === DEFAULT) {
        return (state = "defaultGrouping");
    } else {
        return state;
    }
};
