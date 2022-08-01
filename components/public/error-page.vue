<template>
  <div class="error-page">
    <Image class="error-page-img" :src="imgUrl" mode="aspectFit" />
    <div class="error-page-padding" :style="{ height: padding + 'px' }" />
    <div class="error-page-txt">
      {{ txt }}
    </div>
    <div class="error-page-padding" :style="{ height: padding + 'px' }" />
    <div class="error-page-btn" @click="emit('tap')" v-if="isShowBtn">
      {{ btnTxt }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
};
</script>
<script setup>
import { defineEmits, defineProps, computed } from "vue";
import { ErrMsg } from "const";
const emit = defineEmits(["tap"]);
const props = defineProps({
  type: {
    type: String,
    default: "ErrApi", //ErrApi / NoProduct / NoOrder / NoAddress / None
  },
  txt: {
    type: String,
    default: ErrMsg,
  },
  btnTxt: {
    type: String,
    default: "刷 新",
  },
  isShowBtn: {
    type: Boolean,
    default: true,
  },
  padding: {
    type: Number,
    default: 30,
  },
});
const imgUrl = computed(() => {
  switch (props.type) {
    case "NoProduct":
      return "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v1.3/error/img-error-1.png";
    case "NoOrder":
      return "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v1.3/error/img-error-2.png";
    case "NoAddress":
      return "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v1.3/error/img-error-4.png";
    case "None":
      return "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v1.3/error/img-error-5.png";
    case "ErrApi":
    default:
      return "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v1.3/error/img-error-3.png";
  }
});
</script>

<style lang="less" scoped>
.error-page {
  width: 100%;
  height: 100%;
  flex: 1;
  .v-col();
  .center();
  &-img {
    width: 360px;
    height: 360px;
  }
  &-txt {
    font-size: 36px;
    color: @grayDark;
  }
  &-btn {
    width: 280px;
    height: 96px;
    color: white;
    .center();
    font-size: 42px;
    background: @black;
    border-radius: 4px;
  }
}
</style>
