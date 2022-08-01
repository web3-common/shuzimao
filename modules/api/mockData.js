/* eslint-disable no-unused-vars */
import {
    mock
} from "config";
import {
    now,
    randomInt
} from "utils";
let mockDatas = new Map([
    // ["/login/sendCode", noDataResult],
    // ["/login/validateCode", noDataResult],
    // ["/homePage/all", homePageAllResult],
    // ["/project/detail", projectDetailResult],
    // ["/collection/detail", collectionDetailResult],
    // ["/user/detail", userDetailResult],
    // ["/nft/listByUser", nftListResult],
    // ["/nft/detail", nftDetailResult],
    // ["/oss/auth", ossAuthResult],
    // ["/order/listByUser", orderListResult],
    // ["/order/detail", orderDetailResult],
]);

export function has(url) {
    if (!mock) return false;
    return mockDatas.has(url);
}
export function get(url) {
    if (!mock) return null;
    return mockDatas.get(url);
}

const img1 =
    "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v2.0/bg-get-success-backup1126.png";
const img2 =
    "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v2.0/bg-get-success.png";
const img3 =
    "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v1.3/home/bg_project.png";

function noDataResult() {
    return {
        code: 200,
        msg: "成功",
    };
}

function homePageAllResult() {
    return {
        code: 200,
        msg: "成功",
        data: {
            bannerList: [{
                    sourceUrl: img1,
                    jumpUrl: img2,
                    jumpType: 3,
                },
                {
                    sourceUrl: img2,
                    jumpUrl: "/pages/home/collection-detail?productId=1464075245882179584",
                },
            ],
            hotSaleList: [{
                    sourceName: "YHD 宇航羊0:不跳转",
                    sourceUrl: img1,
                    authorId: 1,
                    sourceCreator: "羊很大",
                    creatorType: 0,
                    showStatus: 0,
                    creatorIcon: img1,
                    jumpUrl: img2,
                    jumpId: "1464075245882179584",
                    jumpType: 0,
                },
                {
                    sourceName: "YHD 宇航羊1:跳转藏品集",
                    sourceUrl: img2,
                    authorId: 1,
                    sourceCreator: "羊很大",
                    creatorType: 0,
                    showStatus: 0,
                    creatorIcon: img1,
                    jumpId: "1464075245882179584",
                    jumpType: 1,
                },
                {
                    sourceName: "YHD 宇航羊2:跳转藏品",
                    sourceUrl: img1,
                    authorId: 1,
                    sourceCreator: "羊很大",
                    creatorType: 0,
                    showStatus: 0,
                    creatorIcon: img1,
                    jumpId: "1464075245882179584",
                    jumpType: 2,
                },
                {
                    sourceName: "YHD 宇航羊3:跳转图片",
                    sourceUrl: img3,
                    authorId: 1,
                    sourceCreator: "羊很大",
                    creatorType: 0,
                    showStatus: 0,
                    creatorIcon: img1,
                    jumpUrl: img2,
                    jumpType: 3,
                },
                {
                    sourceName: "YHD 宇航羊4:跳转url",
                    sourceUrl: img1,
                    authorId: 1,
                    sourceCreator: "羊很大",
                    creatorType: 0,
                    showStatus: 0,
                    creatorIcon: img1,
                    jumpUrl: "https://arhello-dev.sensetime.com/sensecat/marker/IPO_NFT.html",
                    jumpType: 4,
                },
            ],
        },
    };
}

function projectDetailResult() {
    function getItem() {
        return {
            collectionId: "1464075245882179584",
            collectionName: "YHD 宇航羊",
            collectionUrl: img1,
            shareBgUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/collection/1/ipo_xuanyao.png?Expires=1641506524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=2m7MLeqQf14K1oodVazIrycZrL4%3D",
            author: "羊很大",
            authorId: 1,
            authorType: 0,
            authorAvatar: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/home/hot/icon2.png?Expires=1641506524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=YDiFEfvWKRAV9BQeLQfm2R5zo6A%3D",
            collectionStoryUrl: img3,
            collectionStoryDesc: "YHD宇航羊原型源自商汤吉祥物“黑羊”，寓意着“原创”、“极致”，也象征着商汤在未来宇宙间，不断探索前行的精神。",
            price: "9900",
            level: Math.floor(3 * Math.random()),
            sellState: 0,
            beginTime: 1641709692000,
            purchaseType: 0,
            castLogicalPrefix: "ST121702RA",
            distributionNum: "99",
            surplusNum: "99",
            restrictionNum: 1,
            status: 5,
            systemTime: 1641463324285,
            activeStatus: 5,
            showStatus: 3,
        };
    }
    let collectionList = [];
    for (let i = 0; i < 10; i++) {
        collectionList.push(getItem());
    }
    return {
        code: 200,
        msg: "成功",
        data: {
            projectId: "1",
            projectName: "测试藏品集名称",
            description: "这里是项目简介，这里是项目简介，这里是项目简介，这里是项目简介这里是项目简介，这里是项目简介这里是项目简介，这里是项目简介这里是项目简介，这里是项目简介这里是项目简介",
            projectUrl: img3,
            author: "羊很大",
            authorId: 1,
            authorType: 0,
            authorAvatar: img1,
            collectionList: collectionList,
        },
    };
}

function collectionDetailResult() {
    return {
        code: 200,
        msg: "成功",
        data: {
            showStatus: randomInt(0, 4), //0:敬请期待 1:即将开售 2:热卖中 3:已售罄
            beginTime: now() + 15 * 1000,
            endTime: now() + 30 * 1000,
            systemTime: now(),
            collectionId: "1516763519171731456",
            collectionName: "敦煌测试",
            collectionUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcatAdmin/resource_v1_test/dev/manageUser1/collection/1650459527500/main.jpg?Expires=1650555348&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=da1lkbXzJgb9dVt8Le%2Bwv4UGF6Y%3D",
            shareBgUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcatAdmin/resource_v1_test/dev/manageUser1/collection/1650459530986/share.png?Expires=1650555348&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=UnFkvC9GYVkipOgp9y8A%2Foi%2BV00%3D",
            displayContentList: [{
                contentId: "1464081082486874444",
                contentName: "敦煌",
                detailModelWeb: "1501818680848154624",
                detailModelIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/collection_bihua_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=2tPVd9IwtX4A5L5mZTw%2FP1JgpRo%3D",
                detailModelAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/collection_bihua_android_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=mjoHMesyChyDSibKsbztqN1rPkY%3D",
                displayVideoUrl: "",
                displayModelWeb: "1501818680848154624",
                displayModelIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/nftbs_bihua_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=d6XkMv1JDdAVo42WFYeQk6oxa9E%3D",
                displayModelAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/nftbs_bihua_android_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=hx0coNbppA1P4HyE2CqD%2FHQW1Ns%3D",
                arModelWeb: "",
                arModelIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/nftar_bihua_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=q%2BC2bA3Gt%2F5fF8MwxIPVPvhNh78%3D",
                arModelAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/nftar_bihua_android_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=rvX35qpPYZK8YAtks41U2z6PTRk%3D",
                previewModelWeb: "",
                previewModelIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/preview_bihua_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=9IOUWHfQY5NBywzQa8QBKq7v%2BWw%3D",
                previewModelAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/preview_bihua_android_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=l3vJzBeT%2FzYG2KFVX2yP3bUtMao%3D",
                arSdkIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/arsdk_bihua_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=dZ6B8%2BkiD%2BfwJ47%2Bra4oRaNuq%2F0%3D",
                arSdkAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/arsdk_bihua_v2.0.0.ab?Expires=1650555007&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=dZ6B8%2BkiD%2BfwJ47%2Bra4oRaNuq%2F0%3D",
                createTime: "2022-01-06T09:56:30.000+00:00",
                updateTime: "2022-03-28T12:03:59.000+00:00",
                activeStatus: 0,
                ab_version: "2.0.0",
            }, ],
            author: "敦煌文创",
            authorId: "3",
            authorType: 0,
            authorAvatar: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/author/icon3.png?Expires=1650555348&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=XX8QATsT2Kwo8HeJyHgMQUFAZvw%3D",
            collectionStoryUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcatAdmin/resource_v1_test/dev/manageUser1/collection/1650459541117/story.jpg?Expires=1650555348&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=1lpB9XekBYbcP1foZaYCCGc3hfI%3D",
            collectionStoryDesc: "敦煌",
            price: "19900",
            level: 1,
            sellState: 0,
            purchaseType: 0,
            castLogicalPrefix: "ST2022042001SR",
            distributionNum: "100",
            surplusNum: "98",
            restrictionNum: 1,
            status: 2,
            activeStatus: 2,
        },
    };
}

function userDetailResult() {
    return {
        code: 200,
        msg: "成功",
        data: {
            userId: "1",
            usernickName: "啦啦啦",
            userIcon: img1,
            phone: "18325426323",
            realNameAuthentication: true,
            userDigitalAddress: "",
        },
    };
}

function nftListResult() {
    return {
        code: 200,
        msg: "成功",
        data: {
            orderList: [{
                orderId: "1469236101464981504",
                orderNumber: "1121000428644504",
                nftId: "9223372036855005187",
                collectionId: "1464078750856511488",
                userId: "1469236100793892864",
                logicPayment: "0",
                realPayment: "0",
                orderStatus: 2,
                cancelReason: "",
                createTime: "2021-12-10 17:22:38",
                automaticAbandonTime: 1639129058000,
                collectionDetail: {
                    collectionId: "1464078750856511488",
                    collectionName: "一同见证里程碑时刻",
                    collectionUrl: img1,
                    shareBgUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/collection/1/ipo_xuanyao.png?Expires=1641925377&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=0dCyHcJ6AcXisna7XFQWYV7WfyA%3D",
                    author: "商汤科技",
                    authorType: 0,
                    authorAvatar: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/home/hot/icon1.png?Expires=1641925377&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=2YgQv6AK36z5Lryz2OTxGwCIzew%3D",
                    collectionStoryUrl: img3,
                    collectionStoryDesc: "数字猫将商汤成立七年来的重大时刻集锦，制作成为商汤上市纪念数字文创；感恩，这七年一路走来。",
                    price: "0",
                    level: 1,
                    sellState: 0,
                    beginTime: 1640746800000,
                    endTime: 1670574600000,
                    purchaseType: 1,
                    castLogicalPrefix: "ST121701SR",
                    distributionNum: "6600",
                    surplusNum: "0",
                    restrictionNum: 1,
                    status: 2,
                    systemTime: 1641882760378,
                },
                purchaseType: 1,
                prepayId: "",
                prepayCreateTime: "2021-12-10 17:22:38",
                piece: "4",
            }, ],
        },
    };
}

function nftDetailResult() {
    return {
        code: 200,
        msg: "成功",
        data: {
            collectionDetail: {
                collectionId: "1464078750856511488",
                collectionName: "一同见证里程碑时刻",
                collectionUrl: img1,
                shareBgUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/collection/1/ipo_xuanyao.png?Expires=1641926116&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=PL6vkcTK5z3TNh7j7x5RyPrkisk%3D",
                displayContentList: [{
                    contentId: "1464081082486882304",
                    contentName: "上市纪念",
                    contentType: 1,
                    modelType: 1,
                    modelUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/collection/1/ipo.glb?Expires=1641926116&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=vMooS%2Fk1T8wqatd6AcvgKfnaTD0%3D",
                    videoUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/collection/1/ipo.mp4?Expires=1641926116&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=um%2F1np7wQl%2Bil2QKPIRtcxeasDs%3D",
                    envUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/collection/1/env.jpg?Expires=1641926116&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=K%2B8Na7W4DuokPkayiouQOFbX%2FXA%3D",
                    jumpUrl: "https://arhello-dev.sensetime.com/sensecat/marker/IPO_NFT.html?enable_eruda=1&from=nft",
                    activeStatus: 0,
                }, ],
                author: "商汤科技",
                authorType: 0,
                authorAvatar: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation/dev/home/hot/icon1.png?Expires=1641926116&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=tJZT0PPxj3donrtHRH17uf2ShJE%3D",
                collectionStoryUrl: img3,
                collectionStoryDesc: "数字猫将商汤成立七年来的重大时刻集锦，制作成为商汤上市纪念数字文创；感恩，这七年一路走来。",
                price: "0",
                level: 1,
                sellState: 0,
                beginTime: 1640746800000,
                endTime: 1670574600000,
                purchaseType: 1,
                castLogicalPrefix: "ST121701SR",
                distributionNum: "6600",
                surplusNum: "0",
                restrictionNum: 1,
                status: 2,
                systemTime: 1641882916907,
            },
            nftId: "9223372036855005187",
            castHash: "51cb6ef690e02fcd82bd92846b4dc51fa86ca3ea",
            collectorName: "",
            creatorName: "商汤数字猫",
            authTime: "2021-12-10 17:22:59",
            piece: "4",
            distributionNum: "6600",
            transfers: {
                code: 0,
                message: "ok",
                statusText: "SUCCESS",
                data: [{
                        from: "",
                        to: "wddc51816nyb9z183gsszzjmp4qkk9hfs4ks3my7rqphm37hkjbb7bmfz5:ed25519",
                        timestamp: 1639123203872,
                        nfid: "9223372036855005187",
                        baseNFId: "9223372036855005184",
                        txHash: "zm41sbskwmqk6cx07c85j0qxr66f7eebm34rms7172hnvhyxaa41",
                    },
                    {
                        from: "wddc51816nyb9z183gsszzjmp4qkk9hfs4ks3my7rqphm37hkjbb7bmfz5:ed25519",
                        to: "f75qgcm5ykg9zjjnz6c66z76fkgcsapjcbe8k9hpgcma5ww4xwkg6y6363:ed25519",
                        timestamp: 1639128158968,
                        nfid: "9223372036855005187",
                        baseNFId: "9223372036855005184",
                        txHash: "mv6xgbm480trmgjhyr4jx57gg6v57z2jf6a3map8ph9rxcsje1w1",
                    },
                ],
            },
        },
    };
}

function ossAuthResult() {
    return {
        code: 200,
        msg: "成功",
        data: {
            endpoint: "oss-cn-hangzhou.aliyuncs.com",
            bucketName: "arhello-gift",
            accessKeyId: "STS.NUV1wPCagbpLQPCkNTgSjFJuh",
            accessKeySecret: "BfUHk4qqCPRTr2m84S7gSVh1ZV2grWU9hSGr5Ws99HrE",
            accessToken: "CAISnQN1q6Ft5B2yfSjIr5bjes3krr5G1bKnU3byj04Ba9xGqY/eijz2IHFOfndhB+wasfg2lW9X6/gSlqV0UIRuQkrKbMRf44gPeb4Jj02G6aKP9rUhpMCPhQHxYkeJWqawDsz9SNTCAO/PD3nPii50x5bjaDymRCbLGJaViJlhHOR1Ow6jdmhpCctxLAlvo9N4UHzKLqSVLwLNiGjdB1YK3w1nkjFb6L+j+sSG9gG8/Frh0b08rYPrPr25a9VtJJ5lT+qt2Ot/esim1zVLuTxL77tRhq5J8ivcxMr/ZWNc+BKbKeHZ38RyJQtiHMgAFrVDseL3mI9H2L/anJ+lzA1Wb6MHEXbWXoCtxM/DXeyoOMp+cL/hOHnX5dmDM5jz9B4/bGhcOA5UPMF4cCQsVEJzGmCdaM3X8VvRMAC4UPrHguNk2IB1wlHs+p+FJlaTYc3AintBYsRhMBl5Z0RMgzCxSMJcLVwQKWEALq2OUIB+YCpZra7VpgDIXkVitCoG5aegNq2K5v9DMNSgAc8YgZBybY5Gvm8uSEQnpF9gSrfPHhqAARqp2vq1s/JBOHX+BQhtZtQ8nEDENawPPsa6fvQ1Y17iyQONUchGcN4PoEqVCrP/73NQtpXKrH+UpIfWCD5eHMWLiME/IHPMzWGOv5t10Vu80mJOe5SsubJZ9p4ENtaslzzWKHSla0cbNOD/adOU9Fpb9ipqoe/QnPBvNMR41PdC",
            applyPath: "marker_admin/user/dev/s123456789",
        },
    };
}

function orderListResult({
    status
} = {}) {
    //订单状态, 0:待支付, 1:结算中, 2:已完成, 3:手动取消, 4:超时自动取消
    let _count = 0;
    const maxCountSecond = 10;
    let now = Date.now();

    function createOrderItem(orderStatus = 0) {
        _count++;
        return {
            orderId: "1469236101464981504" + _count,
            orderNumber: "1121000428644504",
            nftId: "9223372036855005187",
            collectionId: "1464078750856511488",
            userId: "1469236100793892864",
            purchaseType: 0,
            logicPayment: "19900",
            realPayment: "19900",
            automaticAbandonTime: now + Math.floor(maxCountSecond * 1000 * Math.random()),
            orderStatus: orderStatus, //订单状态, 0:待支付, 1:支付完成, 2:已完成, 3:手动取消, 4:超时自动取消, 5:后台取消
            cancelReason: "取消原因",
            createTime: "2022-01-23 12:34:56",
            shipmentStatus: 0, //物流状态0-未发货，1-已发货，2-已收货
            expressCompanyCode: "abcd123123",
            expressNumber: "1231234abc",
            // "prepayCreateTime": "2022-01-23 12:34:56",
            // "prepayId": "11210004286445041234",
            collectionDetail: {
                collectionId: "1464075245882179584",
                collectionName: "YHD 宇航羊" + _count,
                collectionUrl: img2,
                author: "羊很大",
                authorType: 0,
                authorAvatar: img1,
                collectionStoryUrl: img3,
                collectionStoryDesc: "YHD宇航羊原型源自商汤吉祥物“黑羊”，寓意着“原创”、“极致”，也象征着商汤在未来宇宙间，不断探索前行的精神。",
                price: "9900",
                beginTime: 1641709692000,
                endTime: 0,
                level: 0, //藏品等级, 0:R, 1:SR
                sellState: 0, //售卖(领取)状态 0:已开始 1:未开始
                purchaseType: 0,
                distributionNum: 0,
                restrictionNum: 0,
                surplusNum: 99,
                status: 5, //藏品状态 0:新创建, 1:开始铸造, 2:铸造完成, 3:已删除
                playingType: 0,
                playingMethodRule: "玩法规则",
                systemTime: now,
                showStatus: 0, //展示状态 0:敬请期待 1:即将开售 2:热卖中 3:已售罄
                activeStatus: 2, //藏品状态, 0:草稿 1:新创建, 2:已上架 3:已下架 4:已删除 5:已售罄
                displayContentList: [{
                    contentId: "1464081082486883304",
                    contentName: "1464081082486883304",
                    detailModelWeb: 11,
                    detailModelIosUrl: "22",
                    detailModelAndroidUrl: "33",
                    displayVideoUrl: "44",
                    displayModelWeb: 55,
                    displayModelIosUrl: "66",
                    displayModelAndroidUrl: "1010",
                    arModelWeb: 88,
                    arModelIosUrl: "99",
                    arModelAndroidUrl: "77",
                    createTime: "2022-01-06T09:56:30.000+00:00",
                    updateTime: "2022-01-06T09:56:30.000+00:00",
                    activeStatus: 0,
                }, ],
            },
            systemTime: now,
        };
    }
    let list = [];
    if (Math.random() > 0.0) {
        let maxNum = Math.floor(randomInt(5, 7));
        for (let i = 0; i < maxNum; i++) {
            let _status =
                (status === undefined ? Math.floor(4 * Math.random()) : status) % 4;
            list.push(createOrderItem(_status));
        }
    }
    return {
        code: 200,
        msg: "成功",
        data: {
            orderList: list,
            systemTime: now,
        },
    };
}

function orderDetailResult() {
    return {
        code: 200,
        msg: "成功",
        data: {
            orderId: "1509011781924765696",
            orderStatus: 0,
            automaticAbandonTime: now() + 10 * 1000,
            systemTime: now(),
            collectionId: "1470588018107625673",
            userId: "1482261187654709248",
            purchaseType: 0,
            logicPayment: "1",
            realPayment: "1",
            cancelReason: "订单超时",
            createTime: "2022-03-30 11:37:01",
            shipmentStatus: 0,
            collectionDetail: {
                collectionId: "1470588018107625673",
                collectionName: "敦煌九色鹿",
                collectionUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/main.jpg?Expires=1648666496&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=iIyxq5bhiaBirRlOKtNsB9sDYFY%3D",
                shareBgUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/share.jpg?Expires=1648666496&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=C9Hfru40xEiBfGCcXGYoaOv8LQw%3D",
                displayContentList: [{
                    contentId: "1464081082486874444",
                    contentName: "敦煌",
                    detailModelWeb: "1501818680848154624",
                    detailModelIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/collection_bihua_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=6BBJganZrIM%2Fg4HckThoBkA%2Fyo4%3D",
                    detailModelAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/collection_bihua_android_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=bGITd4HK9e1o3B9401D1zdeB9jM%3D",
                    displayVideoUrl: "",
                    displayModelWeb: "1501818680848154624",
                    displayModelIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/nftbs_bihua_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=2vOmLpYfQlCoaJXn8yy9aMjN04o%3D",
                    displayModelAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/nftbs_bihua_android_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=hu7bgc2VQvjJxhX8pYAdm%2BpNmZI%3D",
                    arModelWeb: "",
                    arModelIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/nftar_bihua_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=z8nopJB6eya4dZEUGgTWqewKFVA%3D",
                    arModelAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/nftar_bihua_android_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=QstOs4om5TlrT90Ff1%2BskecILT8%3D",
                    previewModelWeb: "",
                    previewModelIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/preview_bihua_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=QM6rB2mPrXrT9AZ%2FJltehZNtCx4%3D",
                    previewModelAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/preview_bihua_android_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=qId0S4bqEWNQ77H61Gl8tcqqn1s%3D",
                    arSdkIosUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/arsdk_bihua_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=h979nue7asL8ItoV%2Fm8i%2B6HRljk%3D",
                    arSdkAndroidUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/model/arsdk_bihua_v2.0.0.ab?Expires=1648666524&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=h979nue7asL8ItoV%2Fm8i%2B6HRljk%3D",
                    createTime: "2022-01-06T09:56:30.000+00:00",
                    updateTime: "2022-03-28T12:03:59.000+00:00",
                    activeStatus: 0,
                    ab_version: "2.0.0",
                }, ],
                author: "敦煌文创",
                authorId: "3",
                authorType: 0,
                authorAvatar: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/author/icon3.png?Expires=1648666525&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=z4rCkFnVmOTA03BUBGUcxfYfk1A%3D",
                collectionStoryUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/operation_v2/dev/collection/3/story.jpg?Expires=1648666496&OSSAccessKeyId=LTAI4G6GaoEnXctM7CqhkKHn&Signature=6%2BmQv6JiPqNoybXs%2FeD%2BdN3st5Y%3D",
                collectionStoryDesc: "敦煌九色鹿",
                price: "1",
                level: 0,
                sellState: 0,
                beginTime: "1646121600000",
                endTime: "1672473600000",
                purchaseType: 0,
                castLogicalPrefix: "ST22030101RA",
                distributionNum: "1000",
                surplusNum: "804",
                restrictionNum: 100,
                status: 2,
                systemTime: "1648623325485",
                activeStatus: 2,
                showStatus: 2,
            },
            digitalOrderAddressView: {
                id: "782",
                orderId: "1509011781924765696",
                userId: "1482261187654709248",
                province: "北京",
                city: "北京",
                county: "海淀区",
                address: "test test",
                name: "文一凡",
                phone: "15811541190",
                createTime: "2022-03-02 03:09:26",
                updateTime: "2022-03-02 03:09:26",
            },
            expressNumber: "",
            expressInfo: {
                courier: "",
                courierPhone: "13121230061",
                logo: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v1.3/home/default-image.png",
                expName: "中通快递",
                number: "75856289055166",
                deliverystatus: 3,
                list: [{
                        status: "【北京市】 快件已在 【北京中关村二部】 签收, 签收人: 家门口, 如有疑问请电联:（13121230061）, 投诉电话:（010-67440954）, 您的快递已经妥投。风里来雨里去, 只为客官您满意。上有老下有小, 赏个好评好不好？【请在评价快递员处帮忙点亮五颗星星哦~】",
                        time: "2022-02-24 08:41:17",
                    },
                    {
                        status: "【北京市】 【北京中关村二部】 的王磊（13121230061） 正在第1次派件, 请保持电话畅通,并耐心等待（95720为中通快递员外呼专属号码，请放心接听）",
                        time: "2022-02-24 07:04:04",
                    },
                    {
                        status: "【北京市】 快件已经到达 【北京中关村二部】",
                        time: "2022-02-24 07:01:07",
                    },
                    {
                        status: "【北京市】 快件离开 【北京】 已发往 【北京中关村二部】",
                        time: "2022-02-24 02:47:18",
                    },
                    {
                        status: "【北京市】 快件已经到达 【北京】",
                        time: "2022-02-24 00:03:12",
                    },
                    {
                        status: "【金华市】 快件离开 【义乌中转部】 已发往 【北京】",
                        time: "2022-02-21 22:20:17",
                    },
                    {
                        status: "【金华市】 快件已经到达 【义乌中转部】",
                        time: "2022-02-21 22:17:03",
                    },
                    {
                        status: "【金华市】 快件离开 【义乌新科】 已发往 【北京】",
                        time: "2022-02-21 20:38:02",
                    },
                    {
                        status: "【金华市】 【义乌新科】（0579-82402509、0579-85960530） 的 袁广（13428054266） 已揽收",
                        time: "2022-02-21 20:24:21",
                    },
                ],
                takeTime: "2天12小时16分",
                issign: 1,
                type: "ZTO",
                updateTime: "2022-02-24 08:41:17",
            },
        },
    };
}