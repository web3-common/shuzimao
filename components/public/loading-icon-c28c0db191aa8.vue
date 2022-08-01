<template>
  <div class="icon-loading ball-spin-fade-loader" :style="iconStyle">
    <span class="spin-ball" :style="ballStyle" v-for="n in 8" :key="n" />
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: null,
    },
    color: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconStyle() {
      const size = this.size;
      if (!size || typeof size != "number") return "";
      return `-webkit-transform: scale(${size});transform: scale(${size});`;
    },
    ballStyle() {
      if (!this.color || typeof this.color != "string") return "";
      return `background:${this.color}`;
    },
  },
};
</script>

<style lang="less" scoped>
@ballSize: 25px;
@ballDelay: 0.06s;
.ball-spin-fade-loader {
  position: relative;
  top: 50px;
  left: 50px;
  width: 1px;
  height: 1px;

  .spin-ball {
    background: white;
    width: @ballSize;
    height: @ballSize;
    margin-left: (-@ballSize / 2);
    margin-top: (-@ballSize / 2);
    border-radius: 100%;
    animation: ball-spin-fade-loader (@ballDelay*8) infinite linear;
    animation-fill-mode: both;
    position: absolute;

    each(range(8), {
     &:nth-child(@{value}){
        top: 40px * sin(pi() * 0.25 * @value);
        left: 40px * cos(pi() * 0.25 * @value);
        animation-delay: (@value * @ballDelay);
      }
    });

    @keyframes ball-spin-fade-loader {
      0% {
        transform: scale(1);
      }

      100% {
        transform: scale(0.3);
      }
    }
  }
}
</style>
