import {
    ref
} from "vue";
import * as Api from "modules/api";
// import { now } from "utils";
import {
    ErrMsg
} from "const";
import Message from "plugins/message";

export const sendSms = () => {
    const isLockSend = ref(false);
    const lockSendSecond = ref(0);
    let isLockVerify = false;
    let lockSendTimer = null;

    async function sendSmsCode(apiUrl, mobile) {
        if (isLockSend.value) return Promise.reject("lock");
        if (!mobile) return Promise.reject("no mobile");
        try {
            await Api.post(
                apiUrl, {
                    phone: mobile,
                }, {
                    autoLoading: false,
                    checkLogin: false,
                    rsaEncryptList: ["phone"],
                }
            );
            isLockSend.value = true;
            lockSendSecond.value = 60;
            _startCoundDown();
        } catch (err) {
            let errMsg = err ? .errMsg || ErrMsg;
            Message.showToast(errMsg);
        }
    }
    async function verifySmsCode(
        apiUrl, {
            mobile,
            smsCode,
            activityId,
            inviter,
            channel
        } = {}
    ) {
        if (isLockVerify) return Promise.reject("lock");
        isLockVerify = true;
        try {
            await Api.post(
                apiUrl, {
                    activityId,
                    inviter,
                    phone: mobile,
                    securityCode: smsCode,
                    c: channel,
                }, {
                    checkLogin: false,
                    rsaEncryptList: ["phone"],
                }
            );
            isLockVerify = false;
            return true;
        } catch (err) {
            isLockVerify = false;
            let errMsg = err ? .errMsg || ErrMsg;
            if (err ? .errCode == Api.ErrorCode.LOGIN_CODE_CHECK_WRONG) {
                errMsg = "验证码不正确请重新输入";
            }
            Message.showToast(errMsg);
            return false;
        }
    }

    function _startCoundDown() {
        lockSendTimer && clearInterval(lockSendTimer);
        lockSendTimer = setInterval(() => {
            if (lockSendSecond.value <= 1) {
                lockSendSecond.value = 0;
                isLockSend.value = false;
                clearInterval(lockSendTimer);
            } else {
                lockSendSecond.value--;
            }
        }, 1000);
    }
    return {
        lockSendSecond,
        sendSmsCode,
        verifySmsCode,
    };
};