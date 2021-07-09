function requestDenied(errorMsg) {
    error = Error(errorMsg);
    error.status = 400;
    throw error;
}

module.exports = requestDenied;
