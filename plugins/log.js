import {
    debug
} from "config";
import {
    useRoute
} from "vue-router";
export default {
    install(app) {
        let {
            log,
            error,
            warn
        } = createLog("app", Infinity, true);
        app.config.globalProperties.$log = log;
        app.config.globalProperties.$logErr = error;
        app.config.globalProperties.$logWarn = warn;
        this.log = log;
        this.logErr = error;
        this.logWarn = warn;
    },
};

const enableLog = debug || typeof window.eruda !== "undefined";

export function createLog(prefix = "", maxLog = 100, withRoute = false) {
    let logCount = maxLog;

    function log() {
        if (!enableLog || logCount < 0) return false;
        if (--logCount <= 0) {
            console.warn(prefix, "reach max log");
        }
        let args = arguments;
        try {
            let _prefix = prefix;
            if (withRoute) {
                const route = useRoute();
                let routeName = route ? .meta ? .logName || route ? .name || route ? .path;
                if (routeName) {
                    _prefix += "-" + routeName;
                }
            }
            _prefix += ":";
            Array.prototype.unshift.call(args, _prefix);
        } finally {
            console.log.apply(console, args);
        }
    }

    function error() {
        if (!enableLog) return false;
        let args = arguments;
        try {
            Array.prototype.unshift.call(args, prefix);
        } finally {
            console.error.apply(console, args);
        }
    }

    function warn() {
        if (!enableLog || logCount < 0) return false;
        if (--logCount <= 0) {
            console.warn(prefix, "reach max log");
        }
        let args = arguments;
        try {
            Array.prototype.unshift.call(args, prefix);
        } finally {
            console.warn.apply(console, args);
        }
    }

    return {
        log,
        error,
        warn,
        logCount,
    };
}

export function createGroup(name) {
    function start() {
        console.group(name);
    }

    function end() {
        console.groupEnd(name);
    }
    return [start, end];
}