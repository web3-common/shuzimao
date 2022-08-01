<template>
  <div class="base-btn-wrapper" @click="onH5Click">
    <div class="wx-tag-wrapper" @click.stop="onWxTagClick" v-if="isUseWxTag">
      <wx-open-launch-app
        :appid="wxTagAppid"
        :extinfo="wxTagExtInfo"
        @ready="onWxTagReady"
        @launch="onWxTagLaunch"
        @error="onWxTagError"
      >
        <slot name="wx-tag">
          <div v-is="'script'" type="text/wxtag-template">
            <div v-is="'style'">
              .app-detail-wx-tag { display:block; width: {{ wxTagWidth }};
              height: {{ wxTagHeight }}; opacity: 0; background: transparent; }
            </div>
            <button class="app-detail-wx-tag"></button>
          </div>
        </slot>
      </wx-open-launch-app>
    </div>
    <slot>
      <span>打开APP</span>
    </slot>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, onMounted, ref } from "vue";
import Router from "router";
import { wechatAppId } from "config";
import { isWX } from "utils";
import { readyForOpenTag as wxReady } from "modules/wxsdk";
import { createLog } from "plugins/log";
const { log, error: logError } = createLog("components/app/home");

const emit = defineEmits(["click", "failback"]);
const props = defineProps({
  wxTagAppid: { type: String, default: wechatAppId }, //微信开放标签 appid
  wxTagExtInfo: String, //微信开放标签额外参数
  wxTagWidth: { type: String, default: "100px" }, //微信开放标签宽度
  wxTagHeight: { type: String, default: "100px" }, //微信开放标签高度
  fnAppJump: Function, //非微信环境app跳转函数
  autoDownload: { type: Boolean, default: true }, //都失败是否自动跳转下载页面，否则出发click事件
});

const isUseWxTag = ref(false);
const isWxTagReady = ref(false);
onMounted(initWxTag);

function initWxTag() {
  if (!isWX) return false;
  wxReady(
    () => {
      log("initWxTag.wxReady");
      isUseWxTag.value = true;
    },
    () => {
      logError("initWxTag.wxReady-fail");
      isUseWxTag.value = false;
    }
  );
}

function onWxTagReady(event) {
  //标签初始化完毕，可以进行点击操作
  log("onWxTagReady", event?.detail, event);
  isWxTagReady.value = true;
}
function onWxTagLaunch(event) {
  //用户点击跳转按钮并对确认弹窗进行操作后触发
  log("onWxTagLaunch", event?.detail, event);
  emit("click", { _from: "wxTag", ...event });
}
function onWxTagError(event) {
  //用户点击跳转按钮后出现错误
  logError("onWxTagError", event?.detail, event);
  emit("click", { _from: "wxTag", ...event });
  if (props.autoDownload) {
    gotoDownload();
  } else {
    emit("failback", event);
  }
}
function onWxTagClick(e) {
  log("onWxTagClick");
  emit("click", e);
  if (!isWxTagReady.value) {
    gotoDownload(e);
  }
}
function onH5Click(e) {
  log("onH5Click");
  emit("click", e);
  if (!isWX) {
    tryAppJump().catch(() => gotoDownload(e));
  } else {
    gotoDownload(e);
  }
}
function tryAppJump() {
  const fnResult = props.fnAppJump?.();
  if (fnResult instanceof Promise) return fnResult;
  if (fnResult) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}
function gotoDownload(e) {
  if (!props.autoDownload) {
    return emit("failback", e);
  }
  Router.push({
    name: "Download",
  });
}
</script>

<style lang="less" scoped>
.base-btn-wrapper {
  position: relative;
  .wx-tag-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>
