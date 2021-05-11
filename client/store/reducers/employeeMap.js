import { CREATE_EMPLOYEE_MAP, OPTIMIZE_EMPLOYEE_MAP } from "../action-creators";

const initialState = {
    initialMap: null,
    optimizedMap: null,
};

export const employeeMapReducer = (state = initialState, action) => {
    if (action.type === CREATE_EMPLOYEE_MAP) {
        return (state = { ...state, initialMap: action.map });
    } else if (action.type === OPTIMIZE_EMPLOYEE_MAP) {
        return (state = { ...state, optimizedMap: action.map });
    } else {
        return state;
    }
};
