<template>
  <PullRefresh v-bind="$attrs" v-if="!isIOS141">
    <template #pulling="props">
      <pull-dot
        :pullDownRate="
          Math.min(props.distance / pullDownThreshold, 1) * 0.8 + 0.2
        "
      />
    </template>
    <template #loosing>
      <pull-dot />
    </template>
    <template #loading>
      <pull-dot :blink="true" />
    </template>
    <template #normal>
      <pull-dot />
    </template>
    <slot />
  </PullRefresh>
  <div v-else>
    <slot />
  </div>
</template>

<script>
import { PullRefresh } from "vant";
import PullDot from "./pull-dot.vue";
import { isIOS, osVersion } from "utils";
export default {
  name: "PullDownRefresh",
  components: {
    PullRefresh,
    PullDot,
  },
  computed: {
    pullDownThreshold() {
      return this.$attrs["pull-distance"] || this.$attrs["head-height"] || 100;
    },
    isIOS141() {
      return isIOS && osVersion < 14.2;
    },
  },
};
</script>

<style lang="less">
.van-pull-refresh {
  min-height: 100%;
}
</style>
