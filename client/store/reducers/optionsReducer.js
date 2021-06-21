import { CHANGE_UNASSIGNED } from "../action-creators";

const initialState = {
    unassigned: false,
};

export const optionsReducer = (state = initialState, action) => {
    if (action.type === CHANGE_UNASSIGNED) {
        return (state = {
            ...state,
            unassigned:
                action.bool !== undefined ? action.bool : !state.unassigned,
        });
    } else {
        return state;
    }
};
