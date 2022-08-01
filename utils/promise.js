/**
 * 对一个promise设置超时时间，该promise在限时内返回才成功
 * @param {*} timeout 超时时间（毫秒），默认15秒
 * @param {*} timeoutMsg 超时时提示语
 * @returns {Promise}
 */
export function promiseTimeout(
    promise, {
        timeout = 15000,
        timeoutMsg = "timeout"
    }
) {
    let pTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(timeoutMsg), timeout);
    });
    return Promise.race([promise, pTimeout]);
}

/**
 * 等待promise
 * @param {*} time 单次等待时间（毫秒）
 * @param {*} loop 等待轮次
 * @returns {Promise}
 */
export function sleep(time = 1000, loop = 1, forceUseTimeout = false) {
    if (loop <= 1 || forceUseTimeout) {
        return sleepByTimeout(time, loop);
    } else {
        return sleepByInterval(time, loop);
    }
}

function sleepByTimeout(time = 1000, loop = 1) {
    return new Promise((resolve) => {
        const loopOnce = () => {
            setTimeout(() => {
                if (--loop <= 0) {
                    resolve();
                } else {
                    loopOnce();
                }
            }, time);
        };
        loopOnce();
    });
}

function sleepByInterval(time = 1000, loop = 1) {
    return new Promise((resolve) => {
        let timer = setInterval(() => {
            if (--loop <= 0) {
                clearInterval(timer);
                resolve();
            }
        }, time);
    });
}