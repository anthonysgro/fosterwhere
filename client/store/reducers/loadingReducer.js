import { STOP_LOADING, DROP_FILE, START_LOADING } from "../action-creators";

export const loadingReducer = (state = false, action) => {
    if (action.type === START_LOADING) {
        return true;
    } else if (action.type === STOP_LOADING) {
        return false;
    } else {
        return state;
    }
};
