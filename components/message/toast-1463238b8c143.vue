<template>
  <transition name="fade">
    <div class="toast-wrapper" v-show="isShow">
      <div class="toast-mask" v-show="isShowMask" @click="tapMask" />
      <div class="toast-box" @click="tapToast">
        <p class="title">{{ title }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      isShow: false,
      isShowMask: false,
      title: "",
    };
  },
  methods: {
    /**
     * 显示消息提示框
     * @param {String} title: 提示的内容
     * @param {Number} duration: 提示延迟时间（ms）
     * @param {Boolean} mask: 是否显示透明蒙层，防止触摸穿透
     * @param {Function} success: 提示消失回调
     */
    show({ title, duration = 1500, mask = false, success } = {}) {
      this.isShowMask = mask;
      this.title = title || "";
      this.timerId && clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.hide();
      }, duration);
      this.success = success;
      this.isShow = true;
    },
    hide() {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      this.isShow = false;
      if (typeof this.success == "function") {
        this.success();
      }
      this.success = null;
    },
    tapMask() {},
    tapToast() {},
  },
};
</script>

<style lang="less" scoped>
@zIndex: 105;
.toast-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: @zIndex;
  pointer-events: none;
  .center();

  .toast-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: @zIndex;
    background: black;
    opacity: 0.3;
  }

  .toast-box {
    z-index: @zIndex + 1;
    font-size: 34px;
    line-height: 36px;
    overflow: hidden;
    color: white;
    background: rgba(10, 11, 20, 0.7);
    box-shadow: 0px 18px 30px 0px rgba(42, 34, 26, 0.3);
    border-radius: 6px;
    pointer-events: auto;

    .title {
      box-sizing: border-box;
      max-width: 900px;
      min-width: 100px;
      padding: 24px 44px;
      text-align: center;
      word-break: break-all;
      white-space: normal;
    }
  }
}
</style>
