import {
    wxh5AppId
} from "@/config.js";
import * as Api from "./api";
const paymentType = "WECHAT_JSAPI";
import {
    message
} from "plugins/message.js";

export class WxPay {
    constructor(orderId, {
        sucFun,
        failFun
    }) {
        this.paymentStatementView = null;
        this.sucFun = sucFun;
        this.failFun = failFun;
        this.getWxPaymentData(orderId);
    }
    initWeixinJSBridge() {
        // 检测支付环境中的 WeixinJSBridge
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener(
                    "WeixinJSBridgeReady",
                    this.onBridgeReady,
                    false
                );
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady);
                document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady);
            }
        } else {
            this.onBridgeReady();
        }
    }
    onBridgeReady() {
        const {
            nonceStr,
            paySign,
            prepayId,
            timestamp
        } =
        this.paymentStatementView;
        /*  eslint-disable */
        WeixinJSBridge.invoke(
            "getBrandWCPayRequest", {
                appId: wxh5AppId, //公众号名称，由商户传入
                timeStamp: timestamp, //时间戳，自1970年以来的秒数
                nonceStr, //随机串
                package: prepayId,
                signType: "MD5", //微信签名方式：
                paySign //微信签名
            },
            function(res) {
                // 支付成功
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                    //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    this.sucFun(3);
                }
                // 支付过程中用户取消
                if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    this.failFun(1);
                }
                // 支付失败
                if (res.err_msg == "get_brand_wcpay_request:fail") {
                    this.failFun(1);
                }
                /**
                 * 其它
                 * 1、请检查预支付会话标识prepay_id是否已失效
                 * 2、请求的appid与下单接口的appid是否一致
                 * */
                if (res.err_msg == "调用支付JSAPI缺少参数：total_fee") {
                    message.showToast(res.err_msg);
                }
            }
        );
    }
    getWxPaymentData = async (orderId) => {
        try {
            const paymentData = await Api.post("/pay/create", {
                paymentType,
                orderId
            });
            this.paymentStatementView = paymentData ? .paymentStatementView;
            this.initWeixinJSBridge();
        } catch (err) {
            console.error("getWxPaymentData", err);
            message.showToast(err ? .errMsg);
        }
    };
}

export default ({
    nonceStr,
    paySign,
    prepayId,
    timestamp
} = {}) => {
    return new Promise((resolve, reject) => {
        function onBridgeReady() {
            WeixinJSBridge.invoke(
                "getBrandWCPayRequest", {
                    appId: wxh5AppId, //公众号名称，由商户传入
                    timeStamp: timestamp, //时间戳，自1970年以来的秒数
                    nonceStr, //随机串
                    package: prepayId,
                    signType: "MD5", //微信签名方式：
                    paySign //微信签名
                },
                function(res) {
                    // 支付成功
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        resolve(true);
                    }
                    // 支付过程中用户取消
                    if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        reject("cancel");
                    }
                    // 支付失败
                    if (res.err_msg == "get_brand_wcpay_request:fail") {
                        reject(false);
                    }
                    /**
                     * 其它
                     * 1、请检查预支付会话标识prepay_id是否已失效
                     * 2、请求的appid与下单接口的appid是否一致
                     * */
                    if (res.err_msg == "调用支付JSAPI缺少参数：total_fee") {
                        message.showToast(res.err_msg);
                        reject(false);
                    }
                }
            );
        }
        // 检测支付环境中的 WeixinJSBridge
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    });
};