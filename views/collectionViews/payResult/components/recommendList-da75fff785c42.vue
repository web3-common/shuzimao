<template>
  <div class="recommend-wrap">
    <h2 class="recommend-title">快来看看其他数字文创吧~</h2>
    <div class="recommend-content">
      <ul class="recommend-ul flex">
        <li
          class="recommend-item"
          v-for="(item, index) in recommendData"
          :key="index"
          @click="jumpCollectionDetail(item)"
        >
          <span class="thumb">
            <img :src="item.sourceUrl" alt="" />
          </span>

          <span class="main-info">
            <span class="goods-name">{{ item.sourceName }}</span>
            <span class="goods-author">
              <i class="author-img">
                <img :src="item.creatorIcon" alt="" />
              </i>
              <i>{{ item.sourceCreator }}</i></span
            >
          </span>
          <span
            class="goods-status"
            :class="{
              expectStatus: item.showStatus === 0,
              readySaleStatus: item.shwStatus === 1,
              hotSaleStatus: item.showStatus === 2,
              saleOutStatus: item.showStatus === 3,
            }"
            >{{ showGoodsStatus(item.showStatus) }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import router from "router";
import { homeJump } from "../const";
defineProps({
  recommendData: {
    type: Array,
    default: () => [],
  },
});
const showGoodsStatus = (status) => {
  switch (status) {
    case 0:
      return "敬请期待";
    case 1:
      return "即将开售";
    case 2:
      return "热卖中";
    case 3:
      return "已售罄";
    default:
      return "";
  }
};
const jumpCollectionDetail = (data) => {
  // 保持和首页跳转一致逻辑
  const { jumpType, jumpId, jumpUrl } = data;
  homeJump({
    jumpType,
    jumpId,
    jumpUrl,
    router,
  });
};
</script>

<style lang="less" scoped>
.recommend-title {
  position: relative;
  font-size: 30px;
  text-align: center;
  font-weight: normal;
  color: #333333;
  opacity: 0.6;
  margin: 62px 48px 50px;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 284px;
    height: 1px;
    background: #bbbbbb;
  }
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 284px;
    height: 1px;
    background: #bbbbbb;
  }
}

.recommend-content {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-margin-block: 0px;
  padding: 0 48px 64px;
  &::-webkit-scrollbar {
    display: none;
  }
  .recommend-item {
    position: relative;
    width: 495px;
    height: auto;
    margin-right: 40px;
    .thumb {
      display: block;
      width: 496px;
      height: 495px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .main-info {
      display: block;
      height: auto;
      padding: 24px 16px;
      background: #ffffff;
      .goods-name {
        display: block;
        font-size: 28px;
        font-weight: 400;
        color: #333333;
        white-space: nowrap;
        overflow: hidden;
      }
      .goods-author {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 24px;
        color: #999999;
        margin-top: 10px;
        .author-img {
          display: block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 11px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .goods-status {
      position: absolute;
      top: 0;
      right: 0;
      width: 125px;
      height: 38px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #0000007f;
      color: #ffffff;
      border-radius: 0px 7px 0px 21px;
      &.expectStatus {
        background: #1e5fef;
      }
      &.readySaleStatus {
        background: #d52bdb; //颜色为找到
      }
      &.hotSaleStatus {
        background: linear-gradient(153deg, #e1a738, #e2862e);
      }
      &.saleOutStatus {
        color: #ccc;
        background: #272525;
      }
    }
  }
}
</style>
