import {
    now,
    debounce
} from "utils";
import {
    pushEvent
} from "modules/umLog";
import {
    UmPageTypes
} from "const";
import {
    onActivated,
    onDeactivated,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";

export function useUmPageLog(pageType) {
    if (!_checkPageType(pageType)) {
        console.warn("czc.pageStart unknown pageType:", pageType);
        return false;
    }
    let lastStartTime = null;
    const pageStart = debounce(() => {
        const _now = now();
        if (lastStartTime && _now > lastStartTime + 100) {
            pageEnd();
        }
        lastStartTime = _now;
    }, 200); //节流函数防止相邻事件冲突
    const pageEnd = debounce(() => {
        if (!lastStartTime) {
            return false;
        }
        pushEvent("page_viewtime", {
            pageType: String(pageType),
            time: (now() - lastStartTime) / 1000,
        });
        lastStartTime = null;
    }, 200);
    onBeforeMount(pageStart);
    onBeforeUnmount(pageEnd);
    //处理keepAlive
    onActivated(pageStart);
    onDeactivated(pageEnd);
}

function _checkPageType(pageType) {
    return Object.values(UmPageTypes).indexOf(pageType) != -1;
}