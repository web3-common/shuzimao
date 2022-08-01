<template>
  <div class="sms-wrapper">
    <NavBar position="absolute" :backFn="onBack" />
    <div class="padding-1" />
    <div class="title-box">
      <div class="title">请输入验证码</div>
      <div class="title-tips">
        <span v-if="isLockSend">验证码已发送至</span>
        <span v-else>验证码将发送至</span>
        <span class="mobile">{{ formatMobile(mobile) }}</span>
      </div>
    </div>
    <div class="sms-box">
      <SmsCode class="sms-code" @finish="verifySmsCode" ref="refSmsCode" />
      <div class="sms-tips" v-if="isLockSend">
        <em class="light">{{ fillZero(lockSendSecond) }}</em>
        秒后重新发送验证码
      </div>
      <div class="sms-tips" @click="sendSmsCode" v-else>点击重新获取验证码</div>
    </div>
    <div class="padding-1" />
    <div class="btn-box">
      <button class="main-btn" @click="sendSmsCode" v-show="!isLockSend">
        重新发送验证码
      </button>
    </div>
    <div class="padding-2" />
  </div>
</template>

<script setup>
import SmsCode from "./sms-code.vue";
import { ref, computed, defineEmits, onUnmounted } from "vue";
import store from "store";
import * as Api from "modules/api";
import { ErrMsg } from "const";
import { formatMobile, fillZero, now } from "utils";
import message from "plugins/message";
import { createLog } from "plugins/log";
const { log, error: logError } = createLog("components/login/sms");
const emits = defineEmits(["back", "succ"]);
const refSmsCode = ref(null);
const mobile = computed(() => store.getters["login/mobile"]);
const lockSendSecond = computed(() => store.getters["login/lockSendSecond"]);
const isLockSend = computed(() => lockSendSecond.value > 0);
onUnmounted(() => {
  store.dispatch("login/stopSendCountDown");
});
function onBack() {
  emits("back");
  return false;
}
function sendSmsCode() {
  if (isLockSend.value) return Promise.reject("lock");
  if (!mobile.value) return Promise.reject("no mobile");
  return store
    .dispatch("login/sendSmsCode")
    .catch((err) => {
      logError("sendSmsCode", err);
      message.showToast(err.errMsg || "发送失败");
    })
    .finally(() => {
      refSmsCode.value?.clean();
    });
}
let isLockVerify = false;
function verifySmsCode(smsCode) {
  if (isLockVerify) return Promise.reject("lock");
  isLockVerify = true;
  return Api.post(
    "/login/validateCodeApp",
    {
      areaCode: "86",
      phone: mobile.value,
      securityCode: smsCode,
      timestamp: now(),
    },
    {
      checkLogin: false,
      rsaEncryptList: ["phone"],
    }
  )
    .then((res) => {
      log("verifySmsCode", res);
      emits("succ");
    })
    .catch((err) => {
      logError("verifySmsCode", err);
      let errMsg = err?.errMsg || ErrMsg;
      if (err?.errCode == Api.ErrorCode.LOGIN_CODE_CHECK_WRONG) {
        errMsg = "验证码不正确请重新输入";
      }
      message.showToast(errMsg);
    })
    .finally(() => {
      isLockVerify = false;
    });
}
</script>

<style lang="less" scoped>
@gray: #414141;
.sms-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  padding: 0 160px;
  background: white;
  color: @gray;
  .v-col();
  .txt-c();
  .padding-1 {
    flex: 1;
  }
  .padding-2 {
    flex: 2;
  }
  .title-box {
    height: 150px;
    .txt-l();
    .title {
      font-size: 60px;
    }
    .title-tips {
      margin-top: 36px;
      font-size: 42px;
      color: fade(@gray, 70%);
      .mobile {
        color: #222;
      }
    }
  }
  .sms-box {
    margin-top: 82px;
    .sms-tips {
      margin-top: 48px;
      .txt-l();
      .light {
        color: @blue;
      }
    }
  }
  .btn-box {
    height: 116px;
    .main-btn {
      width: 100%;
      height: 100%;
      font-size: 40px;
      color: white;
      background: #222;
      border-radius: 4px;
      .center();
    }
  }
  .icon-back {
    position: absolute;
    top: 43px;
    left: 43px;
    width: 56px;
    height: 56px;
  }
}
</style>
