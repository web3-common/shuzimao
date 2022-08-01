import message from "plugins/message";
import {
    createLog
} from "plugins/log";
const {
    error
} = createLog("store/userInfo");
import createStorage from "modules/localStorage";
const {
    getStorage,
    setStorage,
    removeStorage
} = createStorage("userInfo");
import * as Api from "modules/api";
export default {
    namespaced: true,
    state() {
        return {
            userInfo: getStorage() || null,
        };
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        defaultAddressId(state) {
            return state.userInfo ? .defaultAddressId;
        },
    },
    mutations: {
        setUserInfo(state, data) {
            setStorage(data);
            state.userInfo = data;
        },
        setDefaultAddressId(state, id) {
            if (!state.userInfo) state.userInfo = {};
            state.userInfo.defaultAddressId = id;
        },
        cleanUserInfo(state) {
            state.userInfo = null;
            removeStorage();
        },
    },
    actions: {
        async getUserData(store, {
            useCache = false,
            autoLoading = false
        } = {}) {
            try {
                const _cacheData = store.getters["getUserInfo"];
                if (useCache && _cacheData) {
                    return _cacheData;
                }
                const userData = await Api.get(
                    "/user/detail", {}, {
                        autoLoading,
                        rsaDecryptList: ["phone"]
                    }
                );
                store.commit("setUserInfo", userData);
                return userData;
            } catch (err) {
                error("getUserData", err);
                message.showToast(err ? .errMsg);
            }
        },
    },
};