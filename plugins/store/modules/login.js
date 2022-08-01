import * as Api from "modules/api";
import {
    Base64,
    now,
    validMobile,
    filterNumber
} from "utils";
import {
    createLog
} from "plugins/log";
const {
    error: logError
} = createLog("store/login");
import createStorage from "modules/localStorage";
const {
    getStorage,
    setStorage,
    removeStorage
} = createStorage("loginData");
export default {
    namespaced: true,
    state() {
        return {
            token: null,
            userId: null,
            expireTime: null,
            mobile: "",
            lockSendSecond: 0,
            lockSendTimer: null,
        };
    },
    getters: {
        isLogin(state) {
            if (!state.token || !state.userId || !state.expireTime) return false;
            return state.expireTime > now();
        },
        token(state) {
            return state ? .token || "";
        },
        mobile(state) {
            return state ? .mobile || "";
        },
        lockSendSecond(state) {
            return state ? .lockSendSecond || 0;
        },
        lockSendTimer(state) {
            return state ? .lockSendTimer;
        },
    },
    mutations: {
        getStorageToken(state) {
            let storageData = getStorage();
            if (typeof storageData == "object") {
                for (let k in storageData) {
                    state[k] = storageData[k];
                }
            }
        },
        setToken(state, {
            userId,
            token
        } = {}) {
            if (!userId || !token) return false;
            const tokenJson = _decodeToken(token);
            if (!tokenJson) return false;
            let expireHour = +tokenJson.b || 1;
            let expireTime = Date.now() + expireHour * 60 * 60 * 1000;
            state.token = token;
            state.userId = userId;
            state.expireTime = expireTime;
            setStorage({
                token,
                userId,
                expireTime,
            });
        },
        cleanToken(state) {
            state.token = null;
            state.userId = null;
            state.expireTime = null;
            removeStorage();
        },
        setMobile(state, mobile) {
            if (typeof mobile !== "string") return false;
            mobile = filterNumber(mobile);
            state.mobile = mobile;
        },
        setLockSendSecond(state, num) {
            if (typeof num !== "number" || isNaN(num)) return false;
            state.lockSendSecond = num;
        },
        setLockSendTimer(state, timer) {
            state.lockSendTimer = timer;
        },
    },
    actions: {
        sendSmsCode(store) {
            const mobile = store.getters["mobile"];
            if (!validMobile(mobile))
                return Promise.reject({
                    detail: mobile,
                    errMsg: "手机号格式不正确，请重新输入",
                });
            return Api.post(
                    "/login/sendCode", {
                        phone: mobile,
                    }, {
                        autoLoading: false,
                        checkLogin: false,
                        rsaEncryptList: ["phone"],
                    }
                )
                .then(() => {
                    store.commit("setLockSendSecond", 60);
                    store.dispatch("startSendCountDown");
                })
                .catch((err) => {
                    logError("sendSmsCode", err);
                    store.commit("setLockSendSecond", 0);
                    throw err;
                });
        },
        startSendCountDown(store) {
            store.dispatch("stopSendCountDown");
            const lockSendTimer = setInterval(() => {
                const lockSendSecond = store.getters["lockSendSecond"];
                if (lockSendSecond <= 1) {
                    store.commit("setLockSendSecond", 0);
                    store.dispatch("stopSendCountDown");
                } else {
                    store.commit("setLockSendSecond", lockSendSecond - 1);
                }
            }, 1000);
            store.commit("setLockSendTimer", lockSendTimer);
        },
        stopSendCountDown(store) {
            let lockSendTimer = store.getters["lockSendTimer"];
            if (lockSendTimer) clearInterval(lockSendTimer);
            store.commit("setLockSendTimer", null);
        },
    },
};

function _decodeToken(token) {
    try {
        let expireStr = token.split(".")[0];
        let decodeStr = Base64.decode(expireStr);
        return JSON.parse(decodeStr);
    } catch (err) {
        logError("_decodeToken", err);
        return null;
    }
}