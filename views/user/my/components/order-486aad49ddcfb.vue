<template>
  <div class="order-box">
    <div
      class="item-box"
      v-for="(item, index) in orderTabList"
      :key="index"
      @click="jumpOrderList(index)"
    >
      <div class="item-icon-box">
        <img class="item-icon" :src="item.src" />
      </div>
      <div class="text-footer">{{ item.name }}</div>
      <div class="count-down-time" v-if="index == 0 && hasCountDown">
        {{ countNum }}
      </div>
      <div class="red-point" v-if="index == 1 && hasRedPoint"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import store from "store";
import router from "router";
import { formatCountDown } from "utils";
const orderTabList = [
  {
    name: "待付款",
    src: require("img/user/icon-order-unpay.png"),
  },
  {
    name: "待收货",
    src: require("img/user/icon-order-sending.png"),
  },
  {
    name: "已完成",
    src: require("img/user/icon-order-done.png"),
  },
  {
    name: "全部订单",
    src: require("img/user/icon-order-all.png"),
  },
];
const systemNow = computed(() => store.getters["orderList/now"]);
const lastestUNPAYAutoCancelTime = computed(
  () => store.getters["orderList/lastestUNPAYAutoCancelTime"]
);
const countNum = computed(() => {
  let leftTime = lastestUNPAYAutoCancelTime.value - systemNow.value;
  if (leftTime < 0) leftTime = 0;
  return formatCountDown(leftTime / 1000);
});
const hasCountDown = computed(() => store.getters["orderList/hasOrderUNPAY"]); //是否显示倒数计时
const hasRedPoint = computed(() => store.getters["orderList/hasOrderPAID"]); //是否显示红点

function jumpOrderList(active) {
  if (active < 3) {
    active += 1;
  } else {
    active = 0;
  }
  router.push({
    name: "OrderList",
    query: {
      active,
    },
  });
}
</script>

<style lang="less" scoped>
.order-box {
  width: 100%;
  height: 251px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-evenly;
  background: white;
  .item-box {
    .v-col();
    .center();
    position: relative;
    .item-icon-box {
      width: 80px;
      height: 80px;
      .item-icon {
        width: 100%;
        height: 100%;
      }
    }
    .text-footer {
      margin-top: 15px;
      font-size: 33px;
      font-weight: 400;
      color: #222222;
    }
    @red: #e60012;
    .count-down-time {
      position: absolute;
      top: -30px;
      left: 50%;
      padding: 7px 8px;
      font-size: 22px;
      font-weight: bold;
      color: white;
      background: @red;
      border-radius: 6px;
    }
    .red-point {
      top: -10px;
      right: -5px;
      position: absolute;
      width: 18px;
      height: 18px;
      background: @red;
      border-radius: 50%;
    }
  }
}
</style>
