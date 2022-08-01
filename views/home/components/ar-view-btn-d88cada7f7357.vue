<template>
  <div class="ar-view-btn" v-if="isShow">
    <img
      class="ar-view-btn-img"
      src="https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v1.3/home/icon-watch-ar-shadow.png"
      @error="onImgError"
      @click="onTabBtn"
    />
  </div>
  <teleport to="body">
    <div class="modal-wrapper" v-if="isShowModel">
      <div class="modal-mask" @click="hideModel" />
      <div class="modal-box">
        <div class="modal-content-area">
          <p class="modal-title-text">
            为了实现更好的体验，请使用“数字猫”APP查看AR！
          </p>
          <p class="modal-content-text"></p>
        </div>
        <div class="modal-btns">
          <div class="modal-btn btn-style-light" @click="hideModel">取消</div>
          <AppHome class="modal-btn" @click="tapWatchApp">
            <span>打开APP</span>
          </AppHome>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import AppHome from "components/app/home";
import { ref } from "vue";
import { pushEvent } from "modules/umLog";
const isShow = ref(true);
const isShowModel = ref(false);
function onImgError(e) {
  console.error("home/ar-view-btn/onImgError", e);
  isShow.value = false;
}
function onTabBtn() {
  isShowModel.value = true;
  pushEvent("click_ar_view");
}
function hideModel() {
  isShowModel.value = false;
}
function tapWatchApp() {
  hideModel();
}
</script>

<style lang="less" scoped>
.ar-view-btn {
  position: fixed;
  right: 0;
  bottom: @bottomTabBarHeight;
  padding-bottom: 19px;
  z-index: 10;
  &-img {
    height: 280px;
    width: auto;
    object-fit: contain;
  }
}
.modal-wrapper {
  @zIndex: 200;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: @zIndex;
  .center();
  .txt-c();

  .modal-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: @zIndex;
    background: black;
    opacity: 0.7;
  }

  .modal-box {
    position: relative;
    z-index: @zIndex+1;
    box-sizing: border-box;
    width: 600px;
    background: white;
    overflow: hidden;
    border-radius: 6px;

    .modal-content-area {
      box-sizing: border-box;
      padding: 72px 52px 102px;
      .center();
      .v-col();
      .txt-l();

      .modal-title-text {
        font-size: 38px;
        font-weight: bold;
        line-height: 50px;
        color: #333;
      }
      .modal-content-text {
        margin-top: 15px;
        font-size: 24px;
        color: #999;
      }
    }

    .modal-btns {
      .flex();
      .jc-center();

      .modal-btn {
        @btnBg: #222;
        position: relative;
        box-sizing: box;
        width: 240px;
        height: 88px;
        font-size: 36px;
        color: white;
        background: @btnBg;
        border: 3px solid @btnBg;
        border-radius: 2px;
        .center();
        .txt-c();
        .ellipsis();
        margin-left: 40px;
        margin-bottom: 80px;
        &:first-of-type {
          margin-left: 0;
        }
        &.btn-style-light {
          background: white;
          color: #333;
        }
      }
    }
  }
}
</style>
