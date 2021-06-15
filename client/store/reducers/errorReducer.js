import { TRIGGER_ERROR, RESET_ERROR } from "../action-creators";

const initialState = {
    error: null,
    message: "",
};

export const errorReducer = (state = initialState, action) => {
    if (action.type === TRIGGER_ERROR) {
        const { error } = action;
        const message = error.request
            ? error.request.responseText
            : error.message;

        return (state = { error, message });
    } else if (action.type === RESET_ERROR) {
        return (state = initialState);
    } else {
        return state;
    }
};
