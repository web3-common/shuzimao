var now = (function() {
    if (performance.now) {
        return function(accuracy = false) {
            if (accuracy) {
                return performance.now();
            } else {
                return Date.now();
            }
        };
    } else {
        return function() {
            return Date.now();
        };
    }
})();

function strNow() {
    return new Date().toJSON();
}

export {
    now,
    strNow
};