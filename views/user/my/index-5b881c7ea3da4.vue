<template>
  <div class="page">
    <pull-down-refresh
      class="my-wrapper"
      :pull-distance="80"
      :animation-duration="500"
      @refresh="onPullDownRefresh"
      v-model="refreshLoading"
    >
      <div class="top-box">
        <div class="top-title">数字猫</div>
        <UserDetail />
      </div>
      <OrderBox />
      <ActionList @showCustom="isShowCustomServiceModal = true" />
      <Copyright />
    </pull-down-refresh>
    <BottomTabBar />
    <transition name="fade">
      <CustomService
        @close="isShowCustomServiceModal = false"
        v-show="isShowCustomServiceModal"
      />
    </transition>
  </div>
</template>

<script setup>
import UserDetail from "./components/userDetail.vue";
import OrderBox from "./components/order.vue";
import ActionList from "./components/actionList.vue";
import Copyright from "./components/copyright.vue";
import CustomService from "./components/customServiceModal.vue";
import BottomTabBar from "components/public/bottom-tab-bar.vue";

import store from "store";
import { ref, onMounted, onActivated } from "vue";
import Message from "plugins/message";
import { OrderStatus, ErrMsg, UmPageTypes } from "const";
import { useUmPageLog } from "hooks";
useUmPageLog(UmPageTypes.UserCetner);
const isShowCustomServiceModal = ref(false); //客服弹窗
const refreshLoading = ref(false);
onMounted(() => {
  getDataAsync(false);
});
onActivated(() => {
  getDataAsync(true);
});
function getDataAsync(useCache = true) {
  let p1 = store.dispatch("orderList/getOrderListAsync", {
    orderStatus: OrderStatus.UNPAY,
    useCache,
  });
  let p2 = store.dispatch("orderList/getOrderListAsync", {
    orderStatus: OrderStatus.PAID,
    useCache,
  });
  let p3 = store.dispatch("user/getUserData", {
    useCache,
  });
  return Promise.all([p1, p2, p3]);
}
function onPullDownRefresh() {
  return getDataAsync(false)
    .catch((err) => {
      console.error("view/user/my-onPullDownRefresh:", err);
      Message.showToast(err.errMsg || ErrMsg);
    })
    .finally(() => {
      refreshLoading.value = false;
    });
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.my-wrapper {
  width: 100%;
  background: #eee;
  :deep(.van-pull-refresh__track) {
    min-height: 100vh;
    padding-bottom: @bottomTabBarHeight;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .top-box {
    background: white;
    background-image: linear-gradient(0deg, fade(white, 100%), fade(white, 0%)),
      linear-gradient(90deg, tint(@logoColor1, 75%), tint(@logoColor2, 75%));
    border-bottom: 1px solid fade(#eee, 50%);
    .top-title {
      width: 100%;
      padding: 104px 0 92px;
      font-size: 54px;
      font-weight: 500;
      color: #333333;
      text-align: center;
    }
  }
}
</style>
