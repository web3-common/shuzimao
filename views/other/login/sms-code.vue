<template>
  <div class="sms-code-wrapper">
    <input
      class="hide-ipt"
      v-model="smsCode"
      type="tel"
      @input="onInputSmsCode"
      @focus="onFocus"
      @blur="setFocusFalse"
      ref="refHideIpt"
    />
    <div class="sms-digit-box" @click="focus">
      <div
        v-for="i in codeLength"
        :key="i"
        class="sms-digit"
        :class="{
          'st-focus': i == 1 && isIptFocus,
          'st-active': smsCode.length >= i,
        }"
      >
        {{ String(smsCode)[i - 1] }}
        <div
          class="bottom-border"
          :style="{
            'background-position': `-${(i - 1) * 100}% 0`,
            'background-size': `${codeLength}00% 100%`,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose } from "vue";
import { useBoolean } from "hooks";
import { filterNumber } from "utils";
const props = defineProps({
  codeLength: {
    type: Number,
    default: 6,
  },
});
const emits = defineEmits(["finish"]);
const smsCode = ref("");
const refHideIpt = ref(null);
const [isIptFocus, { setTrue: setFocusTrue, setFalse: setFocusFalse }] =
  useBoolean(false);
function onInputSmsCode() {
  let _smsCode = String(smsCode.value);
  _smsCode = filterNumber(_smsCode);
  if (_smsCode.length > props.codeLength) {
    _smsCode = _smsCode.substr(0, props.codeLength);
  }
  if (smsCode.value != _smsCode) {
    smsCode.value = _smsCode;
  }
  if (_smsCode.length === props.codeLength) {
    emits("finish", _smsCode);
    blur();
  }
}
function onFocus() {
  setFocusTrue();
  const el = refHideIpt.value;
  if (el) {
    const pos = smsCode.value?.length || 6;
    el.setSelectionRange?.(pos, pos);
    el.selectionStart = pos;
    el.selectionEnd = pos;
  }
}
function clean() {
  smsCode.value = "";
}
function focus() {
  refHideIpt.value?.focus();
}
function blur() {
  refHideIpt.value?.blur();
}
defineExpose({ clean, focus, blur });
</script>

<style lang="less" scoped>
@gray: #414141;
.sms-code-wrapper {
  position: relative;
  width: 100%;
  height: 134px;
  .hide-ipt {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 0;
    user-select: auto;
  }
  .sms-digit-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    .h-row();
    .jc-sb();
    .sms-digit {
      position: relative;
      width: 100px;
      height: 100%;
      font-size: 72px;
      font-weight: bold;
      .center();
      .bottom-border {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 1px;
        background: fade(@gray, 50%);
      }
      .bottom-border-light {
        height: 3px;
        background: linear-gradient(90deg, @logoColor1, @logoColor2);
        background-size: 600% 100%;
      }
      &.st-focus .bottom-border {
        .bottom-border-light();
      }
      &.st-active .bottom-border {
        .bottom-border-light();
      }
    }
  }
}
</style>
