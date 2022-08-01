import {
    createRouter,
    createWebHistory
} from "vue-router";
import routesUser from "./routes-user";
import routesOther from "./routes-other";
import routesCollection from "./routes-collection";
import routesAddress from "./routes-address";
import routesActivity from "./routes-activity";
import {
    routerBaseUrl
} from "config";
import {
    onShare,
    hideShare,
    checkJumpCookieByWxpay
} from "modules/wxsdk";
import {
    wxAuth
} from "modules/snsapi";
import {
    isWX,
    now,
    formatError
} from "utils";
import PluginLogin from "../login";
import message from "../message";
import {
    createLog
} from "../log";
const {
    log,
    error: logError
} = createLog("plugin/login");

/**
 * route Meta参数：
 * @param {Boolean} keepAlive 是否保留页面状态，默认false
 * @param {Boolean} needLogin 是否需要登录（已登录直接跳转，未登录自动跳转登录页，登录成功再跳转），默认false
 * @param {Strinng} shareType 分享设置类型， 默认default
 *                  'default':使用首页配置分享;
 *                  'disable':禁用分享;
 *                  'custom':自定义分享;
 * @param {Boolean} wxworkType 企业微信跳转控制， 默认default
 *                  'default': 自动打开微信自己的跳转页面
 *                  'custom': 自定义跳转
 * @param {Boolean} noFrom 没有前一个页面，该参数自动变为true
 * @param {Boolean} wxAuth 是否需要微信授权
 * @param {Boolean} wxRedirectPage  config中配置相关定向地址以及cookieKey
 */
let routes = [{
        path: "/",
        alias: "/home",
        name: "Home",
        component: require("views/home/home").default,
        meta: {
            keepAlive: true,
            shareType: "default",
        },
        beforeEnter: (to, from, next) => {
            if (to.redirectedFrom) {
                logError("NotFound", to.redirectedFrom);
            }
            next();
        },
    },
    ...routesCollection,
    ...routesAddress,
    ...routesUser,
    ...routesOther,
    ...routesActivity,
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        redirect: "/",
    },
];

const router = createRouter({
    history: createWebHistory(routerBaseUrl),
    routes,
});
router.beforeEach((to, from, next) => {
    const meta = to ? .meta || {};
    // 联调测试
    if (meta.wxRedirectPage === "activity") {
        document.title = "「千年一瞬·敦煌」抢先购抽签";
    } else {
        document.title = "数字猫";
    }
    if (meta.wxAuth && meta.wxRedirectPage && wxAuth(meta.wxRedirectPage)) {
        return;
    }
    if (!from.matched ? .length) {
        meta.noFrom = true;
    }

    // if (!meta.wxworkType || meta.wxworkType == "default") {
    //   if (checkJumpCookieByWxpay(to, { isReplace: false, checkWXWork: true })) {
    //     return;
    //   }
    // }

    if (meta.needLogin && !PluginLogin.checkLogin()) {
        let {
            fullPath,
            name,
            params,
            query
        } = to;
        let loginQuery = {};
        if (fullPath) {
            loginQuery.next = fullPath;
        } else {
            loginQuery.nextJson = encodeURIComponent(
                JSON.stringify({
                    name,
                    params,
                    query,
                })
            );
        }
        log("checkLogin", loginQuery);
        next({
            name: "Login",
            query: loginQuery,
        });
        return false;
    }
    next();
});
router.afterEach((to, from) => {
    log("afterEach from", from.fullPath, " to:", to.fullPath, now(), to);
    if (isWX) {
        switch (to ? .meta ? .shareType) {
            case "custom":
                break;
            case "disable":
                hideShare();
                break;
            case "default":
            default:
                onShare();
        }
    }
});
router.onError(function(error, to, from) {
    logError("router.onError", formatError(error), "\nfrom", from, "\nto", to);
    message.showToast("网络异常，请检查后重试");
});

export default router;