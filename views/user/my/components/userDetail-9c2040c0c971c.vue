<template>
  <div class="user-detail">
    <div class="avatar-box">
      <img
        class="avatar-img"
        :src="userDetail?.userIcon"
        @error="onAvatarError"
        v-if="userDetail?.userIcon && isRealAvatar"
      />
      <img class="avatar-img" src="~img/user/default-avatar.png" v-else />
    </div>
    <div class="right-info">
      <div class="name-box">{{ userDetail?.usernickName }}</div>
      <div class="id-box" v-if="userId">ID:{{ userId }}</div>
      <div class="address-box" v-if="userDetail?.userDigitalAddress">
        <div class="chainAddress">
          区块链地址：{{ userDetail?.userDigitalAddress }}
        </div>
        <div class="copy-btn" @click="goBlockChainPage">更多</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import store from "store";
import Router from "router";
const userDetail = computed(() => store.getters["user/getUserInfo"]);
const isRealAvatar = ref(true);
const userId = computed(() => {
  let userId = userDetail.value?.userId || "";
  if (userId.length <= 10) {
    return userId;
  }
  return userId.substring(userId.length - 10, userId.length);
});
watch(
  () => userDetail.value?.userIcon,
  () => {
    isRealAvatar.value = true;
  }
);
function onAvatarError() {
  isRealAvatar.value = false;
}
function goBlockChainPage() {
  Router.push({
    name: "UserBlockChain",
  });
}
</script>

<style lang="less" scoped>
.user-detail {
  width: 100%;
  padding: 0 51px 66px;
  .h-row();
  .avatar-box {
    width: 164px;
    height: 164px;
    border-radius: 50%;
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .right-info {
    display: flex;
    flex-direction: column;
    margin-left: 49px;
    font-size: 25px;
    font-weight: normal;
    color: @gray;
    .name-box {
      font-size: 48px;
      font-weight: 500;
      color: #222222;
    }
    .id-box {
      padding-top: 36px;
    }
    .address-box {
      padding-top: 23px;
      display: flex;
      .chainAddress {
        width: 630px;
        height: 37px;
        .ellipsis();
      }
      .copy-btn {
        margin-left: 43px;
        font-size: 28px;
        font-weight: bold;
        color: #629dff;
      }
    }
  }
}
</style>
