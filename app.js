import {
    createApp
} from "vue";
import App from "./App.vue";

import component from "plugins/component";
import directive from "plugins/directive";
import http from "plugins/http";
import log from "plugins/log";
import login from "plugins/login";
import message from "plugins/message";
import router from "plugins/router";
import store from "plugins/store";
import wx from "plugins/wx";
import "assets/style/reset.css";
import "assets/style/public.css";
import "assets/style/common.less";

const app = createApp(App);
app
    .use(component)
    .use(directive)
    .use(http)
    .use(log)
    .use(login)
    .use(message)
    .use(router)
    .use(store)
    .use(wx)
    .mount("#app");

console.log(location.href);