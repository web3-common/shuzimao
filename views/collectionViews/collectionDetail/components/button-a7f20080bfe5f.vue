<template>
  <div
    v-if="props.showStatus === 0"
    class="btn0 v-col jc-center ai-center ignore"
    @click="routeJump"
  >
    <span>{{ SHOW_STATUS[props.showStatus] }}</span>
  </div>
  <div
    v-if="props.showStatus === 1"
    class="btn v-col jc-center ai-center ignore"
    @click="routeJump"
  >
    <div>{{ SHOW_STATUS[props.showStatus] }}</div>
    <div class="time">{{ resultTime }}</div>
  </div>
  <div
    v-if="props.showStatus === 2"
    class="btn2 v-col jc-center ai-center"
    @click="routeJump"
  >
    <div>{{ SHOW_STATUS[props.showStatus] }}</div>
  </div>
  <div
    v-if="props.showStatus === 3"
    class="btn3 v-col jc-center ai-center"
    @click="routeJump"
  >
    <div>{{ SHOW_STATUS[props.showStatus] }}</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch } from "vue";
import { useCountdown } from "hooks";
import { isWX, showWxpayModal } from "utils";
import { isDev } from "config";
const SHOW_STATUS = ["敬请期待", "即将开售", "热卖中", "已售罄"];
const props = defineProps({
  beginTime: [Number, String],
  systemTime: [Number, String],
  showStatus: [Number, String],
});
const emit = defineEmits(["routeJump", "refreshData"]);
const resultTime = useCountdown(props.beginTime, props.systemTime);
watch(resultTime, (v) => {
  if (props.showStatus === 1 && (!v || v <= 0 || v == "00:00:00")) {
    emit("refreshData");
  }
});
const routeJump = () => {
  if (isDev || isWX) {
    emit("routeJump");
  } else {
    showWxpayModal();
  }
};
</script>

<style lang="less" scoped>
.ignore {
  border: 2px solid #333333;
  border-radius: 4px;
  box-sizing: border-box;
}
.btn,
.btn2,
.btn3,
.btn0 {
  width: 280px;
  height: 116px;
  font-size: 36px;
  font-family: Adobe Heiti Std;
  font-weight: normal;
  color: #333333;
  //   border: 3px solid #333333;
  //   border-radius: 4px;
  .time {
    font-size: 30px;
    color: #f63f1b;
    margin-top: 16px;
  }
}
.btn2 {
  background: @title-color;
  color: #fff;
}
.btn3 {
  background: rgba(187, 187, 187, 1);
  color: #fff;
}
</style>
