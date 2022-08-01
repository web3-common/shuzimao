<template>
  <div class="home-page" ref="scrollWrapper">
    <pull-down-refresh
      class="pull-down-wrapper"
      @refresh="refreshList({ autoLoading: false, minRequestTime: 500 })"
      :pull-distance="80"
      :animation-duration="500"
      v-model="loading"
    >
      <Banner
        class="banner-area"
        :list="bannerList"
        v-if="bannerList?.length"
      />
      <div class="hot-sale-area" v-if="hotSaleList?.length">
        <hot-card
          v-for="(item, index) in hotSaleList"
          :key="index"
          v-bind="item"
        />
      </div>
      <ErrorPage
        class="error-page"
        @tap="refreshList({ autoLoading: true })"
        v-show="!isInit && !bannerList?.length && !hotSaleList?.length"
      />
      <div class="bottom-padding" />
    </pull-down-refresh>
    <ArViewBtn />
    <BottomTabBar />
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
<script setup>
//子组件
import Banner from "./components/banner.vue";
import HotCard from "./components/hot-card.vue";
import ArViewBtn from "./components/ar-view-btn.vue";
import BottomTabBar from "components/public/bottom-tab-bar.vue";

import { ref, computed, onMounted, onActivated, nextTick } from "vue";
import { useRoute } from "vue-router";
import store from "store";
import { goAppHome } from "modules/appTools";
import { UmPageTypes } from "const";
import { showNetErrRefreshModal } from "utils";
import { useUmPageLog, useScrollBehavior } from "hooks";
useUmPageLog(UmPageTypes.Home);
import { createLog } from "plugins/log";
const { log, error: logError } = createLog("views/home");
const route = useRoute();
const isInit = ref(true);
const loading = ref(false);
const bannerList = computed(() => store.getters["home/bannerList"]);
const hotSaleList = computed(() => store.getters["home/hotSaleList"]);

//滚动条绑定滚动记录
const scrollWrapper = ref(null);
useScrollBehavior(scrollWrapper);
onMounted(checkAutoOpenApp);
onActivated(async () => {
  await refreshList();
  await nextTick();
  isInit.value = false;
});
function refreshList({ autoLoading = false, minRequestTime } = {}) {
  return store
    .dispatch("home/getDataAsync", { autoLoading, minRequestTime })
    .catch((err) => {
      console.error("home.refreshList", err);
      showNetErrRefreshModal(err, () => {
        refreshList({ autoLoading, minRequestTime });
        return true;
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
function checkAutoOpenApp() {
  log("checkAutoOpenApp", route?.query?.autoapp);
  if (!route?.query?.autoapp) return false;
  goAppHome()
    .then(() => {
      log("checkAutoOpenApp succ");
    })
    .catch(() => {
      logError("checkAutoOpenApp fail");
    });
}
</script>

<style lang="less" scoped>
.home-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .pull-down-wrapper {
    width: 100%;
    min-height: 100vh;
    .banner-area {
      position: relative;
      width: 100%;
      height: 555px;
    }
    .hot-sale-area {
      padding: 69px 0 118px;
    }
    .error-page {
      height: calc(100vh - @bottomTabBarHeight);
    }
    .bottom-padding {
      height: @bottomTabBarHeight;
    }
  }
}
</style>
