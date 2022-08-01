<template>
  <div class="action-list">
    <div
      class="action-item"
      v-for="(action, index) in actionList"
      :key="index"
      @click="tapAction(index)"
    >
      <img class="action-icon" :src="action.icon" />
      <div class="action-txt">{{ action.name }}</div>
      <img class="right-arrow" src="~img/common/icon-right-arrow@2x.png" />
    </div>

    <div class="logout-box">
      <div class="logout-btn" @click="logout">退出登录</div>
    </div>
  </div>
</template>

<script setup>
import router from "router";
import { defineEmits } from "vue";
import Login from "plugins/login";
import Message from "plugins/message";
import { isDev, debug } from "config";
const emit = defineEmits(["showCustom"]);
const actionList = [
  {
    name: "联系客服",
    icon: require("img/user/my/icon-help.png"),
    action: () => {
      emit("showCustom");
    },
  },
  // {
  //   name: "账号管理",
  //   icon: require("img/user/my/icon-account.png"),
  //   route: {
  //     name: "UserAccount",
  //   },
  // },
  {
    name: "地址管理",
    icon: require("img/user/my/icon-map.png"),
    route: {
      name: "AddressList",
      query: {
        from: "my",
      },
    },
  },
  {
    name: "服务协议",
    icon: require("img/user/my/icon-file.png"),
    route: {
      name: "ViewUserAgreement",
    },
  },
  {
    name: "个人隐私保护政策",
    icon: require("img/user/my/icon-protect.png"),
    route: {
      name: "ViewPrivacyAgreement",
    },
  },
];
if (isDev && debug) {
  actionList.push({
    name: "测试页",
    icon: null,
    route: {
      name: "Test",
    },
  });
}
function tapAction(index) {
  const action = actionList[index];
  if (action.action) {
    action.action();
  } else if (action.route) {
    router.push(action.route);
  }
}
function logout() {
  Message.showModal({
    title: "确认要退出登录吗？",
    content: "退出后无法查看和购买数字文创啦！",
    showCancel: true,
    width: "60%",
    contentCls: "st-large",
    btnCls: "st-large",
    cancelText: "取消",
    confirmText: "确定",
    success: ({ confirm } = {}) => {
      if (confirm) {
        Login.logout();
        router.replace({
          name: "Home",
        });
      }
    },
  });
}
</script>

<style lang="less" scoped>
.action-list {
  margin-top: 27px;
  width: 100%;
  flex: 1;
  background: white;
  padding: 0 48px;
  .action-item {
    height: 159px;
    display: flex;
    justify-content: left;
    align-items: center;
    position: relative;
    border-bottom: 1px solid fade(#eee, 50%);
    .action-icon {
      width: 50px;
      height: 50px;
    }
    .action-txt {
      margin-left: 21px;
      font-size: 36px;
      color: #222;
    }
    .right-arrow {
      position: absolute;
      right: 14px;
      top: 50%;
      margin-top: -18px;
      width: 36px;
      height: 36px;
    }
  }
  .logout-box {
    width: 100%;
    padding: 100px 0;
    .logout-btn {
      margin: auto;
      width: 760px;
      height: 116px;
      .center();
      background: #222222;
      color: white;
      font-size: 42px;
      text-align: center;
      border-radius: 4px;
    }
  }
}
</style>
