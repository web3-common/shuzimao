<template>
  <div class="copyright">
    <img class="copyright-logo" src="~img/user/my/logo-sensetime.png" />
    <div class="copyright-text">提供技术支持</div>
  </div>
</template>

<style lang="less" scoped>
.copyright {
  width: 100%;
  height: 142px;
  display: flex;
  flex-shrink: 0;
  .center();
  &-logo {
    width: 141px;
    height: 40px;
  }
  &-text {
    margin-left: 19px;
    font-size: 32px;
    font-weight: 400;
    color: @gray;
  }
}
</style>
