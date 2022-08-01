<template>
  <div class="content">
    <pull-down-refresh
      :pull-distance="80"
      :animation-duration="500"
      @refresh="emit('refreshData')"
      v-model="refreshLoading"
    >
      <div class="main v-col ai-center">
        <span class="top-light">
          <img
            src="https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v2.0/icon_light.png"
          />
        </span>

        <div class="good-img">
          <Render v-if="displayId" :displayId="displayId" />
        </div>
        <div class="moxingdizuo">
          <img
            src="~img/home/image-model-base.png"
            style="width: 100%; height: 100%"
          />
        </div>
        <div class="good-name-box">
          <img
            v-if="false"
            class="icon-share-circle"
            src="https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/digitalcat/applet-img/v2.0/icon-share-circle.png"
            alt=""
          />
          <div class="good-name">{{ data.collectionName || "" }}</div>
        </div>

        <p class="author">
          <span>创作者</span
          ><span class="author-name">{{ data.author || "--" }}</span>
        </p>
        <div class="amount h-row ai-center">
          <div class="sss-icon">
            <img
              v-if="data.level == 1"
              src="~img/home/icon-level-SR.png"
              style="width: 100%; height: 100%"
            />
            <img
              v-else-if="data.level == 2"
              src="~img/home/icon-level-SSS.png"
              style="width: 100%; height: 100%"
            />
            <img
              v-else
              src="~img/home/icon-level-R.png"
              style="width: 100%; height: 100%"
            />
          </div>
          <span class="num">限量{{ data.distributionNum || "--" }}份</span>
        </div>
        <div class="bottom"></div>
      </div>
      <div class="good-description">
        <div class="good-description-img">
          <img
            v-if="data.collectionStoryUrl"
            :src="data.collectionStoryUrl"
            style="width: 100%; height: 100%"
          />
        </div>
      </div>
    </pull-down-refresh>
  </div>
</template>

<script>
export default {
  name: "DetailContents",
};
</script>
<script setup>
import { ref, watchEffect, watch, defineProps, defineEmits } from "vue";
import Render from "@/components/collection/render";
const props = defineProps({
  from: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    detault: () => {
      return {};
    },
  },
  dataLoading: {
    type: Boolean,
    default: false,
  },
});
const refreshLoading = ref(false);
const emit = defineEmits(["refreshData"]);

const displayId = ref("");
watchEffect(() => {
  if (props.data?.displayContentList?.length) {
    displayId.value = props.data.displayContentList[0].displayModelWeb;
  }
});
watch(
  () => props.dataLoading,
  (v) => {
    if (!v) {
      refreshLoading.value = false;
    }
  }
);
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  font-family: Noto Sans S Chinese;
  .main {
    width: 100%;
    padding-top: 108px;
    height: 1708px;
    background: linear-gradient(0deg, #9f9f9f, #c6c4c4);
    position: relative;
    .good-img {
      width: 100%;
      height: 764px;
      position: relative;
      z-index: 10;
    }
    .moxingdizuo {
      width: 815px;
      height: 202px;
    }
    .good-name-box {
      position: relative;
      margin-top: 187px;
      &.detail {
        margin-top: 247px;
        .icon-share-circle {
          position: absolute;
          top: -184px;
          left: 50%;
          transform: translateX(-50%);
          display: block;
          width: 116px;
          height: 116px;
        }
      }
    }
    .good-name {
      font-size: 60px;
      font-weight: 500;
      color: #333333;
      line-height: 60px;
      height: 60px;
    }
    .author {
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 60px;
      margin-top: 37px;
      .author-name {
        margin-left: 30px;
      }
    }

    .amount {
      width: 467px;
      height: 88px;
      background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.12),
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0)
      );
      background-size: 100% 100%;
      margin-top: 40px;
      .sss-icon {
        width: 92px;
        height: 92px;
        margin-right: 50px;
      }
      .num {
        font-size: 40px;
        font-family: Noto Sans S Chinese;
        font-weight: 500;
        color: #333333;
        line-height: 88px;

        background: linear-gradient(177deg, #f9efd4 0%, #e3c77a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .bottom {
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 100%;
      height: 40px;
      border-radius: 40px 40px 0 0;
      background: #fff;
    }
  }

  .good-description {
    width: 100%;
    background: #fff;
    // border-radius: 40px 40px 0 0;
    box-sizing: border-box;
    padding-bottom: 202px;
    padding: 30px 72px 210px 72px;
    .good-description-img {
      border-radius: 10px 10px 0 0;
      overflow: hidden;
    }
  }
}
.top-light {
  position: absolute;
  top: 0;
  width: 824px;
  height: 420px;
  z-index: 9;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
