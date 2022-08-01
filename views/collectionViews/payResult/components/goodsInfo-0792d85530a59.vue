<template>
  <div class="goods-info" v-if="goodsInfo.orderNumber">
    <h1 class="goods-title">商品信息</h1>
    <div class="info-item">
      <span>订单编号：</span>
      <span>{{ goodsInfo.orderNumber }}</span>
    </div>
    <div class="info-item">
      <span>商品信息：</span>
      <span>{{ goodsInfo.name }}</span>
    </div>
    <div class="info-item">
      <span>收货地址：</span>
      <span> {{ goodsInfo.address }}</span>
    </div>
    <div class="info-item" v-if="payTimeEnd">
      <span>支付时间：</span>
      <span>{{ payTimeEnd }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, reactive } from "vue";
import * as $api from "modules/api";
import { message } from "plugins/message.js";
import { formatAddress } from "utils";
const props = defineProps({
  orderId: {
    type: String,
    default: "",
  },
  payTimeEnd: {
    type: String,
    default: "",
  },
});
const goodsInfo = reactive({
  orderNumber: "",
  name: "",
  address: "",
  payTime: "",
});
const emit = defineEmits("updateCollectionId");
onMounted(async () => {
  await getOrderDetail();
});
const getOrderDetail = async () => {
  try {
    const orderData = await $api.get(
      "/order/detail",
      { orderId: props.orderId },
      {
        rsaDecryptList: ["digitalOrderAddressView.address"],
      }
    );
    const {
      collectionDetail: { collectionName, collectionId },
      digitalOrderAddressView,
    } = orderData;

    emit("updateCollectionId", collectionId);
    goodsInfo.orderNumber = props.orderId;
    goodsInfo.name = collectionName;
    goodsInfo.address = formatAddress(digitalOrderAddressView);
  } catch (err) {
    console.error("getOrderDetail", err);
    message.showToast(err);
  }
};
</script>

<style lang="less" scoped>
.goods-info {
  background: #ffffff;
  padding: 48px 48px 54px;
}
.goods-title {
  font-size: 48px;
  color: #222222;
  font-weight: 500;
  color: #222222;
}
.info-item {
  font-size: 34px;
  font-weight: 400;
  color: #333333;
  padding: 22px 0;
  &:first-of-type {
    padding-top: 55px;
  }
}
</style>
