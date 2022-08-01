<template>
  <transition name="fade">
    <div class="loading-wrapper" v-show="isShow">
      <div class="mask" v-show="isShowMask" @click="tapMask" />
      <div class="loading-box">
        <LoadingIcon />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<script setup>
import LoadingIcon from "../public/loading-icon.vue";
import { ref, defineExpose } from "vue";
const isShow = ref(false);
const isShowMask = ref(false);
let timerId = null;
let _success = null;
/**
 * 显示消息提示框
 * @param {Number} duration: 提示延迟时间（ms）
 * @param {Boolean} mask: 是否显示透明蒙层，防止触摸穿透
 * @param {Function} success: 提示消失回调
 */
function show({ duration = 15000, mask = true, success } = {}) {
  isShowMask.value = mask;
  timerId =
    duration <= 0
      ? null
      : setTimeout(() => {
          hide({
            removeCallback: false,
          });
        }, duration);
  _success = success;
  isShow.value = true;
}
/**
 * 隐藏消息提示框
 * @param {Boolean} removeCallback: 是否取消之前的结束回调
 */

function hide({ removeCallback = true } = {}) {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
  isShow.value = false;
  if (removeCallback) {
    _success = null;
  } else {
    if (typeof _success == "function") {
      _success();
    }
    _success = null;
  }
}
function tapMask() {}
defineExpose({ show, hide });
</script>

<style lang="less" scoped>
@zIndex: 101;
.loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: @zIndex;
  .center();

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: @zIndex;
    background: black;
    opacity: 0.3;
  }

  .loading-box {
    z-index: @zIndex + 1;
    width: 100px;
    height: 100px;
    transform: scale(1.5);
  }
}
</style>
