import { DROP_FILE } from "../action-creators";

export const dataReducer = (state = null, action) => {
    if (action.type === DROP_FILE) {
        return (state = action.data);
    } else {
        return state;
    }
};
