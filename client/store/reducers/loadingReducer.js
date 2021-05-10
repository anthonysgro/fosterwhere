import { STOP_LOADING, DROP_FILE } from "../action-creators";

export const loadingReducer = (state = false, action) => {
    if (action.type === DROP_FILE) {
        return true;
    } else if (action.type === STOP_LOADING) {
        return false;
    } else {
        return state;
    }
};
