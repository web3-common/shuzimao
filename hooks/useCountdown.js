import {
    ref
} from "vue";
import {
    formatCountDown,
    now
} from "utils";
/**
 * 倒计时
 * @param {number} targetTimes 目标毫秒数
 * @param {number} firstCurrentTimes 系统时间
 * @param {string} format 输出的时间格式
 */

function formatTime(time) {
    if (!time || time <= 0) return "00:00:00";
    return formatCountDown(time / 1000, 3);
}

export const useCountdown = (targetTime = 0, systemTime = 0) => {
    let result = ref(""),
        countDownTimer = null,
        timeOffset = 0;
    if (systemTime >= targetTime) {
        result.value = formatTime(0);
    } else {
        result.value = formatTime(targetTime - systemTime);
        timeOffset = systemTime - now();
        countDownTimer = setInterval(() => {
            const curTime = now() + timeOffset;
            const tempTime = targetTime - curTime;
            result.value = formatTime(tempTime);
            if (tempTime <= 0) {
                clearInterval(countDownTimer);
                return;
            }
        }, 1000);
    }
    return result;
};