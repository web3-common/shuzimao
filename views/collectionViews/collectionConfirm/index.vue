<template>
  <nav-bar v-bind="navBarData" />
  <div class="address-part" v-if="loading">
    <pre-address v-if="!tmpAddressId" @selectAddress="handleSelectAddress" />
    <address-item
      v-else
      :addressInfo="addressInfo"
      type="confirm"
      @click="handleSelectAddress"
    />
    <order-item
      class="product-info"
      v-bind="collectionShowData"
      :level="null"
    />
    <bootom-bar
      :productPrice="productPrice"
      @buyCollection="handleBuyCollection"
    />
  </div>
</template>

<script>
export default {
  name: "CollectionConfirmPage",
};
</script>
<script setup>
import { onMounted, computed, ref, reactive, unref, toRef } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import AddressItem from "components/AddressItem.vue";
import PreAddress from "./components/pre-address.vue";
import OrderItem from "components/order/item.vue";
import BootomBar from "./components/bottom-bar.vue";
import { ErrorCode } from "modules/api";
import * as $api from "modules/api";
import { message } from "plugins/message";
import { ErrMsg, UmPageTypes } from "const";
import { useUmPageLog } from "hooks";
useUmPageLog(UmPageTypes.OrderConfirm);
const store = useStore();
const route = useRoute();
const router = useRouter();

const productData = computed(() => store.getters["collection/productData"]);
const { collectionUrl, collectionName, level, author, price } =
  unref(productData);
const productPrice = computed(() => (price ? price / 100 : 0));
const collectionShowData = reactive({
  imgUrl: collectionUrl,
  name: collectionName,
  level,
  author,
  price: +price,
});
const navBarData = reactive({
  title: "订单确认",
  mode: "dark",
  background: "white",
  position: "relative",
});
let preOrderId = null;

//从状态存储的用户信息中获取
let userInfo = computed(() => store.getters["user/getUserInfo"]);
let tmpAddressId = toRef(userInfo.value, "defaultAddressId");

let loading = ref(false);
let addressInfo = ref({});

onMounted(() => {
  preOrderId = decodeURIComponent(route.query.preOrderId);
  if (!productData.value) {
    router.back();
  }
  if (route.query?.from == "addressList") {
    addressInfo.value = store.getters["collection/preConfirmAddress"];
    tmpAddressId.value = addressInfo.value?.id;
    loading.value = true;
    return;
  }
  getDefaultAddress();
});
const getDefaultAddress = async () => {
  if (tmpAddressId.value) {
    try {
      const addressResult = await $api.get(
        "/user/address/query",
        {
          id: tmpAddressId.value,
        },
        {
          checkLogin: false,
          rsaDecryptList: ["name", "phone", "address"],
        }
      );
      addressInfo.value = addressResult;
      store.dispatch("collection/updateConfirmAddress", addressResult);
    } catch (err) {
      console.error("getDefaultAddress", err);
      message.showToast(err?.ErrMsg || ErrMsg);
    } finally {
      loading.value = true;
    }
  } else {
    loading.value = true;
  }
};
const handleSelectAddress = () => {
  router.push({
    name: "AddressList",
    query: {
      from: "confirm",
    },
  });
};
let createOrderFlag = false;
const handleBuyCollection = async () => {
  try {
    if (!tmpAddressId.value) {
      message.showToast("请先添加地址!");
      return;
    }
    if (!preOrderId) {
      message.showToast("订单生成失败,请重试");
      router.back();
      return;
    }
    if (createOrderFlag) {
      return;
    }
    createOrderFlag = true;
    message.showToast("生成订单中");
    const orderInfo = await $api.post("/order/create", {
      operationKey: preOrderId,
      addressId: tmpAddressId.value,
    });
    message.hideToast();
    store.commit("orderList/cleanOrderLists");
    /**
     * purchaseType: 购买类型 0:付款 1:免费
     * orderId: 订单id
     * orderNumber: 订单编号
     * */
    let { purchaseType, orderId } = orderInfo;
    setTimeout(() => {
      router.replace({
        name: "PayResult",
        query: {
          orderId,
          purchaseType,
        },
      });
    }, 300);
  } catch (err) {
    console.error("handleBuyCollection", err);
    message.showToast(err?.errMsg || ErrMsg);
    if (err.errCode === ErrorCode.ORDER_REPEATED_ERROR) {
      router.replace({
        name: "OrderList",
        query: {
          active: 1,
        },
      });
    }
    return false;
  } finally {
    createOrderFlag = false;
  }
};
</script>

<style lang="less" scoped>
.address-part {
  border-top: 1px solid #cccccc;
}

.product-info {
  margin-top: 30px;
}
</style>
