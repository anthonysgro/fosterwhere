export const CREATE_EMPLOYEE_MAP = "CREATE_EMPLOYEE_MAP";
export const OPTIMIZE_EMPLOYEE_MAP = "OPTIMIZE_EMPLOYEE_MAP";

export const createEmployeeMap = (map) => {
    return {
        type: CREATE_EMPLOYEE_MAP,
        map,
    };
};

export const optimizeEmployeeMap = (map) => {
    return {
        type: OPTIMIZE_EMPLOYEE_MAP,
        map,
    };
};
