<template>
  <Swipe class="swiper" :duration="500" :autoplay="5000" indicator-color="#eee">
    <SwipeItem v-for="(item, index) in props.list" :key="index">
      <Image
        class="slide"
        :src="item.sourceUrl"
        mode="aspectFill"
        :mask="true"
        @click="goBanner(item)"
      />
    </SwipeItem>
  </Swipe>
</template>

<script setup>
import { Swipe, SwipeItem } from "vant";
import { defineProps } from "vue";
import router from "router";
import { pushEvent } from "modules/umLog";
const props = defineProps({
  list: Array,
});
function goBanner(item) {
  router.push({
    name: "ViewImg",
    query: {
      src: encodeURIComponent(item?.jumpUrl),
    },
  });
  pushEvent("banner_view", {
    banner_id: item?.id || item?.jumpUrl || "",
  });
}
</script>

<style lang="less" scoped>
.swiper {
  --van-swipe-indicator-margin: 29px;
  --van-swipe-indicator-size: 20px;
  --van-swipe-indicator-active-opacity: 0.7;
  --van-swipe-indicator-inactive-opacity: 0.3;
}
</style>
