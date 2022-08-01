import {
    createLog
} from "plugins/log";
const {
    error: logError
} = createLog("modules/localStorage");
export function getStorage(name, {
    type = "json"
}) {
    try {
        let value = localStorage ? .getItem(name);
        if (!value) return null;
        if (type == "json") {
            return JSON.parse(value);
        } else if (type == "number") {
            return Number(value);
        }
    } catch (err) {
        logError("getStorage", name, err);
        return null;
    }
}

export function setStorage(name, data, {
    type = "json"
}) {
    try {
        if (type == "json") {
            data = JSON.stringify(data);
        } else if (typeof data != "string") {
            data = String(data);
        }
        localStorage ? .setItem(name, data);
    } catch (err) {
        logError("setStorage", name, err);
    }
}

export function removeStorage(name) {
    try {
        localStorage ? .removeItem(name);
    } catch (err) {
        logError("removeStorage", name, err);
    }
}

export function cleanAllStorage() {
    try {
        localStorage ? .clear();
    } catch (err) {
        logError("cleanAllStorage", err);
    }
}

/**
 * 创建store存储方法组
 * @param {*} name 存储名称
 * @param {*} type 存储类型，
 *  json: 自动JSON.parse/stringify JSON格式
 *  number: 自动Number化存储值
 *  string: String类型，不做格式转变
 * @returns {Functions}
 *  getStorage
 *  setStorage
 *  removeStorage
 */
export default function createStorage(name, {
    type = "json"
} = {}) {
    if (!name) return {};
    return {
        getStorage: () => {
            return getStorage(name, {
                type
            });
        },
        setStorage: (data) => {
            setStorage(name, data, {
                type
            });
        },
        removeStorage: () => {
            removeStorage(name);
        },
    };
}