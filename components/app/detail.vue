<template>
  <Base :wxTagExtInfo="wxTagExtInfo" :fnAppJump="onAppJump" v-bind="$props">
    <template v-slot:default><slot /></template>
    <template v-slot:wx-tag><slot name="wx-tag" /></template>
  </Base>
</template>

<script setup>
import Base from "./baseBtn.vue";
import { defineProps, computed } from "vue";
import store from "store";
import { goAppCollectionDetail } from "modules/appTools";
const props = defineProps(["collectionId"]);
const wxTagExtInfo = computed(() =>
  JSON.stringify({
    collectionId: props.collectionId,
    shareChannel: store.getters["share/channel"],
    userId: store.getters["share/userId"],
  })
);
function onAppJump() {
  return goAppCollectionDetail(props.collectionId);
}
</script>
