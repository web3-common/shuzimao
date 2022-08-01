<template>
  <div class="detail-page v-col jc-sb">
    <nav-bar v-bind="navBarData" />
    <Content
      :data="detailData.data"
      from="detail"
      :dataLoading="loading"
      @refreshData="getProductData"
    />
    <Footer
      :collectionId="collectionId"
      @openAppHandler="openAppHandler"
      @refreshData="refreshData"
      :data="detailData.data"
    />
  </div>
</template>

<script>
export default {
  name: "collectionDetail",
};
</script>
<script setup>
import Footer from "./components/footer.vue";
import Content from "./components/content.vue";
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "store";
import { onShare, ShareDesc } from "modules/wxsdk";
import * as $api from "modules/api";
import { pushEvent } from "modules/umLog";
import loginFun from "plugins/login";
import { createLog } from "plugins/log";
const $log = createLog("collectionDetail:");
import { isWX } from "utils";
import message from "plugins/message";
import { ErrMsg, ProductShowStatus, UmPageTypes } from "const";
import { useUmPageLog } from "hooks";
useUmPageLog(UmPageTypes.CollectionDetail);
const loading = ref(false);
const navBarData = reactive({
  title: "",
  mode: "dark",
  background: "transparent",
  position: "fixed",
});
const route = useRoute();
const router = useRouter();
const { collectionId } = route.params;
if (!collectionId) {
  $log.warn("productId not exist");
}
pushEvent("collection_view", {
  collection_id: collectionId,
});
const checkLogin = () => {
  const loginResult = loginFun.checkLogin();
  if (!loginResult) {
    loginFun.login({ next: route.fullPath });
    return false;
  }
  return true;
};
const detailData = reactive({
  data: {
    collectionId: "",
    collectionName: "",
    collectionStoryDesc: "",
  },
});
let lockClickBuy = false;
onMounted(() => {
  getProductData();
});
const getProductData = async () => {
  try {
    loading.value = true;
    const detail = await $api.get(
      "/collection/detail",
      { collectionId },
      { checkLogin: false }
    );
    store.dispatch("collection/addProductData", detail);
    detailData.data = { ...detail };
    setShareMessage();
  } catch (err) {
    $log.error(err);
    message.showToast(err?.errMsg || ErrMsg);
  } finally {
    loading.value = false;
  }
};

// 点击购买
const openAppHandler = (data) => {
  // if (!isWX) {
  //   message.showModal("请在微信中购买");
  //   return;
  // }
  const {
    data: { showStatus, surplusNum },
  } = detailData;
  if (showStatus !== ProductShowStatus.OPEN || surplusNum <= 0) return;
  if (!checkLogin()) return;
  buyNormalProduct();
  pushEvent("record_purchase");
};
const buyNormalProduct = async () => {
  if (lockClickBuy) {
    return;
  }
  lockClickBuy = true;
  try {
    const { operationKey } = await $api.get("/order/advance", {
      collectionId,
    });
    router.push({
      name: "CollectionConfirm",
      query: {
        collectionId,
        preOrderId: operationKey,
      },
    });
  } catch (err) {
    $log.error("buyNormalProduct", err);
    message.showToast(err.errMsg || ErrMsg);
    getProductData();
  } finally {
    lockClickBuy = false;
  }
};
const refreshData = () => {
  if (detailData.data.showStatus === ProductShowStatus.COUNTDOWN) {
    detailData.data.showStatus = ProductShowStatus.OPEN;
    // getProductData();
  }
};
function setShareMessage() {
  if (!isWX) return Promise.resolve();
  const detail = detailData.data;
  return onShare({
    title: detail.collectionName, // 分享标题
    desc: ShareDesc.detail, // 分享描述
    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: detail.collectionUrl, // 分享图标
  });
}
</script>
<style lang="less" scoped>
.detail-page {
  width: 100%;
  height: 100%;
}
</style>
