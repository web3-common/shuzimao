import {
    umLogConfig
} from "config";
import {
    createLog
} from "plugins/log";
const {
    log,
    error: logError
} = createLog("modules/umLog");
const commonEventParams = {};
const beforeInitEventList = [];
let isInit = false;

export function init({
    appKey,
    debug
} = {}) {
    return new Promise((resolve, reject) => {
        window.aplus_queue = window.aplus_queue || [];
        setMetaInfo("appKey", appKey);
        setMetaInfo("DEBUG", debug);
        setMetaInfo("aplus-idtype", "openid");
        const script = document.createElement("script");
        script.async = false;
        script.id = "beacon-aplus";
        document.head.append(script);
        script.onload = () => {
            log("init.onload", window.aplus);
            resolve(script);
            let timerId = setInterval(() => {
                if (window.aplus_queue instanceof Array) {
                    return false;
                }
                clearInterval(timerId);
                isInit = true;
                beforeInitEventList.forEach((event) => {
                    pushEvent(event.name, event.params, event.action);
                });
                beforeInitEventList.length = 0;
            }, 100);
        };
        script.onerror = (err) => {
            logError("init.onerror", err);
            reject(err);
        };
        script.src = `https://d.alicdn.com/alilog/mlog/aplus/203467608.js`;
    });
}
init(umLogConfig);

export function setMetaInfo(key, value) {
    if (!key || typeof key != "string") return false;
    if (!Array.isArray(window.aplus_queue)) {
        window.aplus_queue = window.aplus_queue || [];
    }
    window.aplus_queue.push({
        action: "aplus.setMetaInfo",
        arguments: [key, value],
    });
    return true;
}

export function pushEvent(name, params, action) {
    if (!umLogConfig.enable || !name || typeof name != "string") return false;
    // log("pushEvent", name, params, action);
    if (!isInit || !Array.isArray(window.aplus_queue)) {
        beforeInitEventList.push({
            name,
            params,
            action,
        });
        return false;
    }
    let _params = Object.assign({}, commonEventParams);
    let _type = "CLK";
    if (typeof params == "object") {
        Object.assign(_params, params);
    } else if (typeof params == "string") {
        _type = params;
    }
    if (typeof action == "string") {
        _type = action;
    }
    log("pushEvent.aplus_queue", name, _type, _params);
    window.aplus_queue.push({
        action: "aplus.record",
        arguments: [name, _type, _params],
    });
    return true;
}

export function addEventParams(params) {
    if (!params || typeof params != "object") return false;
    for (let key in params) {
        addEventParam(key, params[key]);
    }
    return true;
}

export function addEventParam(key, value) {
    if (!key || typeof key != "string") return false;
    if (
        typeof value != "number" &&
        typeof value != "string" &&
        typeof value != "boolean"
    )
        return false;
    commonEventParams[key] = value;
    return true;
}

export function removeEventParam(key) {
    if (!(key in commonEventParams)) return false;
    delete commonEventParams[key];
    return true;
}