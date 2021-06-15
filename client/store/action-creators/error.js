export const TRIGGER_ERROR = "TRIGGER_ERROR";
export const RESET_ERROR = "RESET_ERROR";

export const triggerError = (error) => {
    return {
        type: TRIGGER_ERROR,
        error,
    };
};

export const resetError = () => {
    return {
        type: RESET_ERROR,
    };
};
