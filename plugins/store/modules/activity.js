import {
    now
} from "utils";
import {
    createLog
} from "plugins/log";
const {
    error: logError
} = createLog("store/activity:");
import createStorage from "modules/localStorage";
const {
    getStorage,
    setStorage,
    removeStorage
} = createStorage("activityData");
import * as Api from "modules/api";
export default {
    namespaced: true,
    state: {
        token: null,
        userId: null,
        expireTime: null,
        activityInfo: null,
        activityStatus: -1, //0未开始 1进行中 2结束
        userCount: 0, //参与人数
        actId: null, //活动id
        inviterId: null, //邀请人id
        channel: null, //渠道id
    },
    getters: {
        isLogin(state) {
            if (!state.token || !state.userId || !state.expireTime) return false;
            return state.expireTime > now();
        },
        token(state) {
            return state ? .token || "";
        },
        userId(state) {
            return state ? .userId || "";
        },
        activityInfo: (state) => state.activityInfo,
        activityStatus: (state) => state.activityStatus,
        userCount: (state) => state.userCount,
        actId: (state) => state.actId,
        inviterId: (state) => state.inviterId,
        channel: (state) => state.channel,
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
            token,
            expireHour = 1
        } = {}) {
            if (!userId || !token) return false;
            let expireTime = Date.now() + expireHour * 24 * 60 * 60 * 1000;
            state.token = token;
            state.userId = userId;
            state.expireTime = expireTime;
            setStorage({
                token,
                userId,
                expireTime
            });
        },
        cleanToken(state) {
            state.token = null;
            state.userId = null;
            state.expireTime = null;
            removeStorage();
        },
        setActivityInfo(state, data) {
            state.activityInfo = data;
            state.userCount = data ? .userCount;
            state.activityStatus = data ? .activityStatus;
        },
        setParams(state, {
            actId,
            inviterId,
            channel
        } = {}) {
            state.actId = actId;
            state.inviterId = inviterId;
            state.channel = channel;
        },
    },
    actions: {
        async getActivityInfo({
            commit
        }, id) {
            try {
                const result = await Api.get("/activity/getActivityInfo", {
                    activityId: id,
                });
                commit("setActivityInfo", result);
            } catch (err) {
                logError(err);
            }
        },
    },
};