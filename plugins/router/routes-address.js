const routeList = [{
        path: "/address/list",
        name: "AddressList",
        component: () =>
            import (
                /* webpackChunkName: "page-address" */
                "views/addressViews/addressList"
            ),
        meta: {
            needLogin: true,
            shareType: "disable",
        },
    },
    {
        path: "/address/editor/:addressId(\\d+)?",
        name: "EditorAddress",
        component: () =>
            import (
                /* webpackChunkName: "page-address" */
                "views/addressViews/editorAddress"
            ),
        meta: {
            needLogin: true,
            shareType: "disable",
        },
    },
];
export default routeList;