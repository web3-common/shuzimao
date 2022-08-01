<template>
  <div class="loading-status">
    <div
      class="pulldown-dots"
      :style="{
        width: Math.round(pullDownRate * 15) + '%',
        opacity: pullDownRate,
        transform: `scale(${pullDownRate})`,
      }"
    >
      <span class="pulldown-dot" :class="{ blink }" v-for="i in 3" :key="i" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    blink: Boolean,
    pullDownRate: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style lang="less" scoped>
.loading-status {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pulldown-dots {
  margin: 0 auto;
  width: 150px;
  height: 100px;
  transition: all 0.1s linear;
  .h-row();
  .jc-sb();
  .ai-center();
}
.pulldown-dot {
  @size: 25px;
  width: @size;
  height: @size;
  background: @gray;
  border-radius: 50%;
  &.blink {
    @animationTime: 1s;
    animation: blink @animationTime linear 0s infinite;
    each(range(3), {
      &:nth-of-type(@{value}) {
        animation-delay:  (round((@value - 1) / 5, 2) * @animationTime);
      }
    });
    @keyframes blink {
      0%,
      100% {
        opacity: 0.4;
      }
      40% {
        opacity: 1;
      }
    }
  }
}
</style>
