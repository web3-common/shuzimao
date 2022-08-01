import {
    osVersion,
    isIOS,
    checkPageVisible,
    sleep,
    now,
    openLinkByATag as openLink,
} from "utils";
import store from "store";
import {
    createLog
} from "plugins/log";
const {
    log
} = createLog("modules/appTools");
import {
    iosAppScheme,
    androidScheme
} from "config";
const appScheme = isIOS ? iosAppScheme : androidScheme;

//跳转app首页
export function goAppHome() {
    let appHref = _addAppHrefShareChannel(appScheme);
    log("goAppHome:", appHref);
    openLink(appHref);
    return _checkOpenApp();
}
//跳转app商品详情页
export function goAppCollectionDetail(collectionId) {
    let appHref = `${appScheme}?collectionId=${collectionId}`;
    if (!isIOS || osVersion >= 9) {
        appHref = _addAppHrefShareChannel(appHref);
    }
    log("goAppCollectionDetail:", appHref);
    openLink(appHref);
    return _checkOpenApp();
}

//为app跳转schema链接增加分享渠道信息
function _addAppHrefShareChannel(appHref) {
    const _urlChannel = `shareChannel=${store.getters["share/channel"]}&userId=${store.getters["share/userId"]}`;
    return appHref
        .concat(appHref.indexOf("?") == -1 ? "?" : "&")
        .concat(_urlChannel);
}
//通过异步接口差值判断是否离开过当前页，离开则说明跳转成功
function _checkOpenApp() {
    return new Promise((resolve, reject) => {
        const startTime = now();
        sleep(20, 20).then(() => {
            // 循环20次*20ms 消耗的时间 明显大于页面在 前台消耗时间
            if (now() - startTime > 500 || !checkPageVisible()) {
                // 证明已经安装过app, 打开成功
                resolve();
            } else {
                reject();
            }
        });
    });
}