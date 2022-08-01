<template>
  <div class="result-page">
    <nav-bar v-bind="navBarData" />
    <pay-status :statusType="statusType" class="pay-status" />
    <div class="info-wrap">
      <goods-info
        class="border-top"
        :orderId="orderId"
        :payTimeEnd="payTimeEnd"
        :goodsInfo="goodsData"
        @updateCollectionId="updateCollectionId"
      />
      <div class="order-btn" @click="jumpOrderDetail" v-if="statusType !== 0">
        查看订单
      </div>
    </div>
    <recommendList v-if="recommendData.length" :recommendData="recommendData" />
  </div>
</template>

<script>
export default {
  name: "payResult",
};
</script>
<script setup>
import PayStatus from "./components/payStatus.vue";
import goodsInfo from "./components/goodsInfo.vue";
import RecommendList from "./components/recommendList.vue";
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { isWX, sleep } from "utils/index";
import wxJSBridge from "modules/wxPay.js";
import { ErrMsg, ErrorCode } from "const";
import * as $api from "modules/api";
import { pagePurchaseType, payResultStatus, paymentType } from "./const";
import { message } from "plugins/message.js";
import { createLog } from "plugins/log";
import { pushEvent } from "modules/umLog";
const $log = createLog("payResult");
const navBarData = reactive({
  title: "",
  mode: "dark",
  background: "white",
  position: "fixed",
});

const route = useRoute();
const router = useRouter();
const store = useStore();

const statusType = ref(0); //支付结果
const payTimeEnd = ref(""); //支付完成时间
const recommendData = ref([]);
const orderId = route.query?.orderId;
let collectionId = "";
const updateCollectionId = (data) => {
  collectionId = data;
};

onMounted(async () => {
  if (!orderId) {
    router.replace({
      name: "OrderList",
    });
    return;
  }
  if (route.query?.purchaseType == pagePurchaseType.free) {
    statusType.value = payResultStatus.free;
    cleanCachedOrderList();
    getRecommendData();
    return;
  }

  // 正常支付逻辑
  try {
    if (isWX) {
      await wxPay();
    } else {
      console.log("h5支付");
    }
  } catch (err) {
    $log.error("createPay:", err);
  }
});
const wxPay = async () => {
  let paymentData = {};
  try {
    paymentData = await $api.post("/pay/create", {
      paymentType,
      orderId,
    });
  } catch (err) {
    $log.error("wxPay1", err);
    message.showToast(err?.errMsg || ErrMsg);
    // 支付非当前下单用户 /订单不存在
    if (
      err.errCode === ErrorCode.ORDER_PAY_NEED_SELF ||
      err.errCode === ErrorCode.ORDER_NOT_FOUND
    ) {
      router.replace({ name: "Home" });
    }
    // 订单已支付/已取消
    if (
      err.errCode === ErrorCode.ORDER_PAID ||
      err.errCode === ErrorCode.ORDER_CANCELED
    ) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        jumpOrderDetail();
      }, 300);
    }
    return;
  }
  try {
    await wxJSBridge(paymentData?.paymentStatementView);
    detectPayResult(3);
  } catch (err) {
    $log.error("wxPay2", err);
    if (err === "cancel") {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        jumpOrderDetail();
      }, 300);
      return;
    }
    detectPayResult(1);
  }
};

const detectPayResult = async (tryCount = 3) => {
  for (let i = 0; i < tryCount; i++) {
    if (i > 0) {
      await sleep(3000);
    }
    try {
      const payResult = await ajaxPayResult();
      if (payResult?.paySuccess) {
        statusType.value = payResultStatus.success;
        payTimeEnd.value = payResult.payTimeEnd;
        cleanCachedOrderList();
        getRecommendData();
        pushEvent("collection_purchase", {
          collection_id: collectionId,
        });
        return true;
      }
    } catch (err) {
      return false;
    }
  }
  statusType.value = payResultStatus.fail;
  return false;
};
const ajaxPayResult = () => {
  return $api.post("/pay/payResult", {
    orderId: orderId,
    paymentType,
  });
};

const getRecommendData = () => {
  recommendData.value = store.getters["home/recommendList"];
};

// 查看订单详情
const jumpOrderDetail = () => {
  if (orderId) {
    router.replace({
      name: "OrderDetail",
      params: {
        id: orderId,
      },
    });
  } else {
    router.replace({
      name: "OrderList",
      query: {
        active: 1,
      },
    });
  }
};

function cleanCachedOrderList() {
  store.commit("orderList/cleanOrderLists");
}
</script>
<style lang="less" scoped>
.result-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.pay-status {
  // margin-top: 14px;
  margin-top: 152px;
}
.info-wrap {
  background: #ffffff;
  padding-bottom: 80px;
}
.border-top {
  border-top: 1px solid #cccccc;
}
.order-btn {
  width: 280px;
  height: 96px;
  background: #222222;
  border-radius: 4px;
  text-align: center;
  line-height: 96px;
  font-size: 36px;
  color: #ffffff;
  margin: 20px auto 0;
}
</style>
