<template>
  <div class="footer h-row jc-sb ai-center" v-if="hasStatus">
    <div class="left">
      <span class="unit">¥</span>
      <span class="number">{{ price }}</span>
      <span class="surplusNum" v-show="data.showStatus != 3">
        库存{{ data.surplusNum || 0 }}
      </span>
    </div>
    <div class="right">
      <BuyButtom
        v-if="data.systemTime"
        :beginTime="data.beginTime"
        :systemTime="data.systemTime"
        :showStatus="data.showStatus"
        @routeJump="$emit('openAppHandler')"
        @refreshData="$emit('refreshData')"
      />
    </div>
  </div>
</template>

<script>
import BuyButtom from "./button.vue";
import { formatPrice } from "utils";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["openAppHandler", "refreshData"],
  components: { BuyButtom },
  computed: {
    price() {
      return formatPrice(this.data.price);
    },
    hasStatus() {
      return typeof this.data?.showStatus != "undefined";
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: 202px;
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid rgba(170, 170, 170, 0.5);
  box-shadow: 0px 0px 7px 0px rgba(242, 237, 233, 0.2);
  box-sizing: border-box;
  padding-left: 50px;
  padding-right: 50px;
  .left {
    color: @title-color;
    font-weight: 500;
    .unit {
      font-size: 24px;
      margin-right: 10px;
    }
    .number {
      font-size: 60px;
      font-family: Noto Sans S Chinese;
      font-weight: 500;
    }
    .surplusNum {
      margin-left: 22px;
      color: #666666;
      font-size: 30px;
    }
  }
  .right {
    width: 280px;
    height: 116px;
    overflow: hidden;
    position: relative;
    .wx-open-launch-app {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
    }
  }
}
</style>
