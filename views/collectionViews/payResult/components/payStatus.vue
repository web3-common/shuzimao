<template>
  <div class="v-col jc-center ai-center pay-status">
    <span class="status-img">
      <img
        :src="showImg"
        alt=""
        class=""
        :class="{ loading: statusType === 0 }"
      />
    </span>
    <span class="show-content">{{ showTxt }}</span>
  </div>
</template>

<script>
export default {};
</script>
<script setup>
import { computed, defineProps } from "vue";
import loadingSrc from "@/assets/img/address/icon-loading.png";
import successSrc from "@/assets/img/address/icon-success.png";
import failSrc from "@/assets/img/address/icon-fail.png";
const props = defineProps({
  statusType: {
    type: Number,
    default: 0,
  },
});
const showImg = computed(() => {
  switch (props.statusType) {
    case 0:
      return loadingSrc;
    case 1:
      return successSrc;
    case 2:
      return failSrc;
    case 3:
      return successSrc;
    default:
      return loadingSrc;
  }
});
const showTxt = computed(() => {
  switch (props.statusType) {
    case 0:
      return "支付确认中";
    case 1:
      return "支付成功!";
    case 2:
      return "支付失败!";
    case 3:
      return "领取成功!";
    default:
      return "支付确认中";
  }
});
</script>

<style lang="less" scoped>
.pay-status {
  padding: 60px 0 76px;
  background: #fff;
  .status-img {
    display: block;
    width: 160px;
    height: 160px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .show-content {
    padding-top: 38px;
  }
}
.loading {
  animation: rotate 1.5s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
