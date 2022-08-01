<template>
  <div class="hot-card" @click="onClickCard">
    <div class="hot-card-corner-status" :class="'st-' + showStatus">
      {{ showStatusStr }}
    </div>
    <div class="hot-card-img-box">
      <Image class="img" :src="sourceUrl" mode="aspectFill" :mask="true" />
    </div>
    <div class="hot-card-txt-box">
      <div class="hot-card-title">
        <span class="hot-card-title-text">{{ sourceName }}</span>
        <span class="hot-card-title-tag">{{
          creatorType == 0 ? "官方" : "个人"
        }}</span>
      </div>
      <div class="hot-card-author">
        <Image
          class="hot-card-author-icon"
          :src="creatorIcon"
          mode="aspectFill"
        />
        <span class="hot-card-author-name">{{ sourceCreator }}</span>
        <div class="hot-card-price" v-if="priceStr">
          <span class="unit">¥</span>
          {{ priceStr }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import router from "router";
import { formatPrice, isWX, showWxpayModal } from "utils";
import { isDev } from "config";
const props = defineProps([
  "jumpId",
  "showStatus",
  "sourceUrl",
  "sourceName",
  "creatorType",
  "creatorIcon",
  "sourceCreator",
  "price",
]);
const showStatusStr = computed(() => {
  switch (props.showStatus) {
    case 0:
      return "敬请期待";
    case 1:
      return "即将开售";
    case 2:
      return "热卖中";
    case 3:
      return "已售罄";
  }
  return "";
});
const priceStr = computed(() => {
  return formatPrice(props.price);
});
function onClickCard() {
  if (isDev || isWX) {
    goProductDetail();
  } else {
    showWxpayModal({
      cancelFn: goProductDetail,
    });
  }
}
function goProductDetail() {
  router.push({
    name: "CollectionDetail",
    params: {
      collectionId: props?.jumpId,
    },
  });
}
</script>

<style lang="less" scoped>
@cardSize: 960px;
.hot-card {
  margin: 0 auto;
  margin-top: 84px;
  position: relative;
  width: @cardSize;
  overflow: hidden;
  background: white;
  box-shadow: 0px 0px 30px 0px rgba(178, 177, 177, 0.24);
  border-radius: 10px;
  &:first-of-type {
    margin-top: 0;
  }
  &-corner-status {
    position: absolute;
    top: 0;
    right: 0;
    width: 180px;
    height: 54px;
    z-index: 1;
    .center();
    font-size: 28px;
    font-weight: bold;
    color: white;
    background: #0000007f;
    text-align: center;
    border-radius: 0px 10px 0px 30px;
    &.st-0 {
      background: #1e5fef;
    }
    &.st-1 {
      background: #d52bdb;
    }
    &.st-2 {
      background: linear-gradient(153deg, #e1a738, #e2862e);
    }
    &.st-3 {
      color: #ccc;
      background: #272525;
    }
  }
  &-img-box {
    width: @cardSize;
    height: @cardSize;
    border-radius: 10px 10px 0 0;
    z-index: 0;
  }
  &-txt-box {
    padding: 50px 33px;
    background: white;
    border-radius: 0 0 10px 10px;
    .hot-card-title {
      .h-row();
      .ai-center();
      @height: 65px;
      height: @height;
      &-text {
        height: @height;
        line-height: @height;
        font-size: 45px;
        color: @grayDark;
        .ellipsis();
      }
      &-tag {
        margin-left: 34px;
        width: 80px;
        height: 38px;
        font-size: 28px;
        line-height: 38px;
        color: #211d17;
        .txt-c();
        background: linear-gradient(
          90deg,
          fade(@logoColor1, 40%),
          fade(@logoColor2, 40%)
        );
        border-radius: 6px;
      }
    }
    .hot-card-author {
      margin-top: 25px;
      @height: 56px;
      height: @height;
      .h-row();
      .ai-center();
      &-icon {
        width: @height;
        height: @height;
      }
      &-name {
        flex: 1;
        margin-left: 21px;
        height: @height;
        line-height: @height;
        font-size: 30px;
        color: @grayLight;
        opacity: 0.7;
        .txt-l();
        .ellipsis();
      }
      .hot-card-price {
        padding-right: 38px;
        height: 60px;
        line-height: 60px;
        font-size: 60px;
        color: @black;
        .unit {
          font-size: 40px;
        }
      }
    }
  }
}
</style>
