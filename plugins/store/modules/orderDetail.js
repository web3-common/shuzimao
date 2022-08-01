import * as Api from "modules/api";
import {
    OrderStatus
} from "const";
import {
    now
} from "utils";
import {
    createLog
} from "plugins/log";
const {
    log,
    error: logError
} = createLog("store/orderDetail");
export default {
    namespaced: true,
    state() {
        return {
            orderData: null,
            showCancel: false,
            showExtraExpressForm: false,
            showOrderForm: true,
            hasStatus0: false,
            offsetTime: 0,
            now: now(),
        };
    },
    getters: {
        orderData(state) {
            return state.orderData;
        },
        orderId(state) {
            return state.orderData ? .orderId;
        },
        orderStatus(state) {
            return state.orderData ? .orderStatus;
        },
        collectionDetail(state) {
            return state.orderData ? .collectionDetail;
        },
        addressView(state) {
            return state.orderData ? .digitalOrderAddressView;
        },
        expressInfo(state) {
            if (!state.orderData ? .expressInfo) return null;
            return {
                ...state.orderData.expressInfo,
                expressNumber: state.orderData.expressNumber,
            };
        },
        showUnpayStatus(state) {
            return state.orderData && state.hasStatus0;
        },
        isLoading(state) {
            return !state.orderData;
        },
        showExtraExpressForm(state) {
            return state.showExtraExpressForm;
        },
        unpayCountDown(state, getters) {
            if (getters.orderStatus !== 0) return 0;
            let autoCancelTime = state.orderData.automaticAbandonTime;
            let now = state.now;
            if (!autoCancelTime || autoCancelTime < now) return 0;
            return Math.ceil((autoCancelTime - now) / 1000);
        },
    },
    mutations: {
        setShowCancel(state, value) {
            state.showCancel = Boolean(value);
        },
        setShowExtraExpressForm(state, value) {
            state.showExtraExpressForm = Boolean(value);
        },
        setOrderData(state, data) {
            state.orderData = data;
            if (data.orderStatus === 0) {
                state.hasStatus0 = true;
            }
        },
        setOrderStatus(state, orderStatus) {
            if (!state.orderData) {
                return false;
            }
            if (orderStatus === 0) {
                state.hasStatus0 = true;
            }
            state.orderData.orderStatus = orderStatus;
        },
        cleanOrderData(state) {
            state.orderData = null;
            state.showCancel = false;
            state.showExtraExpressForm = false;
            state.showOrderForm = true;
            state.hasStatus0 = false;
            state.offsetTime = 0;
        },
        resetOther(state) {
            state.showCancel = false;
            state.showExtraExpressForm = false;
        },
        setOffsetTime(state, systemTime) {
            if (!systemTime) return false;
            state.offsetTime = systemTime - now();
        },
        updateNow(state) {
            state.now = now() + state.offsetTime;
        },
    },
    actions: {
        getOrderDataAsync(
            store, {
                orderId = store.getters.orderId,
                useCache = false,
                autoLoading = true,
                minRequestTime,
            } = {}
        ) {
            return new Promise((resolve, reject) => {
                if (!orderId) {
                    reject("无效订单号");
                }
                if (useCache) {
                    let dataCached = store.state.orderData;
                    if (dataCached && dataCached.orderId == orderId)
                        return resolve(dataCached);
                }
                store.commit("cleanOrderData");
                return Api.get(
                        "/order/detail", {
                            orderId,
                        }, {
                            autoLoading,
                            minRequestTime,
                            rsaDecryptList: [
                                "digitalOrderAddressView.name",
                                "digitalOrderAddressView.phone",
                                "digitalOrderAddressView.address",
                            ],
                        }
                    )
                    .then((data) => {
                        log("getOrderDataAsync", data);
                        store.commit("resetOther");
                        store.commit("setOrderData", data);
                        store.commit(
                            "setOffsetTime",
                            data ? .systemTime || data ? .collectionDetail ? .systemTime
                        );
                        store.commit("updateNow");
                        resolve(data);
                    })
                    .catch((err) => {
                        logError("getOrderDataAsync", err);
                        reject(err);
                    });
            });
        },
        updateNow(store) {
            store.commit("updateNow");
            const state = store.state;
            const autoCancelTime = state.orderData ? .automaticAbandonTime;
            const now = state.now;
            if (autoCancelTime && autoCancelTime <= now) {
                store.commit("setOrderStatus", OrderStatus.TIMEOUT_CANCEL);
            }
        },
    },
};