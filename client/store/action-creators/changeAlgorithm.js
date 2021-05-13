export const TRUE_LOWEST_TIME = "TRUE_LOWEST_TIME";
export const CHANGE_TO_TLT = "CHANGE_TO_TLT";

export const TRUE_HIGHEST_TIME = "TRUE_HIGHEST_TIME";
export const CHANGE_TO_THT = "CHANGE_TO_THT";

export const LOW_TIME_W_EQUALITY = "LOW_TIME_W_EQUALITY";
export const CHANGE_TO_LTWE = "CHANGE_TO_LTWE";

export const MANUAL = "MANUAL";
export const CHANGE_TO_MANUAL = "CHANGE_TO_MANUAL";

export const trueLowestTime = (graph, data) => {
    return {
        type: TRUE_LOWEST_TIME,
        graph,
        data,
    };
};

export const trueHighestTime = (graph, data) => {
    return {
        type: TRUE_HIGHEST_TIME,
        graph,
        data,
    };
};

export const lowTimeWEquality = (graph, data) => {
    return {
        type: LOW_TIME_W_EQUALITY,
        graph,
        data,
    };
};

export const manual = (data) => {
    return {
        type: MANUAL,
        data,
    };
};

export const changeToTLT = () => {
    return {
        type: CHANGE_TO_TLT,
    };
};

export const changeToTHT = () => {
    return {
        type: CHANGE_TO_THT,
    };
};

export const changeToManual = () => {
    return {
        type: CHANGE_TO_MANUAL,
    };
};

export const changeToLTWE = () => {
    return {
        type: CHANGE_TO_LTWE,
    };
};