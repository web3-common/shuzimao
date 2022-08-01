let routes = [{
    path: "/activity/rush/:id+",
    name: "InvitePage",
    component: () =>
        import ( /* webpackChunkName: "page-activity" */ "views/activity/fission"),
    meta: {
        shareType: "custom",
        wxAuth: true,
        wxRedirectPage: "activity",
    },
}, ];

export default routes;