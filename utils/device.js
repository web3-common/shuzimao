import MobileDetect from "mobile-detect";
var getMobileDetect = (function() {
    var userAgent = window.navigator.userAgent;
    var mobileDetect = new MobileDetect(userAgent);
    return function() {
        return mobileDetect;
    };
})();
export const mobileDetect = getMobileDetect();

export const isAndroid = mobileDetect.os() === "AndroidOS";

export const isIOS = mobileDetect.os() === "iOS";

export const osVersion = (function() {
    if (isAndroid) return mobileDetect.version("Android") || "";
    if (isIOS) return mobileDetect.version("iOS") || "";
    return null;
})();

//从微信7.0.0开始，可以通过判断userAgent中包含miniProgram字样来判断小程序web-view环境
export const isMiniProgram = mobileDetect.match("miniProgram");

//企业微信
export const isWXWork = mobileDetect.match("wxwork");

//普通微信H5环境
export const isWX = !isMiniProgram && !isWXWork && mobileDetect.is("WeChat");
export const isQQ = mobileDetect.match(/QQ\/[0-9]/i);

export const wxVersion = mobileDetect.version("MicroMessenger") || "";

export const isMobile = isAndroid || isIOS;

export const mobileType = (function() {
    const ua = window.navigator.userAgent.toLowerCase();
    var isIphone = /iphone/i.test(ua);
    var isHuawei = /huawei/i.test(ua);
    var isHonor = /honor/i.test(ua);
    var isOppo = /oppo/i.test(ua);
    var isOppoR15 = /pacm00/i.test(ua);
    var isVivo = /vivo/i.test(ua);
    var isXiaomi = /mi\s/i.test(ua);
    var isXiaomi2s = /mix\s/i.test(ua);
    var isRedmi = /redmi/i.test(ua);
    var isSamsung = /sm-/i.test(ua);

    if (isIphone) {
        return "iphone"; // 苹果
    } else if (isHuawei || isHonor) {
        return "huawei"; // 华为
    } else if (isOppo || isOppoR15) {
        return "oppo"; // oppo
    } else if (isVivo) {
        return "vivo"; //vivo
    } else if (isXiaomi || isRedmi || isXiaomi2s) {
        return "xiaomi"; // 小米
    } else if (isSamsung) {
        return "samsung"; // 三星
    } else {
        return "unknow";
    }
})();

export const getWindowInfo = (function() {
    let mobileSize;
    return function(useCache = true) {
        if (mobileSize && useCache) return mobileSize;
        mobileSize = getSize();
        return mobileSize;
    };

    function getSize() {
        let pixelRatio = window.devicePixelRatio;
        let windowWidth =
            window.screen.width || window.innerWidth || document.body.clientWidth;
        let windowHeight =
            window.screen.height || window.innerHeight || document.body.clientHeight;
        return {
            pixelRatio,
            windowWidth,
            width: windowWidth,
            windowHeight,
            height: windowHeight,
        };
    }
})();
window.addEventListener("resize", () => getWindowInfo(false));

export function calcPx(value, windowWidth = getWindowInfo().width) {
    let size = (value * windowWidth) / 1080;
    size = Math.round(size * 1000) / 1000;
    return size + "px";
}