<template>
  <div
    class="nav-bar"
    :style="{
      background,
      position,
    }"
  >
    <div
      class="nav-bar-left-box"
      :class="{ 'bg-black': !isDarkMode }"
      @click="tapBack"
    >
      <img class="nav-bar-left-icon" :src="backIcon" />
    </div>
    <div
      class="nav-bar-title"
      :class="{ 'st-light': !isDarkMode }"
      v-show="title"
    >
      {{ title }}
    </div>
  </div>
</template>

<script>
import iconBackWhite from "img/common/icon-back-white.png";
import iconBackBlack from "img/common/icon-back.png";
import { sleep } from "utils";
export default {
  name: "NavBar",
  props: {
    //标题文案
    title: {
      type: String,
      default: null,
    },
    // 样式类型：dark/light 同时控制按钮颜色及标题颜色，默认dark
    mode: {
      type: String,
      default: null,
    },
    // 整体背景色，可以配置渐变色/图片等，默认透明
    background: {
      type: String,
      default: null,
    },
    // 整体定位，默认relative
    position: {
      type: String,
      default: null,
    },
    // 返回按钮回调，返回false则禁用自动router返回
    backFn: {
      type: Function,
      default: null,
    },
  },
  computed: {
    isDarkMode() {
      return this.mode != "light";
    },
    backIcon() {
      return this.isDarkMode ? iconBackBlack : iconBackWhite;
    },
  },
  methods: {
    tapBack() {
      this.$emit("back");
      let backFnRes;
      if (typeof this.backFn == "function") {
        backFnRes = this.backFn();
      }
      if (backFnRes === false || this.backFn === false) {
        return false;
      }

      this.$router.back();

      const lastRoute = this.$route;
      sleep(500).then(() => {
        if (lastRoute === this.$route) {
          this.$router.replace({ name: "Home" });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.nav-bar {
  background: transparent;
  position: relative;
  width: 100%;
  height: @navBarHeight;
  top: 0;
  left: 0;
  z-index: 100;
  .txt-c();
  .nav-bar-left-box {
    position: absolute;
    top: 29px;
    left: 33px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    &.bg-black {
      background: rgba(0, 0, 0, 0.4);
    }
    &.bg-white {
      background: rgba(255, 255, 255 0.4);
    }
    .center();
    .nav-bar-left-icon {
      width: 52px;
      height: 52px;
    }
  }
  .nav-bar-title {
    margin: 0 auto;
    max-width: 780px;
    height: 100%;
    font-size: 54px;
    color: #333;
    .center();
    &.st-light {
      color: white;
    }
  }
}
</style>
