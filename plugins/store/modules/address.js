import * as Api from "modules/api";
import {
    message
} from "plugins/message";
import {
    createLog
} from "plugins/log";
const {
    error: logError
} = createLog("store/address");
import {
    ErrMsg
} from "const";
export default {
    namespaced: true,
    state() {
        return {
            addressList: [],
            areaCodes: null,
            currentData: null,
            showAreaPicker: false,
        };
    },
    getters: {
        addressList(state) {
            return state.addressList;
        },
        areaCodes(state) {
            return state.areaCodes;
        },
        defaultAddressId(state, getters, rootState, rootGetters) {
            return rootGetters["user/defaultAddressId"];
        },
        addressDetail(state) {
            return state.currentData || {};
        },
        addressDetailRegion(state) {
            const addressDetail = state.currentData;
            if (!addressDetail) return "";
            return [addressDetail.province, addressDetail.city, addressDetail.county]
                .filter((v) => v)
                .join(" ");
        },
        isShowAreaPicker(state) {
            return state.showAreaPicker;
        },
    },
    mutations: {
        setAddressList(state, data) {
            state.addressList = data;
        },
        cleanAddressList(state) {
            state.addressList = [];
        },
        setAreaCodes(state, data) {
            state.areaCodes = filterAreaDatas(data);
        },
        setAddressDetail(state, data) {
            state.currentData = data;
        },
        setAddressDetailByKey(state, data) {
            if (!data || typeof data !== "object") return false;
            if (!state.currentData) state.currentData = {};
            for (let key in data) {
                state.currentData[key] = data[key];
            }
        },
        delAddressDetail(state) {
            state.currentData = null;
        },
        setShowAreaPicker(state, isShow) {
            if (typeof isShow !== "boolean") return false;
            state.showAreaPicker = isShow;
        },
    },
    actions: {
        async getAddressList({
            commit
        }) {
            try {
                const result = await Api.get("/user/address/list", null, {
                    checkLogin: false,
                    rsaDecryptList: ["data.name", "data.phone", "data.address"],
                });
                commit("setAddressList", result);
                return result;
            } catch (err) {
                logError("getAddressList", err);
                message.showToast(err ? .errMsg || ErrMsg);
            }
        },
        async changeDefaultAddressId(store, addressId) {
            if (addressId === store.getters.defaultAddressId) return false;
            try {
                const result = await Api.post(
                    "/user/address/setDefault", {
                        id: addressId
                    }, {
                        autoLoading: false
                    }
                );
                if (!result) {
                    throw {
                        errMsg: "设置失败"
                    };
                }
                store.commit("user/setDefaultAddressId", addressId, {
                    root: true
                });
                store.state.addressList ? .forEach((item) => {
                    if (item.id === addressId) {
                        item.isDefault = true;
                    } else {
                        item.isDefault = false;
                    }
                });
            } catch (err) {
                logError("changeDefaultAddressId", err);
                message.showToast(err ? .errMsg || ErrMsg);
            }
        },
        getAreaCodes(store, {
            useCache = true
        } = {}) {
            const _cacheData = store.getters["areaCodes"];
            if (useCache && _cacheData ? .length) {
                return Promise.resolve(_cacheData);
            }
            return Api.get("/address/code/get", null, {
                    autoLoading: false,
                })
                .then((data) => {
                    store.commit("setAreaCodes", data);
                })
                .catch((err) => {
                    logError("getAreaCodes", err);
                });
        },
        getAddressDetail(store, {
            addressId,
            useCache = true
        } = {}) {
            if (!addressId) return Promise.reject("no addressId");
            const _cacheCurrentData = store.getters["addressDetail"];
            if (_cacheCurrentData) {
                if (useCache && _cacheCurrentData.id === addressId)
                    return Promise.resolve(_cacheCurrentData);
                store.commit("delAddressDetail");
            }
            const _cacheByList = store.getters["addressList"].find(
                (item) => item.id === addressId
            );
            if (_cacheByList && useCache) {
                store.commit("setAddressDetail", _cacheByList);
                return Promise.resolve(_cacheByList);
            }
            return Api.get(
                    "user/address/query", {
                        id: addressId
                    }, {
                        rsaDecryptList: ["name", "phone", "address"],
                    }
                )
                .then((data) => {
                    store.commit("setAddressDetail", data);
                    return data;
                })
                .catch((err) => {
                    logError(err);
                    message.showToast(err ? .errMsg || ErrMsg);
                });
        },
    },
};

function filterAreaDatas(region) {
    region.forEach((item) => {
        if (item.children.length) {
            filterAreaDatas(item.children);
        } else {
            delete item.children;
        }
    });
    return region;
}