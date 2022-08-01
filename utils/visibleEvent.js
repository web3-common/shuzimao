/**
 * 测试机型
 *      ip12mini ios14.4 微信8.0.4
 *      huawei_mate20 android10 微信8.0.2
 *
 * ios下 home键和锁屏解锁只会触发 visibilityChangeEvent
 *      微信右上小圆钮触发 onPageStateChange 和 visibilityChangeEvent
 *      onPageStateChange:true 会在visibilityChangeEvent:!hidden 之后700+ms触发
 *      onPageStateChange-active 是 Boolean true false
 *
 * 安卓下 锁屏解锁只会触发 onPageStateChange
 *      home键和微信右上角触发 onPageStateChange 和 visibilityChangeEvent
 *      onPageStateChange:true 会在visibilityChangeEvent:!hidden 之后100ms左右触发
 *      onPageStateChange-active 是 String 'true' 'false'
 *      且安卓下多次绑定onPageStateChange 会相互覆盖
 *
 */
import {
    isAndroid,
    isWX
} from "./device";
import {
    strNow
} from "./time";
import {
    isTrue
} from "./format";
const HiddenProperty = (function() {
    if ("hidden" in document) return "hidden";
    if ("webkitHidden" in document) return "webkitHidden";
    if ("mozHidden" in document) return "mozHidden";
    return null;
})();

const VisibilityChangeEvent = HiddenProperty.replace(
    /hidden/i,
    "visibilitychange"
);

let eventCallbacks = new Map();

function _registerEvent() {
    if (isWX && isAndroid) {
        let wxBridgeReady = function() {
            window.WeixinJSBridge ? .on("onPageStateChange", ({
                active
            }) => {
                _log("onPageStateChange", active, strNow());
                for (let fn of eventCallbacks.values()) {
                    fn(isTrue(active));
                }
            });
        };
        if (!window.WeixinJSBridge ? .invoke) {
            document.addEventListener("WeixinJSBridgeReady", wxBridgeReady, false);
        } else {
            wxBridgeReady();
        }
    } else {
        document.addEventListener(VisibilityChangeEvent, () => {
            const isShow = checkPageShow();
            _log("visibilityChangeEvent", isShow, strNow());
            for (let fn of eventCallbacks.values()) {
                fn(isShow);
            }
        });
    }
}
let logCount = 50;

function _log() {
    let args = arguments;
    if (logCount <= 0) return false;
    logCount--;
    try {
        Array.prototype.unshift.call(args, "visibleEvent.js:");
    } finally {
        console.log.apply(console, args);
    }
}
_registerEvent();

let callbackId = 0;

function addEventCallback(fn) {
    let fnId = ++callbackId;
    eventCallbacks.set(fnId, fn);
    return fnId;
}

function removeEventCallback(id) {
    if (typeof id == "number") {
        if (!eventCallbacks.has(id)) return false;
        eventCallbacks.delete(id);
        return true;
    } else if (typeof id == "function") {
        for (let [fnId, fn] of eventCallbacks.entries()) {
            if (fn === id) {
                eventCallbacks.delete(fnId);
                return true;
            }
        }
    }
    return false;
}

function checkPageShow() {
    return !document[HiddenProperty];
}

export {
    VisibilityChangeEvent as visibilityChangeEvent,
    HiddenProperty as hiddenProperty,
    addEventCallback as onVisibleChange,
    removeEventCallback as offVisibleChange,
    checkPageShow as checkPageVisible,
};