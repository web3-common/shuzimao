import * as Api from "./api";
import Cookies from "js-cookie";
// import wx from "weixin-js-sdk";
let wx = null;
import {
    isWX,
    isWXWork,
    isIOS,
    wxVersion,
    deepEqual
} from "utils";
import {
    wxh5AppId,
    routerBaseUrl
} from "config";
import {
    createLog
} from "plugins/log";
const {
    log,
    error: logError
} = createLog("modules/wxsdk");
const WXPAY_COOKIE = "DIGITAL_CAT_JSAPI";
const hrefHome = (function() {
    if (!location.origin) {
        return location.href;
    }
    return location.origin + routerBaseUrl;
})();

let isWxsdkReady = undefined;
const wxsdkReadyCallbacks = [];
const wxsdkReadyFailbacks = [];
export function ready() {
    if (!isWX) return Promise.reject("not weixin");
    return new Promise((resolve, reject) => {
        if (typeof isWxsdkReady == "undefined") {
            wxsdkReadyCallbacks.push(resolve);
            wxsdkReadyFailbacks.push(reject);
        } else if (!isWxsdkReady) {
            reject();
        } else {
            resolve();
        }
    });
}

export function readyForOpenTag(success, fail) {
    ready()
        .then(() => {
            success();
            // 无法使用开放标签的错误原因，需回退兼容。仅无法使用开放标签，JS-SDK其他功能不受影响
            document.addEventListener("WeixinOpenTagsError", function(err) {
                logError(err);
                fail(err);
            });
        })
        .catch(fail);
}

let _lastShareMessage = null;
export const ShareDesc = {
    default: "探索数字文创无限可能",
    detail: "我发现了一份超棒的数字文创，快来看看吧！",
};
export function setShareMessage({
    title = "数字猫", // 分享标题
    desc = ShareDesc.default, // 分享描述
    link = hrefHome, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl = "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/h5-img/v1.0/share/logo-black.png", // 分享图标
} = {}) {
    let ShareMessage = {
        title,
        desc,
        link,
        imgUrl,
        complete: log,
    };
    if (!isWX) return Promise.reject("not weixin");
    //利用缓存，仅让最后一次分享设置生效
    if (deepEqual(_lastShareMessage, ShareMessage)) {
        return Promise.resolve("equal last");
    }
    log("setShareMessage", ShareMessage);
    _lastShareMessage = ShareMessage;
    return ready().then(() => {
        showShareMenus();
        wx ? .updateAppMessageShareData(_lastShareMessage);
        wx ? .updateTimelineShareData(_lastShareMessage);
        wx ? .onMenuShareWeibo(_lastShareMessage);
        //微信客户端6.7.2以下仅支持老接口
        if (wxVersion < 6.72) {
            wx ? .onMenuShareAppMessage(_lastShareMessage);
            wx ? .onMenuShareTimeline(_lastShareMessage);
            wx ? .onMenuShareQQ(_lastShareMessage);
            wx ? .onMenuShareQZone(_lastShareMessage);
        }
        if (isIOS) {
            _lastShareMessage = null;
        }
    });
}

//ios版本H5分享link可能不正确 https://developers.weixin.qq.com/community/develop/doc/0006a6bd2f8be0a15e7c6a32a5e400
//建议非必要页面隐藏分享按钮
let _isShowShareMenus = null;
const shareMenuList = [
    "menuItem:share:appMessage", //发送给朋友
    "menuItem:share:timeline", //分享到朋友圈
    "menuItem:share:qq", //分享到QQ
    "menuItem:share:weiboApp", //分享到Weibo
    "menuItem:share:facebook", //分享到FB
    "menuItem:share:QZone", //分享到 QQ 空间
];
export function showShareMenus() {
    if (_isShowShareMenus === true) return Promise.resolve("already");
    return ready().then(() => {
        wx ? .showMenuItems({
            menuList: shareMenuList,
            success: () => {
                _isShowShareMenus = true;
                log("showMenuItems", _isShowShareMenus);
            },
            complete: log,
        });
    });
}
export function hideShareMenus() {
    if (_isShowShareMenus === false) return Promise.resolve("already");
    return ready().then(() => {
        wx ? .hideMenuItems({
            menuList: shareMenuList,
            success: () => {
                _isShowShareMenus = false;
                log("hideMenuItems", _isShowShareMenus);
            },
            complete: log,
        });
    });
}

export {
    setShareMessage as onShare,
    showShareMenus as showShare,
    hideShareMenus as hideShare,
};

export function closeWindow() {
    wx ? .closeWindow();
}

(async function initWxsdk() {
    if (!isWX) return Promise.resolve("not weixin");
    try {
        // wx = await import("weixin-js-sdk");
        for (let i = 0; i < 2; i++) {
            try {
                await loadWeixinJssdk(i % 2 != 0);
            } catch (err) {
                logError("loadWeixinJssdk", err);
            }
            if (wx) break;
        }
        if (!wx) return Promise.resolve("no wxsdk");
        let res = await wxJssdkConfig();
        log("initWxsdk", res);
        log("wxVersion", wxVersion);
        isWxsdkReady = true;
        wxsdkReadyCallbacks.forEach((fn) => fn());
        wxsdkReadyCallbacks.length = null;
    } catch (err) {
        logError("initWxsdk", err);
        isWxsdkReady = false;
        wxsdkReadyFailbacks.forEach((fn) => fn());
        wxsdkReadyFailbacks.length = null;
    }
})();

/**
 * 异步加载微信jssdk文件
 * @param {Boolean} backupSource 是否使用备用地址 默认false
 * @returns wxJssdk;
 */
export function loadWeixinJssdk(backupSource = false) {
    return new Promise((resolve, reject) => {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = !backupSource ?
            "//res.wx.qq.com/open/js/jweixin-1.6.0.js" :
            "//res2.wx.qq.com/open/js/jweixin-1.6.0.js";
        document.body.appendChild(script);
        script.onload = () => {
            log("loadWeixinJssdk.onload", window.jWeixin);
            wx = window.jWeixin;
            resolve(window.jWeixin);
        };
        script.onerror = (err) => {
            logError.log("loadWeixinJssdk.onerror", err);
            reject(err);
        };
    });
}

//解决ios跳转路由后config签名失败问题：
//https://developers.weixin.qq.com/community/develop/doc/000ae2cb950808f90d8bc415551800
const CacheIosHref = location.href;
export function wxJssdkConfig() {
    if (!isWX) return Promise.reject("not weixin");
    return new Promise((resolve, reject) => {
        Api.post(
                "/wechat/signature", {
                    url: isIOS ? CacheIosHref : location.href,
                }, {
                    autoLoading: false,
                    checkLogin: false,
                }
            )
            .then((data) => {
                wx ? .ready((res) => {
                    log("wxJssdkConfig wx.ready", res);
                    resolve(res);
                });
                wx ? .error((err) => {
                    logError("wxJssdkConfig wx.error", err);
                    reject(err);
                });
                wx ? .config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
                    appId: wxh5AppId, // 必填，公众号的唯一标识
                    jsApiList: [
                        // "getNetworkType",
                        "closeWindow",
                        "updateAppMessageShareData",
                        "updateTimelineShareData",
                        "onMenuShareTimeline",
                        "onMenuShareAppMessage",
                        "onMenuShareQQ",
                        "onMenuShareWeibo",
                        "onMenuShareQZone",
                        "chooseWXPay",
                        "hideMenuItems",
                        "showMenuItems",
                    ],
                    openTagList: ["wx-open-launch-app"], // 获取开放标签权限
                    timestamp: data.timestamp,
                    nonceStr: data.noncestr,
                    signature: data.signature,
                });
            })
            .catch(reject);
    });
}

/**
 * 检查是否需要跳转微信网页授权流程
 * @param {Route} to 需要跳转的目标路径
 * @param {Boolean} isReplace 自动跳转是否用replace模式
 * @param {Boolean} autoJump 是否自动跳转
 * @returns {Boolean} 是否需要跳转
 */
export function checkJumpCookieByWxpay(
    to, {
        isReplace = true,
        autoJump = true,
        checkWXWork = false
    } = {}
) {
    if (!checkWXWork || !isWXWork) {
        if (!isWX || Cookies.get(WXPAY_COOKIE)) {
            return false;
        }
    }
    if (!autoJump) return true;
    // https://arhello.sensetime.com
    const host = location.origin;
    const h5PayUrl = (function() {
        if (to.href) return `${host}${to.href}`;
        if (to.fullPath) return `${host}${routerBaseUrl}${to.fullPath}`;

        //routerBaseUrl ： https://arhello.sensetime.com
        // id: 1470588018107627990
        let query = {
            collectionId:'1470588018107627990',
            preOrderId:'1',
        }

        const h5PayUrlQuerys = (function(query) {
            let queryStrs = [];
            for (let k in query) {
                queryStrs.push(`${k}=${encodeURIComponent(query[k])}`);
            }
            return queryStrs.join("&");
        })(to.query);
        
       const res =`collectionId=1470588018107627990&preOrderId=1`
        return `${host}${routerBaseUrl}${to.path}?${h5PayUrlQuerys}`;
    })();
    const apiAuthUrl = `${host}/ar/digital/v2/wechat/webAuth`;
    const wxCodeUrl = [
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=",
        wxh5AppId,
        "&redirect_uri=",
        encodeURIComponent(apiAuthUrl),
        "&response_type=code&scope=snsapi_base&state=",
        encodeURIComponent(h5PayUrl),
        "#wechat_redirect",
    ].join("");
    log(checkJumpCookieByWxpay, {
        h5PayUrl,
        apiAuthUrl,
        wxCodeUrl
    });
    if (isReplace && location.replace) {
        location.replace(wxCodeUrl);
    } else {
        location.href = wxCodeUrl;
    }
    return true;
}