import {
    ref,
    toRef,
    reactive,
    readonly
} from "vue";
import {
    getWindowInfo,
    calcPx
} from "utils";

const NavBarHeightNum = 138;
const TabBarHeightNum = 163;

const windowInfo = reactive(getWindowInfo());
const windowInfoReadonly = readonly(windowInfo);
window.addEventListener("resize", () => {
    let newSize = getWindowInfo(true);
    if (newSize.windowWidth != windowWidth.value) {
        navBarHeight.value = calcPx(NavBarHeightNum);
        tabBarHeight.value = calcPx(TabBarHeightNum);
    }
    for (let k in newSize) {
        windowInfo[k] = newSize[k];
    }
});

const pixelRatio = toRef(windowInfoReadonly, "pixelRatio");
const windowWidth = toRef(windowInfoReadonly, "windowWidth");
const windowHeight = toRef(windowInfoReadonly, "windowHeight");
const navBarHeight = ref(calcPx(NavBarHeightNum));
const tabBarHeight = ref(calcPx(TabBarHeightNum));

export function useWindowInfo() {
    return {
        pixelRatio,
        windowWidth,
        windowHeight,
        navBarHeight,
        tabBarHeight,
    };
}

export default useWindowInfo;