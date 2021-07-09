function setDelay(cb, timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            cb();
            resolve();
        }, timeout);
    });
}

module.exports = setDelay;
