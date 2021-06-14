export const TRUE_LOWEST_TIME = "TRUE_LOWEST_TIME";
export const CHANGE_TO_TLT = "CHANGE_TO_TLT";

export const TRUE_HIGHEST_TIME = "TRUE_HIGHEST_TIME";
export const CHANGE_TO_THT = "CHANGE_TO_THT";

export const TIME_EQUALITY_EXCHANGE = "TIME_EQUALITY_EXCHANGE";
export const CHANGE_TO_TEE = "CHANGE_TO_TEE";

export const LOW_TIME_W_EQUALITY = "LOW_TIME_W_EQUALITY";
export const CHANGE_TO_LTWE = "CHANGE_TO_LTWE";

export const PURE_EQUALITY = "PURE_EQUALITY";
export const CHANGE_TO_PURE_EQUALITY = "CHANGE_TO_PURE_EQUALITY";

export const RANDOM = "RANDOM";
export const CHANGE_TO_RANDOM = "CHANGE_TO_RANDOM";

export const MANUAL = "MANUAL";
export const CHANGE_TO_MANUAL = "CHANGE_TO_MANUAL";

export const DEFAULT = "DEFAULT";
export const CHANGE_TO_DEFAULT = "CHANGE_TO_DEFAULT";

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

export const timeEqualityExchange = (graph, data) => {
    return {
        type: TIME_EQUALITY_EXCHANGE,
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

export const pureEquality = (graph, data) => {
    return {
        type: PURE_EQUALITY,
        graph,
        data,
    };
};

export const random = (graph, data) => {
    return {
        type: RANDOM,
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

export const defaultGrouping = (graph, data) => {
    return {
        type: DEFAULT,
        graph,
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

export const changeToTEE = () => {
    return {
        type: CHANGE_TO_TEE,
    };
};

export const changeToLTWE = () => {
    return {
        type: CHANGE_TO_LTWE,
    };
};

export const changeToPureEquality = () => {
    return {
        type: CHANGE_TO_PURE_EQUALITY,
    };
};

export const changeToRandom = () => {
    return {
        type: CHANGE_TO_RANDOM,
    };
};

export const changeToManual = () => {
    return {
        type: CHANGE_TO_MANUAL,
    };
};

export const changeToDefaultGrouping = () => {
    return {
        type: CHANGE_TO_DEFAULT,
    };
};
