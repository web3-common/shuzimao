import axios from "axios";
import * as Crypto from "../rsa";
import * as Mock from "./mockData";
import {
    deepExtend,
    sleep,
    isUndef
} from "utils";
import {
    ErrorCode,
    ErrMsg
} from "./const";
import store from "store";
import {
    createLog,
    createGroup
} from "plugins/log";
import {
    message
} from "plugins/message";
store.commit("login/getStorageToken");
store.commit("activity/getStorageToken");
const HttpStatusSucc = /^2\d{2}$/;
const DefaultAxiosConfig = {
    method: "get",
    baseURL: "/ar/digital/v2",
    headers: {
        OriginalSource: "H5",
        // AppVersion: "1.0.0", //添加AppVeresion 接口不返回模型数据
        // Authorization: store.getters["login/token"],
    },
    timeout: 15000,
    responseType: "json", //'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
};
const DefaultRequestConfig = {
    //自定义设置
    autoLoading: true,
    onlyReturnJsonData: true,
    defaultFail: true,
    checkLogin: true,
    isApi: true,
    rsaEncryptList: [],
    rsaDecryptList: [],
};
const {
    log,
    error: logError
} = createLog("mobules/api", 1000);

export const axiosClient = axios.create(DefaultAxiosConfig);
export default axiosClient;
export function request({
    url,
    method = "get",
    data,
    config
} = {}) {
    if (Mock ? .has(url)) {
        let mockData = Mock.get(url)(data);
        log("mockData", mockData);
        return new Promise((resolve) => {
            setTimeout(() => {
                let [_start, _end] = createGroup("request:" + url);
                _start();
                log("config", config);
                log("mockData", mockData);
                _end();
                resolve(mockData ? .data);
            });
        });
    }
    let _config = deepExtend({}, DefaultRequestConfig, config);
    let minRequestTime = _config.minRequestTime;
    if (
        _config.autoLoading &&
        (isUndef(minRequestTime) || minRequestTime === null)
    ) {
        minRequestTime = 500;
    }
    if (_config.autoLoading) {
        message.showLoading();
    }
    if (!(minRequestTime > 0)) {
        return axiosClient
            .request({
                url,
                method,
                [method == "get" ? "params" : "data"]: data,
                ..._config,
            })
            .finally(() => {
                if (_config.autoLoading) {
                    message.hideLoading();
                }
            });
    } else {
        return new Promise((resolve, reject) => {
            let pRequst = axiosClient.request({
                url,
                method,
                [method == "get" ? "params" : "data"]: data,
                ..._config,
            });
            let pSleep = sleep(minRequestTime);
            Promise.allSettled([pRequst, pSleep]).then((res) => {
                if (_config.autoLoading) {
                    message.hideLoading();
                }
                let requstResult = res[0];
                if (requstResult ? .status == "rejected") {
                    reject(requstResult ? .reason);
                } else {
                    resolve(requstResult ? .value);
                }
            });
        });
    }
}
export function get(url, data, config) {
    return request({
        url,
        method: "get",
        data,
        config,
    });
}
export function post(url, data, config) {
    return request({
        url,
        method: "post",
        data,
        config,
    });
}

/**
 * http请求
 * axios通用请求配置参数：
 * @param {String} url 请求url
 * @param {String} baseURL 请求前缀，默认 '/ar/digital/v2'
 * @param {String} method 请求类型，默认 'get'
 * @param {String} responseType 请求类型，服务器响应的数据类型，默认 'json'
 *                              可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
 * 自定义请求配置参数：
 * @param {Boolean} onlyReturnJsonData = true //是否只返回data数据，仅在dataType=json生效
 * @param {Boolean} autoLoading = true //是否显示加载图标
 * @param {Number} minRequestTime  //最小请求时间（单位毫秒），autoLoading开启时默认500，否则0
 * @param {Boolean} defaultFail = true //是否使用默认错误处理
 * @param {Boolean} checkLogin = true //是否需要登录token
 * @param {Array[String]} rsaEncryptList = [] //需要RSA加密的字段
 * @param {Array[String]} rsaDecryptList = [] //需要RSA解密的字段
 * @returns {成功} 默认返回服务器data值，应该是json格式
 * @returns {失败}
 * {
 *  errCode, //错误码
 *  errMsg,  //错误描述
 *  response //原始axios返回值
 * }
 */
axiosClient.interceptors.request.use((config) => {
    if (location.href.indexOf("/activity/") !== -1) {
        config.baseURL = "/ar/digital/viral";
        config.checkLogin = false;
    }
    if (config.checkLogin && !store.getters["login/isLogin"]) {
        return Promise.reject({
            config,
            response: {
                status: ErrorCode.LOCAL_TOKEN_EXPIRE,
                text: "登录已过期",
            },
        });
    }
    if (config.autoLoading) {
        message.showLoading();
    }
    if (location.href.indexOf("/activity/") !== -1) {
        config.headers.Authorization = store.getters["activity/token"];
    } else {
        config.headers.Authorization = store.getters["login/token"];
    }

    _encryptRequestConfig(config);
    return config;
});
axiosClient.interceptors.response.use(
    (response) => {
        const reqConfig = response ? .config;
        const resCode = response ? .status;
        const resHeader = response ? .headers;
        const apiRes = response ? .data;
        const url = response ? .request ? .responseURL || reqConfig ? .url;

        let [_start, _end] = createGroup("api.request:" + url);
        _start();
        log("api.request config: ", reqConfig);
        log("api.request success for url:", url);
        log("api.request traceId:", resHeader ? .["digitalcat-trace-id"]);
        if (typeof apiRes == "string" && apiRes.length > 100) {
            log(
                "api.request response:",
                Object.assign({}, response, {
                    data: apiRes.substring(0, 100)
                })
            );
        } else {
            log("api.request response:", response);
        }
        _end();

        if (!HttpStatusSucc.test(resCode)) {
            //如果http失败，直接返回失败
            return Promise.reject({
                errCode: resCode,
                errMsg: ErrMsg,
                response,
            });
        }

        if (!reqConfig.isApi) {
            return apiRes;
        }

        if (!HttpStatusSucc.test(apiRes ? .code)) {
            let errCode = apiRes ? .code;
            let errMsg = apiRes ? .msg || apiRes ? .errMsg;
            //服务器返回非2XX，接口请求失败
            if (!reqConfig ? .defaultFail) {
                //非默认失败处理逻辑直接返回错误
                return Promise.reject({
                    errCode,
                    errMsg,
                    response,
                });
            }
            switch (+errCode) {
                //根据errCode值判断错误逻辑
                case ErrorCode.UNAUTHORIZED: //10002, //未授权
                case ErrorCode.INVALID_TOKEN: //10003, //Token过期
                case ErrorCode.ACCOUNT_INVALID: //10005, //账户无效，非法调用
                case ErrorCode.USER_INVALID: //10006, //未查找到此用户
                case ErrorCode.USER_NEED_SWITCHOVER: //10011, //请重新登录指定小程序
                case ErrorCode.USER_LOGIN_LOSE_OPENID: //10013, //用户缺少openId
                    store.commit("login/cleanToken");
                    return Promise.reject({
                        errCode: ErrorCode.LOCAL_TOKEN_EXPIRE,
                        errMsg,
                        response,
                    });
                default:
                    return Promise.reject({
                        errCode,
                        errMsg,
                        response,
                    });
            }
        }

        //成功逻辑处理
        let apiResData = apiRes ? .data;
        if (apiResData ? .userId && resHeader) {
            //接口返回登录信息需要存储登录状态
            const Authorization =
                resHeader ? .["authorization"] || resHeader ? .["Authorization"];
            if (Authorization) {
                if (location.href.indexOf("/activity/") !== -1) {
                    store.commit("activity/setToken", {
                        userId: apiResData ? .userId,
                        token: Authorization,
                        expireHour: 2,
                    });
                } else {
                    store.commit("login/setToken", {
                        userId: apiResData ? .userId,
                        token: Authorization,
                    });
                    store.dispatch("user/getUserData");
                }
            }
        }

        //非json返回格式，直接返回response.data
        if (
            reqConfig ? .responseType !== "json" ||
            reqConfig ? .onlyReturnJsonData === false
        ) {
            return apiRes;
        }
        _decryptRequestData(apiResData, reqConfig);
        return apiResData;
    },
    (error) => {
        const response = error ? .response;
        const request = error ? .request || response ? .request;
        const reqConfig = error ? .config || response ? .config;
        const url = request ? .responseURL || reqConfig ? .url;
        const resCode = response ? .status || ErrorCode.NETWORK_ERROR;
        const resHeader = response ? .headers;

        let [_start, _end] = createGroup("api.request_fail:" + url);
        _start();
        log("api.config:", reqConfig);
        log("api.traceId:", resHeader ? .["digitalcat-trace-id"]);
        log("api.response:", response);
        logError(error);
        _end();

        let errMsg = ErrMsg;
        if (resCode == ErrorCode.LOCAL_TOKEN_EXPIRE && response ? .text) {
            errMsg = response ? .text;
        }
        return Promise.reject({
            errCode: resCode,
            errMsg,
            response,
            error,
        });
    }
);
/**
 * 尝试根据config中的rsaEncryptList字段，加密接口请求数据data
 *  rsaEncryptList字段key可以用“.”子对象
 *  例如：['a.b.c', 'abc'] 分别加密data['a']['b']['c']、data['abc']
 */
function _encryptRequestConfig(config) {
    if (!config.rsaEncryptList ? .length) return false;
    let _rsaEncryptData = {};
    let _data = config.method == "get" ? config.params : config.data;
    config.rsaEncryptList.forEach((key) => {
        let originValue = _tryEncryptDataKey(_data, key);
        if (originValue !== null) {
            _rsaEncryptData[key] = originValue;
        }
    });
    config._rsaEncryptData = _rsaEncryptData;
    return true;
}

function _tryEncryptDataKey(data, key) {
    try {
        let _data = data;
        let originValue = null;
        key.split(".").forEach((_k) => {
            let _value = _data[_k];
            if (
                (typeof _value == "object" && _value !== null) ||
                Array.isArray(_value)
            ) {
                _data = _value;
                return;
            }
            if (typeof _value == "undefined") return;
            originValue = _value;
            _data[_k] = Crypto.encrypt(_value);
        });
        return originValue;
    } catch (err) {
        logError("_tryEncryptDataKey", err);
        return null;
    }
}

/**
 * 尝试根据config中的rsaDecryptList字段，解密接口返回数据data
 *  data可以是数组，则对每一个元素解密
 *  rsaDecryptList字段key可以用“.”子对象
 *  例如：['a.b.c', 'abc'] 分别解密data['a']['b']['c']、data['abc']
 */
function _decryptRequestData(data, config) {
    if (!config.rsaDecryptList ? .length) {
        return false;
    }
    let _rsaDecryptData = {};
    if (Array.isArray(data)) {
        data.forEach((_data, index) => {
            config.rsaDecryptList.forEach((key) => {
                let originValue = _tryDecryptDataKey(_data, key);
                if (originValue !== null) {
                    _rsaDecryptData[`${index}.${key}`] = originValue;
                }
            });
        });
    } else {
        config.rsaDecryptList.forEach((key) => {
            let originValue = _tryDecryptDataKey(data, key);
            if (originValue !== null) {
                _rsaDecryptData[key] = originValue;
            }
        });
    }
    config._rsaDecryptData = _rsaDecryptData;
    return true;
}

function _tryDecryptDataKey(data, key) {
    try {
        let _data = data;
        let originValue = null;
        key.split(".").forEach((_k) => {
            let _value = _data[_k];
            if (typeof _value == "string") {
                originValue = _value;
                _data[_k] = Crypto.decrypt(_value, false);
            } else if (typeof _value == "object" && _value !== null) {
                _data = _value;
            }
        });
        return originValue;
    } catch (err) {
        logError("_tryDecryptRequestData", err);
        return null;
    }
}