export const isDev = process.env.NODE_ENV == "development";
export const debug = false;
export const mock = debug && false;

export const routerBaseUrl = process.env.BASE_URL;

/** 微信相关设置 */
export const wechatAppId = "wx73f0866565691475"; //微信开放平台绑定app的appId
export const wxh5AppId = "wx0ac2715645918ac7"; //数字猫公众号appId
// export const wxh5AppId = "wxf1dd640373135fbb"; //绵白糖公众号appId
export const wxh5Username = "gh_2e2001b8071d"; //数字猫公众号原始id
export const wxappAppId = "wx3e710bb13a2ed013"; //数字猫小程序appId
export const wxappUsername = "gh_ea8d5d8df8b8"; //数字猫小程序原始id

/** 数字猫app相关设置 **/
// export const qqAppStoreUrl =
//   "http://a.app.qq.com/o/simple.jsp?pkgname=com.edusoho.kuozhi"; //应用宝

/* ios 应用商店 https://itunes.apple.com/cn/app/id1589439395   https://apps.apple.com/cn/app/{app_name}/id{Apple ID}*/
export const iosAppStoreUrl = "https://itunes.apple.com/cn/app/id1589439395";
export const iosAppStoreScheme =
    "itms-apps://itunes.apple.com/cn/app/id1589439395?mt=8";
// export const iosAppStoreUrl = "https://testflight.apple.com/join/GyCoIkaG";
export const iosAppScheme = "DigitalCat://"; //ios app scheme
export const iosAppLink = "https://arhello.sensetime.com/app/digitalCatiOS"; //iOS Universal Link

export const androidAppStoreUrl = "http://d.maps9.com/2cyr";
export const androidScheme = "sensetime://digitalcat/splash"; //android app scheme

/** 用户协议 */
export const urlUserAgreement =
    "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/agreement/userAgreement.html";
export const urlPrivacyAgreement =
    "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/agreement/privacy.html";

/** 友盟打点设置 */
export const umLogConfig = {
    enable: true || !isDev,
    appKey: "6225d6ce317aa877608488bf",
    debug,
};

/** 微信授权对应后端配置 */
export const pageAuthConfig = {
    pay: {
        redirectUrl: "/ar/digital/v2/wechat/webAuth",
        infoCookieKey: "DIGITAL_CAT_JSAPI",
    },
    activity: {
        redirectUrl: "/ar/digital/viral/mp/authorize",
        infoCookieKey: "WeChatUserInfo",
    },
};