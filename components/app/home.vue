<template>
  <Base :wxTagExtInfo="wxTagExtInfo" :fnAppJump="goAppHome" v-bind="$props">
    <template v-slot:default><slot /></template>
    <template v-slot:wx-tag><slot name="wx-tag" /></template>
  </Base>
</template>

<script setup>
import Base from "./baseBtn.vue";
import { computed } from "vue";
import store from "store";
import { goAppHome } from "modules/appTools";
const wxTagExtInfo = computed(() =>
  JSON.stringify({
    shareChannel: store.getters["share/channel"],
    userId: store.getters["share/userId"],
  })
);
</script>
