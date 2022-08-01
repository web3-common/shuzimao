export const paymentType = "WECHAT_JSAPI";
export const payResultStatus = {
    loading: 0,
    success: 1,
    fail: 2,
    free: 3,
    other: 0,
};

export const pagePurchaseType = {
    normal: 0,
    free: 1,
};

export const homeJump = ({
    jumpType = 0,
    jumpId = "",
    jumpUrl = "",
    router,
} = {}) => {
    switch (jumpType) {
        case 0: //0:不跳转
            console.log("0:不跳转");
            return false;
        case 1: //1:跳转藏品集?? 没有藏品集页面
            // return Util.showDisableFunc.call(this);
            if (jumpId) {
                // 项目详情页
                router.push({
                    name: "CollectionDetail",
                    params: {
                        collectionId: jumpId,
                    },
                });
            }
            break;
        case 2: //2:跳转藏品
            if (jumpId) {
                router.push({
                    name: "CollectionDetail",
                    params: {
                        collectionId: jumpId,
                    },
                });
            }
            break;
        case 3: //3:跳转图片
            if (jumpUrl) {
                // 公共图片展示页
                router.push({
                    name: "ViewImg",
                    query: {
                        src: encodeURIComponent(jumpUrl),
                    },
                });
            }
            break;
        case 4: //4:跳转url
            if (jumpUrl) {
                location.href = jumpUrl;
            }
            break;
        default:
            if (!jumpUrl) return false;
            location.href = jumpUrl;
    }
};