import * as Api from "modules/api";

export default {
    install(app) {
        const globalProperties = app.config.globalProperties;
        globalProperties.$api = Api;
    },
};