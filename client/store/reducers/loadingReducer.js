import { STOP_LOADING, DROP_FILE, START_LOADING } from "../action-creators";

const initialState = {
    message: "",
    isLoading: false,
};

export const loadingReducer = (state = initialState, action) => {
    if (action.type === START_LOADING) {
        return (state = { message: "Geocoding data...", isLoading: true });
    } else if (action.type === STOP_LOADING) {
        return (state = { message: "", isLoading: false });
    } else if (action.type === DROP_FILE) {
        return (state = {
            message: "Calculating distances... this may take up to a minute.",
            isLoading: true,
        });
    } else {
        return state;
    }
};
