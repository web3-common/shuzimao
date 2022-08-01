import {
    getCookie,
    isWX,
    isWXWork
} from "utils";
import {
    wxh5AppId,
    pageAuthConfig
} from "config";
export function wxAuth(pageType) {
    if (!pageType) {
        console.warn("checkout pageType exist");
        return;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    if (
        isWXWork ||
        (isWX && userAgent.match(/wechatdevtools/i) != "wechatdevtools")
    ) {
        let href = location.href,
            openId = "";
        const {
            redirectUrl,
            infoCookieKey
        } = pageAuthConfig[pageType];
        if (!redirectUrl || !infoCookieKey) {
            console.warn(" checkout redirectUrl and infoCookieKey exist");
            return;
        }
        openId = getCookie(infoCookieKey);
        if (!openId) {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                location.href = [
                    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=",
                    wxh5AppId,
                    "&redirect_uri=",
                    encodeURIComponent(location.origin + redirectUrl),
                    "&response_type=code&scope=snsapi_userinfo&state=",
                    encodeURIComponent(href),
                    "#wechat_redirect",
                ].join("");
            }, 300);
            return true;
        }
    }
    return false;
}