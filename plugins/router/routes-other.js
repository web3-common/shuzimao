import {
    debug,
    urlUserAgreement,
    urlPrivacyAgreement
} from "config";
let routes = [{
        path: "/login",
        name: "Login",
        component: require("views/other/login").default,
        meta: {
            shareType: "disable",
        },
    },
    {
        path: "/view/img/",
        name: "ViewImg",
        component: () =>
            import ( /* webpackChunkName: "page-view" */ "views/other/view-img.vue"),
        meta: {
            shareType: "disable",
        },
    },
    {
        path: "/view/html/",
        name: "ViewHtml",
        component: () =>
            import ( /* webpackChunkName: "page-view" */ "views/other/view-html.vue"),
        meta: {
            shareType: "disable",
        },
    },
    {
        path: "/view/agreement/user",
        name: "ViewUserAgreement",
        redirect: () => {
            return {
                name: "ViewHtml",
                query: {
                    src: encodeURIComponent(urlUserAgreement),
                    title: "服务协议",
                },
            };
        },
    },
    {
        path: "/view/agreement/privacy",
        name: "ViewPrivacyAgreement",
        redirect: () => {
            return {
                name: "ViewHtml",
                query: {
                    src: encodeURIComponent(urlPrivacyAgreement),
                    title: "个人信息保护政策",
                },
            };
        },
    },
    {
        path: "/app/detail/:collectionId(\\d+)",
        alias: "/detail/:collectionId(\\d+)",
        name: "Detail",
        component: () =>
            import ( /* webpackChunkName: "page-app" */ "views/application/detail"),
        meta: {
            shareType: "custom",
        },
    },
    {
        path: "/app/download",
        alias: "/download",
        name: "Download",
        component: () =>
            import ( /* webpackChunkName: "page-app" */ "views/application/download"),
    },
];
if (debug) {
    routes.push({
        path: "/test",
        name: "Test",
        component: () =>
            import ( /* webpackChunkName: "page-test" */ "views/other/test"),
        meta: {
            // needLogin: true,
            shareType: "custom",
        },
    });
}

export default routes;