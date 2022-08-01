<template>
  <div class="render-wrapper" ref="wrapper">
    <canvas class="render-canvas" ref="renderCanvas" />
    <transition name="fade">
      <div class="loading-mask" v-show="isLoading">
        <LoadingIcon color="#ccc" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import LoadingIcon from "../public/loading-icon.vue";
// import { DevDisplayContent } from "modules/render";
import Render from "modules/render";
import * as Api from "modules/api";
import message from "plugins/message";
import { deepEqual } from "utils";
import { debug } from "config";
import {
  ref,
  defineProps,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  onUpdated,
} from "vue";
import Stats from "stats-js";
import { createLog, createGroup } from "plugins/log";
const Log = createLog("components/collection/render");
let renderModule = null;
let renderModelData = null;
const isLoading = ref(false);
const props = defineProps({
  displayId: String,
  width: Number,
  height: Number,
  touchEnable: Boolean,
});
const renderCanvas = ref(null);

onMounted(async () => {
  isLoading.value = true;
  await initRenderAsync();
  await ajaxDisplayContent();
  startRenderModel();
  initStats();
});
onUnmounted(() => {
  renderModule?.dispose();
  renderModule = null;
  renderModelData = null;
});

async function initRenderAsync() {
  const render = new Render({
    canvasSelector: renderCanvas.value,
    width: props.width,
    height: props.height,
  });
  await render.init();
  if (props.touchEnable) render.enableTouch();
  renderModule = render;
}
async function startRenderModel(lastRenderData) {
  if (!renderModelData) return false;
  const [logGStart, logGEnd] = createGroup("startRenderModel");
  try {
    if (lastRenderData && deepEqual(lastRenderData, renderModelData))
      return false;
    isLoading.value = true;
    debug && logGStart("startRenderModel");
    const render = renderModule;
    if (!Array.isArray(renderModelData)) {
      await render?.AddDisplayContent(renderModelData);
    } else {
      for (let contentConfig of renderModelData) {
        await render?.AddDisplayContent(contentConfig);
      }
    }
    render.Start();
  } catch (err) {
    Log.error("startRenderModel", err);
    if (!renderModule?.isReady) return false;
    message.showToast("渲染异常");
  } finally {
    debug && logGEnd("startRenderModel");
    isLoading.value = false;
  }
}
function ajaxDisplayContent(displayId = props.displayId) {
  return Api.get(
    "/mgmt/api/v1/display/detail",
    {
      displayId,
    },
    {
      baseURL: "",
      checkLogin: false,
    }
  ).then((displayContent) => {
    Log.log("ajaxDisplayContent", displayContent);
    renderModelData = [displayContent];
    // renderModelData = [DevDisplayContent];
  });
}
function initStats() {
  if (!debug) return false;
  var stat = new Stats();
  stat.setMode(0);
  let domStat = stat.domElement;
  domStat.style.position = "absolute";
  domStat.style.top = "0px";
  domStat.style.right = "0px";
  domStat.style.left = "auto";
  domStat.style.bottom = "auto";
  renderCanvas?.value?.parentElement?.append(domStat);
  renderModule.stat = stat;

  let currentStatPos = 1;
  let touchEnable = true;
  domStat.addEventListener("touchmove", function () {
    if (!touchEnable) return false;
    currentStatPos = (currentStatPos + 1) % 4;
    switch (currentStatPos) {
      case 0: //左下->左上
        domStat.style.top = "0px";
        domStat.style.bottom = "auto";
        break;
      case 1: //左上->右上
        domStat.style.right = "0px";
        domStat.style.left = "auto";
        break;
      case 2: //右上->右下
        domStat.style.top = "auto";
        domStat.style.bottom = "0";
        break;
      case 3: //右下->左下
        domStat.style.right = "auto";
        domStat.style.left = "0";
        break;
    }
    touchEnable = false;
    setTimeout(() => {
      touchEnable = true;
    }, 300);
  });
}

Object.entries({
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  onUpdated,
}).forEach(([fnName, fn]) => {
  fn(() => {
    Log.log("onhooks:", fnName);
  });
});
</script>

<style lang="less" scoped>
.render-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  .render-canvas {
    width: 100%;
    height: 100%;
  }

  .loading-mask {
    display: block;
    width: 100px;
    height: 100px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transform: scale(0.8);
    pointer-events: none;
  }
}
</style>
