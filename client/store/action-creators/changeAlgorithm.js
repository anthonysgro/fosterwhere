export const TRUE_LOWEST_TIME = "TRUE_LOWEST_TIME";
export const MANUAL = "MANUAL";
export const CHANGE_TO_TLT = "CHANGE_TO_TLT";
export const CHANGE_TO_MANUAL = "CHANGE_TO_MANUAL";

export const trueLowestTime = (graph, data) => {
    return {
        type: TRUE_LOWEST_TIME,
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

export const changeToManual = () => {
    return {
        type: CHANGE_TO_MANUAL,
    };
};
