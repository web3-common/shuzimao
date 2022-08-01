<template>
  <div class="mobile-wrapper">
    <div class="logo-box">
      <img class="logo-img" src="~assets/img/common/logo.png" />
    </div>
    <div class="title-box">你好，欢迎来到数字猫！</div>
    <div class="top-padding" />
    <div class="input-box">
      <div class="main-line">
        <div class="area-code">+86</div>
        <input
          class="mobile-ipt"
          :value="mobile"
          @input="onInputMobile"
          v-mobile-ipt="mobile"
          type="tel"
          placeholder="请输入您的手机号"
        />
      </div>
      <div class="input-tips">未注册的手机号验证后自动创建账户</div>
    </div>
    <button class="main-btn" :disabled="!canSubmit" @click="submitMobile">
      获取短信验证码
    </button>
    <div class="bottom-padding" />
    <div class="bottom-agreement-box" @click="toggleCheckAgreement">
      <img
        :src="hasCheckAgreement ? bottomIconChecked : bottomIconUncheck"
        class="bottom-icon"
      />
      <div class="bottom-txt">
        登录即表明同意
        <span class="txt-link" @click.stop="goUserAgreement">
          《服务协议》
        </span>
        和
        <span class="txt-link" @click.stop="goPrivacyAgreement">
          《个人信息保护政策》
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import bottomIconUncheck from "img/common/icon-circle.png";
import bottomIconChecked from "img/common/icon-succ-circle.png";
import { ref, computed, defineEmits } from "vue";
import router from "router";
import store from "store";
import message from "plugins/message";
import { useBoolean } from "hooks";
import { validMobile, filterNumber } from "utils";
const emits = defineEmits(["submit"]);
const mobile = ref("");
const canSubmit = computed(() => /^\d{11}$/.test(mobile.value));
const [hasCheckAgreement, { toggle: toggleCheckAgreement }] = useBoolean(false);
function onInputMobile(event) {
  const el = event.target || event.srcElement || event.currentTarget;
  let value = filterNumber(el.value);
  if (value.length > 11) value = value.substr(0, 11);
  mobile.value = value;
}
function submitMobile() {
  if (!validMobile(mobile.value)) {
    return message.showToast("手机号格式不正确，请重新输入");
  }
  if (!hasCheckAgreement.value) {
    return message.showToast("请先勾选下方服务协议");
  }
  store.commit("login/setMobile", mobile.value);
  store
    .dispatch("login/sendSmsCode")
    .then(() => {
      emits("submit");
    })
    .catch((err) => {
      console.error("login/mobile-submitMobile", err);
      message.showToast(err.errMsg);
    });
}
function goUserAgreement() {
  router.push({
    name: "ViewUserAgreement",
  });
}
function goPrivacyAgreement() {
  router.push({
    name: "ViewPrivacyAgreement",
  });
}
</script>

<style lang="less" scoped>
@btnWidth: 760px;
@gray: #414141;
.mobile-wrapper {
  width: 100%;
  height: 100%;
  color: @gray;
  overflow-y: scroll;
  overflow-x: hidden;
  .v-col();
  .ai-center();
  .txt-c();

  .top-padding {
    flex: 1;
    width: 100%;
    min-height: 100px;
  }
  .bottom-padding {
    flex: 2;
    width: 100%;
    min-height: 200px;
  }

  .logo-box {
    margin-top: 267px;
    width: 220px;
    height: 220px;
    .logo-img {
      width: 100%;
      height: 100%;
    }
  }
  .title-box {
    margin-top: 119px;
    font-size: 56px;
    font-weight: 500;
  }
  .input-box {
    width: @btnWidth;
    .txt-l();
    .main-line {
      box-sizing: content-box;
      height: 48px;
      line-height: 48px;
      padding-bottom: 38px;
      border-bottom: 1px solid fade(@gray, 30%);
      .h-row();
      .ai-center();
      .area-code {
        font-size: 40px;
        padding-right: 36px;
        height: 100%;
        opacity: 0.3;
        border-right: 1px solid @gray;
      }
      .mobile-ipt {
        margin-left: 55px;
        height: 100%;
        flex: 1;
        color: @gray;
        font-size: 42px;
        user-select: auto;
        &::placeholder {
          opacity: 0.3;
        }
      }
    }
    .input-tips {
      font-size: 36px;
      margin-top: 53px;
      opacity: 0.3;
    }
  }
  .main-btn {
    margin-top: 154px;
    width: @btnWidth;
    height: 116px;
    font-size: 40px;
    color: white;
    background: #222;
    border-radius: 6px;
    flex-shrink: 0;
    transition: opacity 0.3s ease-in-out;
    .center();
    &:active {
      opacity: 0.8;
      transition: opacity 0.1s ease-in-out;
    }
    // disabled 状态要覆盖active 防止禁用时点击事件导致active生效
    &:disabled {
      opacity: 0.3;
    }
  }
  .bottom-agreement-box {
    width: 100%;
    // height: 180px;
    padding: 0 113px 93px;
    flex-shrink: 0;
    .h-row();
    .bottom-icon {
      width: 40px;
      height: 40px;
    }
    .bottom-txt {
      margin-left: 25px;
      line-height: 40px;
      font-size: 30px;
      color: #333;
      .txt-l();
      .txt-link {
        color: @blue;
      }
    }
  }
}
</style>
