const toString = Object.prototype.toString;
const valueOf = Object.prototype.valueOf;
/**
 * 比较两个对象的值是否相等
 * from https://github.com/epoberezkin/fast-deep-equal.git
 * MIT License
 */
function equal(a, b) {
    if (a === b) return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;

        var length, i, keys;
        if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length) return false;
            for (i = length; i-- !== 0;) {
                if (!equal(a[i], b[i])) return false;
            }
            return true;
        }

        if (a instanceof Map && b instanceof Map) {
            if (a.size !== b.size) return false;
            for (i of a.entries()) {
                if (!b.has(i[0])) return false;
            }
            for (i of a.entries()) {
                if (!equal(i[1], b.get(i[0]))) return false;
            }
            return true;
        }

        if (a instanceof Set && b instanceof Set) {
            if (a.size !== b.size) return false;
            for (i of a.entries())
                if (!b.has(i[0])) return false;
            return true;
        }

        if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
            length = a.length;
            if (length != b.length) return false;
            for (i = length; i-- !== 0;)
                if (a[i] !== b[i]) return false;
            return true;
        }

        if (a.constructor === RegExp) {
            return a.source === b.source && a.flags === b.flags;
        }
        if (a.valueOf !== valueOf) {
            return a.valueOf() === b.valueOf();
        }
        if (a.toString !== toString) {
            return a.toString() === b.toString();
        }

        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0;) {
            if (!hasOwnProp(b, keys[i])) return false;
        }
        for (i = length; i-- !== 0;) {
            var key = keys[i];
            if (!equal(a[key], b[key])) return false;
        }
        return true;
    }

    if (a === null || b === null) return a === b;
    // true if both NaN, false otherwise
    return a !== a && b !== b;
}

/**
 * 深拷贝
 * from https://github.com/jsmini/clone.git
 * MIT License
 */
function clone(x) {
    if (!isClone(x)) return x;

    const t = type(x);

    let res;

    if (t === "array") {
        res = [];
        for (let i = 0; i < x.length; i++) {
            // 避免一层死循环 a.b = a
            res[i] = x[i] === x ? res : clone(x[i]);
        }
    } else if (t === "object") {
        res = {};
        for (let key in x) {
            if (hasOwnProp(x, key)) {
                // 避免一层死循环 a.b = a
                res[key] = x[key] === x ? res : clone(x[key]);
            }
        }
    }

    return res;
}

function type(x, strict = false) {
    strict = !!strict;

    // fix typeof null = object
    if (x === null) {
        return "null";
    }

    const t = typeof x;

    // 严格模式 区分NaN和number
    if (strict && t === "number" && isNaN(x)) {
        return "nan";
    }

    // number string boolean undefined symbol
    if (t !== "object") {
        return t;
    }

    let cls;
    let clsLow;
    try {
        cls = toString.call(x).slice(8, -1);
        clsLow = cls.toLowerCase();
    } catch (e) {
        // ie下的 activex对象
        return "object";
    }

    if (clsLow !== "object") {
        if (strict) {
            // 区分NaN和new Number
            if (clsLow === "number" && isNaN(x)) {
                return "NaN";
            }
            // 区分 String() 和 new String()
            if (clsLow === "number" || clsLow === "boolean" || clsLow === "string") {
                return cls;
            }
        }
        return clsLow;
    }

    if (x.constructor == Object) {
        return clsLow;
    }

    // Object.create(null)
    try {
        // __proto__ 部分早期firefox浏览器
        if (Object.getPrototypeOf(x) === null || x.__proto__ === null) {
            return "object";
        }
    } catch (e) {
        // ie下无Object.getPrototypeOf会报错
    }

    // function A() {}; new A
    try {
        const cname = x.constructor.name;

        if (typeof cname === "string") {
            return cname;
        }
    } catch (e) {
        // 无constructor
    }

    // function A() {}; A.prototype.constructor = null; new A
    return "unknown";
}

function extend(target, ...sourceList) {
    // 深拷贝
    if (typeof target !== "object") {
        throw new TypeError("extend target param must is object");
    }

    for (let i = 0; i < sourceList.length; i++) {
        const source = sourceList[i];
        for (let name in source) {
            const src = target[name];
            const copy = source[name];

            //避免无限循环
            if (target === copy) {
                continue;
            }

            // 非可枚举属性
            if (!hasOwnProp(source, name)) {
                continue;
            }

            let copyIsArr;
            if (copy && (isObject(copy) || (copyIsArr = isArray(copy)))) {
                let clone;
                if (copyIsArr) {
                    clone = src && isArray(src) ? src : [];
                } else {
                    clone = src && isObject(src) ? src : {};
                }
                target[name] = extend(clone, copy);
            } else if (typeof copy !== "undefined") {
                target[name] = copy;
            }
        }
    }

    return target;
}

// 仅对对象和数组进行深拷贝，其他类型，直接返回
function isClone(x) {
    const t = type(x);
    return t === "object" || t === "array";
}

function hasOwnProp(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function isObject(x) {
    return type(x) == "object";
}

function isArray(x) {
    return type(x) == "array";
}

export {
    clone as deepClone,
    equal as deepEqual,
    type as deepType,
    extend as deepExtend,
};