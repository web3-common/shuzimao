<template>
  <div class="modal-wrapper" v-show="isShowModel">
    <div class="modal-mask" @click="tapMask" v-show="isShowMask" />
    <div class="modal-box" :style="{ width: boxWidth }">
      <slot name="header"></slot>
      <div class="modal-content-area" :class="contentCls">
        <p class="modal-title-text" v-show="title">{{ title }}</p>
        <p class="modal-content-text" v-show="content">{{ content }}</p>
        <slot></slot>
      </div>
      <div class="modal-btns">
        <div
          class="modal-btn"
          :class="[btnCls, btnCancelCls]"
          :style="{ width: btnWidth }"
          @click="tapCancel"
          v-if="isShowCancel"
        >
          {{ cancelText }}
        </div>
        <div
          class="modal-btn"
          :class="[btnCls, btnConfirmCls]"
          :style="{ width: btnWidth }"
          @click="tapConfirm"
        >
          {{ confirmText }}
        </div>
      </div>
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Model",
  data() {
    return {
      isShowModel: false,
      isShowMask: true,
      isShowCancel: false,
      title: "",
      content: "",
      cancelText: "取消",
      confirmText: "我知道了",
      confirmBgStyle: "dark",
      cancelBgStyle: "light",
      boxWidth: "",
      btnWidth: "",
      contentCls: "",
      btnCls: "",
    };
  },
  computed: {
    btnConfirmCls() {
      return this.getBtnClass(this.confirmBgStyle, this.isShowCancel);
    },
    btnCancelCls() {
      return this.getBtnClass(this.cancelBgStyle);
    },
  },
  methods: {
    getBtnClass(style, isSingle = false) {
      var clsList = [];
      if (isSingle) {
        clsList.push("btn-style-single");
      }
      if (style == "light") {
        clsList.push("btn-style-light");
      }
      return clsList.join(" ");
    },
    /**
     * 显示模态对话框
     * @param {String} title: 提示的标题
     * @param {String} content: 提示的内容
     * @param {Boolean} showMask: 是否显示透明蒙层，防止触摸穿透
     * @param {Boolean} showCancel: 是否显示取消按钮
     * @param {String} cancelText: 取消按钮的文字，最多 4 个字符
     * @param {String} cancelColor: 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串
     * @param {String} confirmText: 确认按钮的文字，最多 4 个字符
     * @param {String} confirmColor: 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
     * @param {Function} success: 点击按钮的回调函数
     *          {Boolean} confirm: 为 true 时，表示用户点击了确定按钮
     *          {Boolean} cancel: 为 true 时，表示用户点击了取消
     * @return {Promise} 返回promise对象，只会在将关闭弹窗时resolve（点击按钮等）
     *                    success会覆盖resolve
     */
    show({
      title = "",
      content = "", //提示文案
      showMask = true,
      showCancel = false,
      confirmText = "确认",
      cancelText = "取消",
      confirmBgStyle = "dark",
      cancelBgStyle = "light",
      width = "",
      btnWidth = "",
      contentCls = "",
      btnCls = "",
      autoOneline = true,
      success,
    } = {}) {
      if (autoOneline && (!title || !content)) {
        contentCls = contentCls.concat(" st-large");
        if (!showCancel) {
          btnCls = btnCls.concat(" st-large");
        }
      }
      this.title = title;
      this.content = content;
      this.cancelText = cancelText;
      this.confirmText = confirmText;
      this.confirmBgStyle = confirmBgStyle;
      this.cancelBgStyle = cancelBgStyle;
      this.boxWidth = width;
      this.btnWidth = btnWidth;
      this.contentCls = contentCls;
      this.btnCls = btnCls;

      this.isShowModel = true;
      this.isShowMask = showMask;
      this.isShowCancel = showCancel;
      return new Promise((resolve) => {
        this.success = success || resolve;
      });
    },
    tapMask() {
      let res;
      if (typeof this.success == "function") {
        res = this.success({
          mask: true,
        });
      }
      if (res !== false) {
        this.isShowModel = false;
        this.success = null;
      }
    },
    tapCancel() {
      let res;
      if (typeof this.success == "function") {
        res = this.success({
          cancel: true,
        });
      }
      if (res !== false) {
        this.isShowModel = false;
        this.success = null;
      }
    },
    tapConfirm() {
      let res;
      if (typeof this.success == "function") {
        res = this.success({
          confirm: true,
        });
      }
      if (res !== false) {
        this.isShowModel = false;
        this.success = null;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@zIndex: 200;
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: @zIndex;
  .center();
  .txt-c();

  .modal-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: @zIndex;
    background: black;
    opacity: 0.3;
  }

  .modal-box {
    position: relative;
    z-index: @zIndex+1;
    box-sizing: border-box;
    width: 600px;
    background: white;
    overflow: hidden;
    border-radius: 6px;

    .modal-content-area {
      box-sizing: border-box;
      padding: 52px;
      min-height: 172px;
      .center();
      .v-col();
      .txt-c();

      .modal-title-text {
        font-size: 30px;
        color: #333;
      }
      .modal-content-text {
        margin-top: 15px;
        font-size: 24px;
        color: #999;
      }

      &.st-large {
        min-height: 212px;
        .modal-title-text {
          font-size: 38px;
        }
        .modal-content-text {
          margin-top: 46px;
          font-size: 36px;
          line-height: 50px;
        }
      }
      &.st-left {
        .txt-l();
      }
    }

    .modal-btns {
      .flex();
      .jc-center();

      .modal-btn {
        @btnBg: #222;
        position: relative;
        box-sizing: box;
        width: 160px;
        height: 68px;
        font-size: 30px;
        color: white;
        background: @btnBg;
        border: 2px solid @btnBg;
        border-radius: 3px;
        .center();
        .txt-c();
        .ellipsis();
        margin-left: 40px;
        margin-bottom: 40px;
        &:first-of-type {
          margin-left: 0;
        }
        &.btn-style-light {
          background: white;
          color: #333;
        }
        &.st-large {
          width: 180px;
          height: 78px;
          font-size: 36px;
          margin-bottom: 50px;
        }
      }
    }
  }
}
</style>
