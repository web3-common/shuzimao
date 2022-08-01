<template>
  <div class="login-page-wrapper">
    <NavBar position="fixed" @back="onLoginBack" />
    <mobile-box @submit="showSms" />
    <transition name="slide-fade">
      <Sms
        class="sms-wrapper"
        @back="showMobile"
        @succ="onLoginSucc"
        v-if="isShowSms"
      />
    </transition>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
};
</script>
<script setup>
import MobileBox from "./mobile.vue";
import Sms from "./sms.vue";
import { computed } from "vue";
import router from "router";
import { useRoute } from "vue-router";
import message from "plugins/message";
import PluginLogin from "plugins/login";
import { createLog } from "plugins/log";
import { useBoolean } from "hooks";
const route = useRoute();
const { log, error: logError } = createLog("views/other/login");
const [isShowSms, { setTrue: showSms, setFalse: showMobile }] =
  useBoolean(false);
const next = computed(() => route.query?.next || "/");
const nextType = computed(() => {
  let _nextType = route.query?.nextType;
  if (_nextType === undefined || _nextType === null) return 0;
  return Number(_nextType);
});
const nextJson = computed(() => {
  let _nextJson = route.query?.nextJson;
  try {
    if (_nextJson?.startsWith("%")) {
      _nextJson = decodeURIComponent(_nextJson);
    }
    _nextJson = _nextJson && JSON.parse(_nextJson);
  } catch (err) {
    logError("login.nextJson:", err);
    return null;
  }
  return _nextJson;
});
log("next", {
  nextType: nextType.value,
  next: next.value,
  nextJson: nextJson.value,
});
function onLoginBack() {
  PluginLogin.back?.();
  PluginLogin.back = null;
}
function onLoginSucc() {
  log("onLoginSucc", nextJson.value, next.value, nextType.value);
  const routerNext = nextJson.value || next.value;
  switch (nextType.value) {
    case 1:
      router.push(routerNext);
      break;
    case 2:
      router.back();
      break;
    case -1:
      break;
    case 0:
    default:
      router.replace(routerNext);
  }
  message.showToast("登录成功！");
  PluginLogin.next?.();
  PluginLogin.next = null;
}
</script>

<style lang="less" scoped>
.login-page-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  .sms-wrapper {
    z-index: 101;
  }
}
</style>
