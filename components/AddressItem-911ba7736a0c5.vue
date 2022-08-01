<template>
  <div class="address-item" v-if="addressInfo.id">
    <div :class="{ 'collection-style': type === 'confirm' }">
      <div class="flex ai-center name-phone">
        <i class="name">{{ addressInfo?.name }}</i>
        <i class="phone">{{ formatMobile(addressInfo?.phone) }}</i>
        <span class="default-flag" v-show="addressInfo?.isDefault">默认</span>
      </div>
      <div class="address-detail">
        {{ formatAddress(addressInfo) }}
      </div>
      <span class="icon-right"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "addressItem",
  props: {
    type: {
      type: String,
      default: "",
    },
    addressInfo: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<script setup>
import { formatMobile, formatAddress } from "utils";
</script>

<style lang="less" scoped>
.address-item {
  padding: 56px 50px 66px;
  font-size: 36px;
  background: #fff;
  .name-phone {
    color: #333333;
    margin-bottom: 45px;
    overflow: hidden;
    .name {
      margin-right: 13px;
      font-weight: 400;
    }
    .phone {
      font-size: 36px;
      font-weight: bold;
      color: #aaaaaa;
      margin-left: 13px;
    }
    .default-flag {
      display: inline-block;
      border: 2px solid #629dff;
      border-radius: 2px;
      font-weight: bold;
      font-size: 24px;
      line-height: 24px;
      color: #629dff;
      padding: 4px 10px;
      margin-left: 20px;
      box-sizing: border-box;
    }
  }
}
.address-detail {
  font-size: 40px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 64px;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
}
.collection-style {
  position: relative;
  width: 874px;
  .icon-right {
    position: absolute;
    width: 36px;
    height: 36px;
    right: -66px;
    top: 50%;
    transform: translateY(-50%);
    background: url("~@/assets/img/address/icon-right.png") no-repeat center;
    background-size: 100% auto;
  }
}
</style>
