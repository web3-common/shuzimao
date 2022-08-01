// import { createLog } from "plugins/log";
// const { log, error: logError } = createLog("store/share");
import createStorage from "modules/localStorage";
const {
    getStorage,
    setStorage,
    removeStorage
} = createStorage("shareData");
export default {
    namespaced: true,
    state() {
        return {
            data: getStorage() || {},
        };
    },
    getters: {
        channel(state) {
            return state.data ? .channel || "";
        },
        userId(state) {
            return state.data ? .userId || "";
        },
    },
    mutations: {
        setChannel(state, channelId) {
            if (!validId(channelId)) return false;
            state.data.channel = channelId;
            setStorage(state.data);
        },
        setUserId(state, userId) {
            if (!validId(userId)) return false;
            state.data.userId = userId;
            setStorage(state.data);
        },
        clean(state) {
            state.data = {};
            removeStorage();
        },
    },
};

function validId(id) {
    if (typeof id === "string") return true;
    if (typeof id === "number") return !isNaN(id);
    return false;
}