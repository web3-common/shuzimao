<template>
  <div class="bottom-tab-bar">
    <div
      class="tab-item"
      v-for="(item, index) in list"
      :key="index"
      @click="onTabItem(index)"
    >
      <img
        :src="currentIndex == index ? item.iconSelected : item.icon"
        class="tab-icon"
      />
      <div class="tab-name" :class="{ current: currentIndex == index }">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import IconHomeOn from "img/common/tab-bar/icon-home-on.png";
import IconHomeOff from "img/common/tab-bar/icon-home-off.png";
// import IconArOn from "img/common/tab-bar/icon-ar-on.png";
// import IconArOff from "img/common/tab-bar/icon-ar-off.png";
import IconUserOn from "img/common/tab-bar/icon-user-on.png";
import IconUserOff from "img/common/tab-bar/icon-user-off.png";
export default {
  Name: "BottomTabBar",
  data() {
    return {
      currentIndex: 0,
      list: [
        {
          icon: IconHomeOff,
          iconSelected: IconHomeOn,
          name: "首页",
          routeName: "Home",
        },
        // {
        //   icon: IconArOff,
        //   iconSelected: IconArOn,
        //   name: "展厅",
        //   routeName: "ArHall",
        // },
        {
          icon: IconUserOff,
          iconSelected: IconUserOn,
          name: "我的",
          routeName: "User",
        },
      ],
    };
  },
  mounted() {
    this.initIndexByRoute();
  },
  methods: {
    initIndexByRoute() {
      const RouteName = this.$route.name;
      this.list.forEach((item, index) => {
        if (RouteName == item.routeName) {
          this.currentIndex = index;
        }
      });
    },
    onTabItem(index) {
      let tabItem = this.list[index] || {};
      if (tabItem.routeHref) {
        return this.$router.push(tabItem.routeHref);
      }
      if (tabItem.routeName) {
        return this.$router.push({
          name: tabItem.routeName,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@fontColor: #333;
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: @bottomTabBarHeight;
  justify-content: space-around;
  background: fade(white, 96%);
  box-shadow: 0px 0px 7px 0px rgba(242, 237, 233, 0.2);
  .h-row();
  .ai-center();
  .tab-item {
    width: 100px;
    height: 100%;
    .v-col();
    .jc-center();
    .ai-center();
    .tab-icon {
      width: 64px;
      height: 64px;
    }
    .tab-name {
      margin-top: 10px;
      font-size: 30px;
      color: fade(@fontColor, 60%);
      .txt-c();
      &.current {
        color: @fontColor;
      }
    }
  }
}
</style>
