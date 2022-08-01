import {
    createApp
} from "vue";
import {
    createUUID
} from "utils/random.js";
import Modal from "components/message/modal.vue";
import Toast from "components/message/toast.vue";
import Loading from "components/message/loading.vue";

export class Message {
    constructor({
        wrapper
    } = {}) {
        this.wrapper = wrapper;
        this.init();
    }
    init() {
        if (!this.wrapper) {
            this.wrapper = document.createElement("div");
            this.wrapper.className = `message-wrapper-${createUUID()}`;
            document.body.appendChild(this.wrapper);
        }
        this.modalBox = this.createModal();
        this.toastBox = this.createToast();
        this.loadingBox = this.createLoading();
    }
    createModal() {
        var domModalBox = document.createElement("div");
        domModalBox.className = `modal-wrapper-${createUUID()}`;
        this.wrapper.appendChild(domModalBox);
        let template = createApp(Modal, {});
        return template.mount(domModalBox);
    }
    createToast() {
        var domModalBox = document.createElement("div");
        domModalBox.className = `toast-wrapper-${createUUID()}`;
        this.wrapper.appendChild(domModalBox);
        let template = createApp(Toast, {});
        return template.mount(domModalBox);
    }
    createLoading() {
        var domModalBox = document.createElement("div");
        domModalBox.className = `loading-wrapper-${createUUID()}`;
        this.wrapper.appendChild(domModalBox);
        let template = createApp(Loading, {});
        return template.mount(domModalBox);
    }

    /**
     * 显示模态对话框
     * @param {String} title: 提示的标题
     * @param {String} content: 提示的内容
     * @param {Boolean} mask: 是否显示透明蒙层，防止触摸穿透
     * @param {Boolean} showCancel: 是否显示取消按钮
     * @param {String} cancelText: 取消按钮的文字，最多 4 个字符
     * @param {String} cancelColor: 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串
     * @param {String} confirmText: 确认按钮的文字，最多 4 个字符
     * @param {String} confirmColor: 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
     * @param {Function} success: 点击按钮的回调函数
     *          {Boolean} confirm: 为 true 时，表示用户点击了确定按钮
     *          {Boolean} cancel: 为 true 时，表示用户点击了取消
     */
    showModal(config) {
        if (typeof config == "string") {
            config = {
                title: config,
            };
        }
        return this.modalBox.show(config);
    }

    /**
     * 显示消息提示框
     * @param {String} title: 提示的内容
     * @param {Number} duration: 提示延迟时间（ms）
     * @param {Boolean} mask: 是否显示透明蒙层，防止触摸穿透
     * @param {Function} success: 提示消失回调
     */
    showToast(config) {
        if (typeof config == "string") {
            this.toastBox.show({
                title: config
            });
        } else {
            this.toastBox.show(config);
        }
    }
    hideToast() {
        this.toastBox.hide();
    }
    /**
     * 显示消息提示框
     * @param {Number} duration: 提示延迟时间（ms）
     * @param {Boolean} mask: 是否显示透明蒙层，防止触摸穿透
     * @param {Function} success: 提示消失回调
     */
    showLoading(config) {
        if (typeof config == "number") {
            this.loadingBox.show({
                duration: config
            });
        } else {
            this.loadingBox.show(config);
        }
    }
    /**
     * 隐藏消息提示框
     * @param {Boolean} removeCallback: 是否取消之前的结束回调
     */
    hideLoading(config) {
        this.loadingBox.hide(config);
    }
}
export const message = new Message();

export default {
    install(app) {
        let globalProperties = app.config.globalProperties;

        globalProperties.$showModal = this.showModal;
        globalProperties.$showToast = this.showToast;
        globalProperties.$hideToast = this.hideToast;
        globalProperties.$showLoading = this.showLoading;
        globalProperties.$hideLoading = this.hideLoading;
    },
    showModal: message.showModal.bind(message),
    showToast: message.showToast.bind(message),
    hideToast: message.hideToast.bind(message),
    showLoading: message.showLoading.bind(message),
    hideLoading: message.hideLoading.bind(message),
};