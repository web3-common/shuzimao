import {
    onMounted,
    onBeforeUnmount,
    onActivated
} from "vue";
import {
    debounce
} from "utils";
export function useScrollBehavior(domRef, {
    wait = 100
} = {}) {
    if (!domRef) return false;
    let dom = null;
    let scrollTop = 0;
    const onScroll = debounce(function() {
        scrollTop = dom ? .scrollTop || 0;
    }, wait);
    onMounted(() => {
        dom = domRef.value;
        if (!dom) return false;
        dom.addEventListener("scroll", onScroll);
    });
    onActivated(() => {
        if (!dom) return false;
        dom.scrollTop = scrollTop;
    });
    onBeforeUnmount(() => {
        if (!dom) return false;
        dom.removeEventListener("scroll", onScroll);
    });
}