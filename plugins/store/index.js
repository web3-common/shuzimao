import {
    createStore
} from "vuex";
import moduleAddress from "./modules/address";
import moduleCollection from "./modules/collection";
import moduleHome from "./modules/home";
import moduleLogin from "./modules/login";
import moduleOrderList from "./modules/orderList";
import moduleOrderDetail from "./modules/orderDetail";
import moduleShare from "./modules/share";
import moduleUser from "./modules/user";
import moduleActivity from "./modules/activity";
export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        address: moduleAddress,
        collection: moduleCollection,
        home: moduleHome,
        login: moduleLogin,
        orderList: moduleOrderList,
        orderDetail: moduleOrderDetail,
        share: moduleShare,
        user: moduleUser,
        activity: moduleActivity,
    },
});