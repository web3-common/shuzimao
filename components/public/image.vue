<template>
  <div class="image">
    <img
      class="real-img"
      :src="src"
      :style="{ width, height, objectFit, objectPosition }"
      @error="onError"
      v-if="isShowReal"
    />
    <img
      class="default-img"
      src="~img/common/default-image-large.png"
      :style="{ width, height, objectFit, objectPosition }"
      v-else
    />
    <div class="mask" v-if="mask" />
  </div>
</template>

<script>
export default {
  name: "Image",
  props: {
    //图片资源地址
    src: {
      type: String,
      default: "",
    },
    /**
     * 图片裁剪、缩放的模式 同微信小程序 默认 scaleToFill
     * scaleToFill	缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
     * aspectFit	缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
     * aspectFill	缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
     * widthFix	缩放模式，宽度不变，高度自动变化，保持原图宽高比不变
     * heightFix	缩放模式，高度不变，宽度自动变化，保持原图宽高比不变
     * top	裁剪模式，不缩放图片，只显示图片的顶部区域
     * bottom	裁剪模式，不缩放图片，只显示图片的底部区域
     * center	裁剪模式，不缩放图片，只显示图片的中间区域
     * left	裁剪模式，不缩放图片，只显示图片的左边区域
     * right	裁剪模式，不缩放图片，只显示图片的右边区域
     * top left	裁剪模式，不缩放图片，只显示图片的左上边区域
     * top right	裁剪模式，不缩放图片，只显示图片的右上边区域
     * bottom left	裁剪模式，不缩放图片，只显示图片的左下边区域
     * bottom right	裁剪模式，不缩放图片，只显示图片的右下边区域
     */
    mode: {
      type: String,
      default: "scaleToFill",
    },
    //图片懒加载，在进入视口范围时才开始加载
    //利用 IntersectionObserver 判断视口范围，低版本浏览器不兼容直接加载
    lazyLoad: {
      type: Boolean,
      default: false,
    },
    mask: {
      type: Boolean,
      default: false,
    },
  },
  _lazyTimer: null,
  data() {
    return {
      isShowReal: false,
      width: "",
      height: "",
      objectFit: "",
      objectPosition: "",
    };
  },
  watch: {
    src(newSrc) {
      this.showReal(newSrc);
    },
    mode(newMode) {
      this.setMode(newMode);
    },
  },
  methods: {
    setMode(mode) {
      switch (mode) {
        case "aspectFit":
          this.objectFit = "contain";
          break;
        case "widthFix":
        case "heightFix":
        case "aspectFill":
          this.objectFit = "cover";
          break;
        case "top":
        case "bottom":
        case "center":
        case "left":
        case "right":
        case "top left":
        case "top right":
        case "bottom left":
        case "bottom right":
          this.objectFit = "none";
          break;
        case "scaleToFill":
        default:
          this.objectFit = "fill";
      }
      switch (mode) {
        case "top":
        case "bottom":
        case "center":
        case "left":
        case "right":
        case "top left":
        case "top right":
        case "bottom left":
        case "bottom right":
          this.objectPosition = mode;
          break;
        default:
          this.objectPosition = "";
      }
      switch (mode) {
        case "widthFix":
          this.width = "100%";
          this.height = "auto";
          break;
        case "heightFix":
          this.width = "auto";
          this.height = "100%";
          break;
        default:
          this.width = "";
          this.height = "";
      }
    },
    onError(event) {
      this.$emit("error", event);
      this.isShowReal = false;
    },
    setLazyLoadObserver() {
      if (!this.lazyLoad || !observer || !observeCallbacks) {
        return this.showReal();
      }
      const wrapper = this.$el;
      observeCallbacks?.set(wrapper, () => {
        this.showReal();
        this._lazyTimer && clearTimeout(this._lazyTimer);
        this._lazyTimer = null;
      });
      observer?.observe(wrapper);
      //增加15秒超时加载，防止observer异常永远不能加载图片
      this._lazyTimer = setTimeout(() => {
        this.showReal();
        observeCallbacks.delete(wrapper);
        observer.unobserve(wrapper);
        this._lazyTimer = null;
      }, 15000);
    },
    showReal() {
      this.isShowReal = Boolean(this.src);
    },
  },
  mounted() {
    if (this.lazyLoad) {
      this.setLazyLoadObserver();
    } else {
      this.showReal();
    }
    this.setMode(this.mode);
  },
  unmounted() {
    this._lazyTimer && clearTimeout(this._lazyTimer);
  },
};
const [observer, observeCallbacks] = (function initObserver() {
  if (typeof IntersectionObserver == "undefined") {
    console.warn(
      "components/image.vue not found IntersectionObserver, disable lazyLoad"
    );
    return [];
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting === false) return false;
      let target = entry.target;
      let targetCallback = observeCallbacks.get(target);
      targetCallback(entry);
      observeCallbacks.delete(target);
      observer.unobserve(target);
    });
  });
  const observeCallbacks = new WeakMap();
  return [observer, observeCallbacks];
})();
</script>

<style lang="less" scoped>
.image {
  overflow: hidden;
  position: relative;
  .center();
  &,
  .real-img,
  .default-img {
    width: 100%;
    height: 100%;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>
