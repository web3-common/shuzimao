import * as Api from "modules/api";
import {
    ErrMsg,
    OrderStatus
} from "const";
import {
    now
} from "utils";
import {
    nextTick
} from "vue";
import message from "plugins/message";
import {
    createLog
} from "plugins/log";
const {
    log,
    error: logError
} = createLog("store/orderList");
const TabOrderStatus = [
    OrderStatus.ALL,
    OrderStatus.UNPAY,
    OrderStatus.PAID,
    OrderStatus.DONE,
];
export default {
    namespaced: true,
    state() {
        return {
            orderLists: {
                //[OrderStatus]:Array
            },
            tabIndex: 0,
            offsetTime: 0,
            now: now(),
            countDownTimer: null,
        };
    },
    getters: {
        //全部tab订单列表
        listAll(state) {
            const orderLists = state.orderLists;
            const realList = orderLists[OrderStatus.ALL];
            if (realList ? .length) {
                return realList;
            }
            let fakeList = [];
            for (let k in orderLists) {
                if (orderLists[k] ? .length) {
                    fakeList.concat(orderLists[k]);
                }
            }
            return fakeList;
        },
        //待付款tab订单列表
        listUNPAY: createGetterList(OrderStatus.UNPAY),
        //待收货tab订单列表
        listPAID: createGetterList(OrderStatus.PAID),
        //已完成tab订单列表
        listDONE: createGetterList(OrderStatus.DONE),
        orderListShow(state, getters) {
            switch (state.tabIndex) {
                case 1:
                    return getters.listUNPAY;
                case 2:
                    return getters.listPAID;
                case 3:
                    return getters.listDONE;
                case 0:
                default:
                    return getters.listAll;
            }
        },
        now(state) {
            return state.now;
        },
        tabIndex(state) {
            return state.tabIndex;
        },
        //是否存在待付款订单
        hasOrderUNPAY(state, getters) {
            return getters.listUNPAY ? .length > 0;
        },
        //是否存在待收货订单
        hasOrderPAID(state, getters) {
            return getters.listPAID ? .length > 0;
        },
        //最近要过期的待付款订单过期时间
        lastestUNPAYAutoCancelTime(state, getters) {
            const list = getters.listUNPAY;
            const now = state.now;
            if (!list.length) return false;
            let lastestAutoCancelTime = null;
            list ? .forEach((order) => {
                if (order.orderStatus != OrderStatus.UNPAY) return false;
                const autoCancelTime = order.automaticAbandonTime;
                if (!autoCancelTime) return false;
                if (
                    autoCancelTime > now &&
                    (!lastestAutoCancelTime || autoCancelTime < lastestAutoCancelTime)
                ) {
                    lastestAutoCancelTime = autoCancelTime;
                }
            });
            return lastestAutoCancelTime;
        },
    },
    mutations: {
        setOrderList(state, {
            orderStatus,
            list
        }) {
            state.orderLists[orderStatus] = list;
        },
        setTabIndex(state, tabIndex) {
            if (validTabIndex(tabIndex)) {
                state.tabIndex = tabIndex;
            }
        },
        setOffsetTime(state, systemTime) {
            if (!systemTime) return false;
            state.offsetTime = systemTime - now();
        },
        updateNow(state) {
            state.now = now() + state.offsetTime;
        },
        //根据当前时间过滤已过期订单
        filterStatusUNPAY(state) {
            const now = state.now;
            const orderLists = state.orderLists;
            orderLists[OrderStatus.ALL] ? .forEach((order) => {
                if (order.orderStatus != OrderStatus.UNPAY) return false;
                if (order.automaticAbandonTime < now + 1000) {
                    order.orderStatus = OrderStatus.TIMEOUT_CANCEL;
                }
            });
            orderLists[OrderStatus.UNPAY] = orderLists[OrderStatus.UNPAY] ? .filter(
                (order) => {
                    if (order.orderStatus != OrderStatus.UNPAY) return false;
                    if (order.automaticAbandonTime < now + 1000) {
                        order.orderStatus = OrderStatus.TIMEOUT_CANCEL;
                        return false;
                    }
                    return true;
                }
            );
        },
        //清除所有订单缓存
        cleanOrderLists(state) {
            const orderLists = state.orderLists;
            for (let k in orderLists) {
                if (orderLists[k] ? .length) {
                    orderLists[k].length = 0;
                }
            }
        },
    },
    actions: {
        /**
         * 根据tab序号获取订单列表
         * @param {Number} tabIndex tab序号
         * @param {Boolean} autoLoading 是否展示loading
         * @param {Boolean} useCache 是否使用缓存
         * @returns {Array} 订单列表
         */
        getOrderListAsync(
            store, {
                tabIndex = 0,
                orderStatus,
                autoLoading = false,
                useCache = false
            } = {}
        ) {
            const orderLists = store.state.orderLists;
            if (typeof orderStatus == "undefined" && validTabIndex(tabIndex)) {
                orderStatus = TabOrderStatus[tabIndex];
            }
            if (useCache) {
                let dataCached = orderLists[orderStatus];
                if (dataCached ? .length) return Promise.resolve(dataCached);
            }
            return Api.get(
                "/order/listByUser", {
                    status: orderStatus >= 0 ? orderStatus : void 0,
                }, {
                    autoLoading,
                }
            ).then((res) => {
                log("getOrderListAsync", res);
                let orderList = res ? .orderList || [];
                let systemTime = res ? .systemTime;

                if (orderList) {
                    store.commit("setOrderList", {
                        orderStatus,
                        list: orderList
                    });
                }

                if (systemTime) {
                    store.commit("setOffsetTime", systemTime);
                    store.dispatch("updateNow");
                }
                nextTick(() => {
                    if (store.getters.hasOrderUNPAY) {
                        store.dispatch("startCountDown");
                    }
                });
                return orderList || [];
            });
        },
        async switchTabIndex(store, tabIndex) {
            if (!validTabIndex(tabIndex)) return false;
            try {
                store.commit("setTabIndex", tabIndex);
                await store.dispatch("getOrderListAsync", {
                    tabIndex,
                    useCache: true,
                });
            } catch (err) {
                logError("switchTabIndex", err);
                let errMsg = err ? .errMsg || ErrMsg;
                message.showModal(errMsg);
            }
        },
        async updateNow(store) {
            store.commit("updateNow");
            store.commit("filterStatusUNPAY");
            await nextTick();
            if (!store.getters.hasOrderUNPAY) {
                await store.dispatch("stopCountDown");
            }
        },
        startCountDown({
            state,
            dispatch
        }) {
            dispatch("stopCountDown");
            state.countDownTimer = setInterval(() => {
                dispatch("updateNow");
            }, 1000);
        },
        stopCountDown({
            state
        }) {
            if (state.countDownTimer) {
                clearInterval(state.countDownTimer);
                state.countDownTimer = null;
            }
        },
    },
};

function createGetterList(orderStatus) {
    return function(state) {
        const orderLists = state.orderLists;
        const realList = orderLists[orderStatus];
        if (realList ? .length) {
            return realList;
        }
        const allList = orderLists[OrderStatus.ALL];
        return allList ? .filter((o) => o.orderStatus == orderStatus) || [];
    };
}

function validTabIndex(index) {
    let _id = Number(index);
    return typeof _id == "number" && _id >= 0 && _id < TabOrderStatus.length;
}