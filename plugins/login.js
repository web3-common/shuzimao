import store from "./store";
import router from "./router";
// import { cleanAllStorage } from "modules/localStorage";

export default {
    install(app) {
        const globalProperties = app.config.globalProperties;

        //登录
        globalProperties.$login = this.login.bind(this);

        //检查是否登录
        globalProperties.$checkLogin = this.checkLogin.bind(this);

        //退出登录
        globalProperties.$logout = this.logout.bind(this);
    },
    next: null,
    back: null,
    /**
     * 检查是否登录
     * @return {Boolean} 是否登录
     */
    checkLogin: () => store.getters["login/isLogin"],
    /**
     * 跳转登录页
     * vue-router 通过query传参：
     * @param {String/Object} next 登录成功后跳转页，默认首页
     * @param {Number} nextType 登录成功后跳转方式，默认0 0:router.relace 1:router.push 2:router.back -1:none
     * @return {Promise} 登录promise，登录成功返回resolve状态，登录取消reject状态
     */
    login({
        next = "/",
        nextType = 0
    } = {}) {
        if (nextType !== 0 && nextType !== 1 && next) {
            next = undefined;
        }
        return new Promise((resolve, reject) => {
            this.next = resolve;
            this.back = reject;
            let query = {
                nextType,
            };
            if (typeof next == "object") {
                query.nextJson = encodeURIComponent(JSON.stringify(next));
            } else if (next) {
                query.next = next;
            }
            router.push({
                name: "Login",
                query,
            });
        });
    },
    /**
     * 退出登录
     * @return {Boolean} 是否成功退出登录
     */
    logout() {
        store.commit("login/cleanToken");
        store.commit("user/cleanUserInfo");
        store.commit("orderDetail/cleanOrderData");
        store.commit("orderList/cleanOrderLists");
        store.commit("address/cleanAddressList");
        store.commit("address/delAddressDetail");
        // cleanAllStorage();
        return !this.checkLogin();
    },
};