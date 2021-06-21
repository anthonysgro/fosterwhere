export const CHANGE_UNASSIGNED = "CHANGE_UNASSIGNED";

export const changeUnassigned = (bool) => {
    return {
        type: CHANGE_UNASSIGNED,
        bool,
    };
};
