<template>
  <div class="order-item">
    <div class="order-item-left" :class="{ 'st-large': imgLarge }">
      <Image class="order-item-left-image" :src="imgUrl" mode="aspectFill" />
      <div class="order-item-left-level" v-if="levelStr">{{ levelStr }}</div>
    </div>
    <div class="order-item-right">
      <div class="first-line">
        <div class="order-name">
          {{ name }}
        </div>
        <div class="order-price">
          <span class="order-price-unit">¥</span>
          <span class="order-price-value">{{ priceStr }}</span>
        </div>
      </div>
      <div class="author-line">
        {{ author }}
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from "utils";
import { ProductLevel } from "const";
export default {
  name: "OrderItem",
  props: {
    imgUrl: {
      //订单图片
      type: String,
      default: "",
    },
    imgLarge: {
      type: Boolean,
      default: false,
    },
    name: {
      //商品名称
      type: String,
      default: "",
    },
    level: {
      //商品稀有度
      type: Number,
      default: null,
    },
    author: {
      //作者名
      type: String,
      default: "",
    },
    price: {
      //价格
      type: Number,
      default: null,
    },
  },
  computed: {
    levelStr() {
      for (let k in ProductLevel) {
        if (ProductLevel[k] === this.level) {
          return k + "级";
        }
      }
      return "";
    },
    priceStr() {
      return formatPrice(this.price);
    },
  },
};
</script>

<style lang="less" scoped>
.order-item {
  width: 100%;
  padding: 31px 65px 41px;
  background: white;
  .h-row();
  &-left {
    position: relative;
    flex-shrink: 0;
    width: 240px;
    height: 210px;
    border-radius: 6px;
    overflow: hidden;
    &.st-large {
      height: 240px;
    }
    &-image {
      border-radius: 6px;
    }
    &-level {
      position: absolute;
      top: 0;
      left: 0;
      width: 94px;
      height: 44px;
      padding: 10px 7px;
      padding-right: 20px;
      font-size: 24px;
      line-height: 30px;
      white-space: nowrap;
      color: #151729;
      .txt-c();
      background: linear-gradient(0deg, #ebd39b, #f4e5bf, #edcd90);
      border-bottom-right-radius: 33px;
      z-index: 1;
    }
  }
  &-right {
    margin-top: 23px;
    margin-left: 45px;
    flex: 1;
    max-width: 700px;
    .txt-l();
    .first-line {
      width: 100%;
      .h-row();
      .jc-sb();
      .ai-center();
      vertical-align: bottom;
      .order-name {
        flex: 1;
        font-size: 44px;
        font-weight: 500;
        color: @grayDark;
        .ellipsis();
      }
      .order-price {
        margin-right: 54px;
        font-size: 48px;
        font-weight: 500;
        text-indent: 10px;
        vertical-align: bottom;
        @color: @black;
        &-unit {
          font-size: 36px;
          margin-right: 10px;
        }
      }
    }
    .author-line {
      margin-top: 33px;
      width: 100%;
      font-size: 30px;
      color: @gray;
      .ellipsis();
    }
  }
}
</style>
