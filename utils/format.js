export function isUndef(value) {
    return typeof value === "undefined";
}

export function isBoolean(value, accpectStrBool = true) {
    if (accpectStrBool) {
        if (value === "true" || value === "false") return true;
    }
    return typeof value === "boolean";
}
export function isTrue(value) {
    return value === true || value === "true";
}
export function isFalse(value) {
    return value === false || value === "false";
}

export function isHexColor(value) {
    return /^#[0-9a-f]+$/i.test(value);
}

export const RegUrl = new RegExp(
    "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]"
);
export function isUrl(url) {
    if (typeof url != "string") return false;
    return !!url.match(RegUrl);
}

export function formatError(err) {
    try {
        if (!(err instanceof Error)) {
            return err;
        }
        let result = [];
        if (err.name) {
            result.push(err.name);
        }
        if (err.stack) {
            result.push(err.stack);
        }
        if (err.toString) {
            result.push(err.toString ? .());
        }
        return result.join("\n");
    } catch (err) {
        console.error("errorToMsg", err);
        return "";
    }
}

export function formatTime(date, format = "YYYY-MM-DD hh:mm:ss") {
    if (typeof format != "string") return false;
    if (!(date instanceof Date)) date = new Date(date);
    let times = {
        "M+": date.getMonth() + 1, //月份
        "D+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "S+": date.getMilliseconds(), //毫秒
        // "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    };
    if (/(Y+)/.test(format))
        format = format.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var regStr in times) {
        if (new RegExp("(" + regStr + ")").test(format))
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ?
                times[regStr] :
                ("00" + times[regStr]).substr(("" + times[regStr]).length)
            );
    }
    return format;
}

export function formatCountDown(second, formatLength = 3, divideSymbol = ":") {
    if (typeof second != "number") return "";
    var secondNumber = Math.floor(second);
    if (formatLength < 2) {
        return _fillCountDownResult([fillZero(secondNumber)]);
    }
    var minuteNumber = Math.floor(secondNumber / 60);
    secondNumber = secondNumber % 60;
    if (formatLength < 3) {
        return _fillCountDownResult([
            fillZero(minuteNumber),
            fillZero(secondNumber),
        ]);
    }
    var hourNumber = Math.floor(minuteNumber / 60);
    minuteNumber = minuteNumber % 60;
    if (formatLength < 4) {
        return _fillCountDownResult([
            fillZero(hourNumber),
            fillZero(minuteNumber),
            fillZero(secondNumber),
        ]);
    }
    var dayNumber = Math.floor(hourNumber / 24);
    hourNumber = hourNumber % 24;
    return _fillCountDownResult([
        fillZero(dayNumber),
        fillZero(hourNumber),
        fillZero(minuteNumber),
        fillZero(secondNumber),
    ]);

    function _fillCountDownResult(arr) {
        if (typeof divideSymbol == "string") return arr.join(divideSymbol);
        return arr;
    }
}

export function getNumber(num, defaultValue) {
    let _num = +num;
    if (typeof _num !== "number") {
        return defaultValue;
    }
    if (isNaN(_num)) {
        return defaultValue;
    }
    return _num;
}

export function clamp(num, min, max) {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

export function fillZero(num, len = 2) {
    if (num < 0) return "";
    let res = String(num);
    let currentLen = res.length;
    if (currentLen >= len) return res;
    let zeroStr = new Array(len - currentLen + 1).join("0");
    return zeroStr + res;
}

export function filterNumber(number) {
    return number.replace(/\D+/g, "");
}

//验证手机号
export function validMobile(mobile, autoFilter = true) {
    if (typeof mobile != "string") {
        mobile = String(mobile);
    }
    if (autoFilter) {
        mobile = filterNumber(mobile);
    }
    return /^1\d{10}$/.test(mobile);
}

export function formatMobile(mobile) {
    return mobile.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1 $2 $3");
}
//过滤手机号 为前3后4格式 如123****5678
export function filterMobile(mobile) {
    if (typeof mobile != "string") {
        mobile = String(mobile);
    }
    var len = mobile.length;
    var headerStr = mobile.substring(0, 3);
    var footerStr = mobile.substring(len - 4, len);
    var centerStr = [];
    centerStr.length = len - 3 - 4 + 1;
    centerStr = centerStr.join("*");
    return [headerStr, centerStr, footerStr].join("");
}
//格式化金额：以分为单位的钱数 改为 元 / 元.角分
export function formatPrice(num, hasUnit = false) {
    if (num === "" || isUndef(num)) return "";
    var yuan = Math.floor(num / 100);
    var fen = Math.floor(num) % 100;
    var result = [];
    result.push(yuan);
    result.push(".");
    result.push(fillZero(fen));
    if (hasUnit) {
        result.push("元");
    }
    return result.join("");
}

//验证身份证号码
export function validIdcard(idcard, autoUpperCase = true) {
    if (typeof idcard != "string") {
        idcard = String(idcard);
    }
    if (autoUpperCase) {
        idcard = idcard.toUpperCase();
    }
    return /^\d{17}[\dX]$/.test(idcard);
}
//格式化身份证号码
export function formatIdcard(idcard) {
    return idcard.replace(/^(.{6})(.{8})(.{4})$/, "$1 $2 $3");
}

export function compareVersion(v1, v2) {
    if (typeof v1 != "string" || typeof v2 != "string") return false;
    v1 = v1.split(".");
    v2 = v2.split(".");
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
        v1.push("0");
    }
    while (v2.length < len) {
        v2.push("0");
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i]);
        const num2 = parseInt(v2[i]);

        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }
    return 0;
}

export function formatAddress({
        province,
        city,
        county,
        address
    } = {},
    joinSymbol = " "
) {
    const result = [];
    province && result.push(province);
    if (city && province != city) result.push(city);
    if (county && county != city) result.push(county);
    address && result.push(address);
    return result.join(joinSymbol);
}
// 省略展示
export function charOmitShow(char, num) {
    if (!char) return "";
    let maxLen = num * 2;
    char = char
        .split("")
        .map((item) => {
            if (item.match(/[\u4e00-\u9fa5]/g)) {
                maxLen -= 2;
            } else {
                maxLen -= 1;
            }
            if (maxLen >= 0) {
                return item;
            }
        })
        .join("");
    if (maxLen < 0) {
        char += "...";
    }
    return char;
}