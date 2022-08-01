<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component
        :is="Component"
        :key="route.name"
        v-if="route.meta.keepAlive"
      />
    </keep-alive>
    <component :is="Component" :key="route.name" v-if="!route.meta.keepAlive" />
  </router-view>
</template>

<script setup></script>

<style lang="less">
html,
body,
#app {
  width: 100%;
  height: 100%;
}
body {
  background: #eeeeee;
}
.van-popup {
  background-color: transparent !important;
}
</style>
