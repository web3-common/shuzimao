import {
    checkJumpCookieByWxpay
} from "modules/wxsdk";
import {
    isWX,
    showWxpayModal
} from "utils";
const ROUTEMODULE = "collection";
const routeList = [{
        path: "/detail/:collectionId(\\d+)",
        name: "CollectionDetail",
        meta: {
            shareType: "custom",
        },
        component: () =>
            import (
                /* webpackChunkName: "page-collection" */
                "views/collectionViews/collectionDetail"
            ),
    },
    {
        path: "/collectionConfirm",
        name: "CollectionConfirm",
        component: () =>
            import (
                /* webpackChunkName: "page-collection" */
                "views/collectionViews/collectionConfirm"
            ),
        beforeEnter: (to, from, next) => {
            if (from ? .name === "AddressList") {
                to.query.from = "addressList";
            }
            if (checkJumpCookieByWxpay(to, {
                    isReplace: false
                })) return;
            if (!isWX) return showWxpayModal();
            next();
        },
        meta: {
            needLogin: true,
            shareType: "disable",
        },
    },
    {
        path: "/payResult",
        name: "PayResult",
        component: () =>
            import (
                /*webpackChunkName: "page-collection"*/
                "views/collectionViews/payResult"
            ),
        beforeEnter(to, from, next) {
            if (checkJumpCookieByWxpay(to)) return;
            if (!isWX) return showWxpayModal();
            next();
        },
        meta: {
            needLogin: true,
            shareType: "disable",
            wxAuth: true,
            wxRedirectPage: "pay",
        },
    },
];

export default (() => {
    return routeList.map((item) => {
        item.path = `/${ROUTEMODULE}${item.path}`;
        return item;
    });
})();