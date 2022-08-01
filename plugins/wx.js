import * as WX from "modules/wxsdk";
import {
    isWX
} from "utils";

export default {
    install(app) {
        if (!isWX) return false;
        app.config.globalProperties.$wx = WX;
    },
};