// Action type
export const DROP_FILE = "DROP_FILE";

export const dropFile = (data) => {
    return {
        type: DROP_FILE,
        data,
    };
};
