import message from "plugins/message";
import {
    copyClipboardData
} from "./copyClipboard";
import {
    ErrorCode,
    ErrMsg
} from "const";
//浏览器环境支付提示
export function showWxpayModal({
    cancelFn,
    link = location.href
} = {}) {
    message.showModal({
        content: "抱歉，数字猫暂不支持浏览器购买，您可以复制链接到微信中打开",
        confirmText: "复制链接",
        cancelText: "先看看",
        showCancel: true,
        btnCls: "st-large",
        async success({
            confirm,
            cancel
        }) {
            if (confirm) {
                let res = await copyClipboardData(link);
                message.showToast(res ? "链接已复制到您的剪贴板哦" : "复制失败");
            } else if (cancel) {
                cancelFn ? .();
            }
        },
    });
}

//
export function showNetErrRefreshModal(err, next) {
    const errMsg = err ? .errMsg || ErrMsg;
    if (err ? .errCode == ErrorCode.NETWORK_ERROR) {
        message.showModal({
            title: errMsg,
            confirmText: "刷新",
            success({
                confirm
            } = {}) {
                if (confirm) {
                    return next();
                }
            },
        });
    } else {
        message.showToast(errMsg);
    }
}