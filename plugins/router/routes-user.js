export default [{
        path: "/user",
        name: "User",
        meta: {
            needLogin: true,
            keepAlive: true,
            shareType: "disable",
        },
        component: () =>
            import ( /* webpackChunkName: "page-user" */ "views/user/my"),
    },
    {
        path: "/user/blockchain",
        name: "UserBlockChain",
        meta: {
            needLogin: true,
            shareType: "disable",
        },
        component: () =>
            import ( /* webpackChunkName: "page-user" */ "views/user/block-chain"),
    },
    {
        path: "/order/list",
        name: "OrderList",
        meta: {
            needLogin: true,
            shareType: "disable",
        },
        component: () =>
            import ( /* webpackChunkName: "page-order" */ "views/order/list"),
    },
    {
        path: "/order/detail/:id(\\d+)",
        name: "OrderDetail",
        meta: {
            needLogin: true,
            shareType: "disable",
        },
        component: () =>
            import ( /* webpackChunkName: "page-order" */ "views/order/detail"),
    },
];