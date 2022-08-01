<template>
  <div class="chain-box">
    <NavBar title="墨群链" background="white" />
    <div class="content-box">
      <div class="title-tip">区块链地址是您持有数字文创的唯一地址</div>
      <div class="chain-box">
        <div class="chain-box-left">
          {{ userDigitalAddress }}
        </div>
        <div class="chain-box-right">
          <div class="line-box"></div>
          <div class="imgbox" @click="copyChain">
            <img class="imgbox" src="~img/user/icon-copy.png" />
          </div>
        </div>
        <div class="ding">
          <img class="ding-img" src="~img/collection/icon-stamp-moqun.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import store from "store";
import { computed, onMounted } from "vue";
import Message from "plugins/message";
import { copyClipboardData } from "utils";
import { ErrMsg } from "const";
const userDetail = computed(() => store.getters["user/getUserInfo"]);
const userDigitalAddress = computed(() => userDetail.value?.userDigitalAddress);
const copyChain = async () => {
  let res = await copyClipboardData(userDigitalAddress.value);
  Message.showToast(res ? "复制成功！" : "复制失败");
};
const getUserInfo = async () => {
  try {
    await store.dispatch("user/getUserData");
  } catch (error) {
    Message.showModal(error?.errMsg || ErrMsg);
  }
};
onMounted(getUserInfo);
</script>

<style lang="less" scoped>
.chain-box {
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
  .top-title {
    padding-top: 104px;
    height: 198px;
    text-align: center;
    margin-bottom: 30px;
    background-color: #ffffff;
    font-size: 54px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #333333;
  }
  .content-box {
    margin-top: 30px;
    padding-top: 70px;
    // height: calc(100% - 228px);
    height: 100%;
    background-color: #ffffff;
  }
  .title-tip {
    text-align: center;
    font-size: 40px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #333333;
  }
  .chain-box {
    width: 918px;
    height: 189px;
    background: linear-gradient(-90deg, #ffe9bf, #ffdc98);
    border-radius: 20px;
    margin: auto;
    margin-top: 39px;
    display: flex;
    position: relative;
  }
  .chain-box-left {
    font-size: 40px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #333333;
    width: 746px;
    padding: 33px 29px 53px 23px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    line-height: 45px;
  }
  .chain-box-right {
    display: flex;
    align-items: center;
  }
  .line-box {
    width: 1px;
    height: 138px;
    background-color: #666666;
    margin-right: 60px;
  }
  .imgbox {
    display: block;
    width: 50px;
    height: 50px;
  }
  .ding {
    width: 186px;
    height: 186px;
    position: absolute;
    top: 163px;
    left: 691px;
  }
  .ding-img {
    width: 186px;
    height: 186px;
    display: block;
  }
}
</style>
