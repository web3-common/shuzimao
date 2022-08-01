import * as Api from "modules/api";
import {
    createLog
} from "plugins/log";
const {
    log,
    error: logError
} = createLog("store/home");
import createStorage from "modules/localStorage";
const {
    getStorage,
    setStorage,
    removeStorage
} = createStorage("homeData");
export default {
    namespaced: true,
    state() {
        return {
            data: getStorage() || null,
        };
    },
    getters: {
        bannerList(state) {
            return state.data ? .bannerList;
        },
        hotSaleList(state) {
            return state.data ? .hotSaleList;
        },
        recommendList(state) {
            return state.data ? .recommendList;
        },
    },
    mutations: {
        setData(state, data) {
            state.data = data;
            setStorage(data);
        },
        cleanData(state) {
            state.data = null;
            removeStorage();
        },
    },
    actions: {
        getDataAsync(
            store, {
                autoLoading = false,
                useCache = false,
                minRequestTime
            } = {}
        ) {
            return new Promise((resolve, reject) => {
                if (useCache) {
                    let dataSync = store.getters.data;
                    if (dataSync) return resolve(dataSync);
                }
                return Api.get("/homePage/all", null, {
                        autoLoading,
                        minRequestTime,
                        checkLogin: false,
                        headers: {
                            AppVersion: "1.0.0",
                        },
                    })
                    .then((res) => {
                        log("getDataAsync", res);
                        store.commit("setData", res);
                        resolve(res);
                    })
                    .catch((err) => {
                        logError("getDataAsync", err);
                        reject(err);
                    });
            });
        },
    },
};