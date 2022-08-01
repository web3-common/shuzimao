// import { isIOS } from "utils";
import {
    isDev
} from "config";
export const DISPLAY_CONTENT_TYPE = {
    VIDEO: 0,
    MODEL: 1,
    VIDEO_MODEL: 2,
};
export const FPS = 30;
export const AutoLoopSecond = 14.4; //自动旋转一圈所需时间（秒）

export const RENDER_STATUS = {
    UNREADY: 0,
    READY: 1,
    INITIALIZING: 11,
    DISPOSING: 12,
};

export const RENDER_CONTENT_EVENT = {
    START: "model-start",
    STEP: "model-step",
    END: "model-end",
    LOOP: "model-loop",
    LOAD_PROGRESS: "model-load-progress",
    V_LOADING: "video-waiting",
    V_PLAYING: "video-playing",
    CHANGE_ROTATION_FLAG: "model-can-rotate",
    CLICK: "model-click",
};

export const RENDER_CONTENT_STATUS = {
    READY: 1,
    PLAYING: 2,
    PAUSE: 3,
    END: 4,
};

export const CameraPositions = [
    [0, 0, 1],
    [0, 0, 2],
];

export const DEBUG_CODE = {
    LOG: 1 << 0,
    VIDEO_SHOW: 1 << 1,
    PLAYBACK_RATE: 1 << 2,
};

export const DEFAULT_DEBUG_CODE =
    DEBUG_CODE.LOG | !DEBUG_CODE.VIDEO_SHOW | !DEBUG_CODE.PLAYBACK_RATE;

export const DevDisplayContent = isDev && {
    contentId: 0,
    contentName: "测试名称",
    contentType: DISPLAY_CONTENT_TYPE.MODEL,
    // contentType: DISPLAY_CONTENT_TYPE.VIDEO,
    // contentType: DISPLAY_CONTENT_TYPE.VIDEO_MODEL,
    displayContentCustomModelArgs: {
        modelUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/test/ar_contact/Car_glb.glb",
        // modelUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/test/gltf/env_test/Gold.glb",
        spin: 1,
        shadowMesh: "",
        // reflectionPictureUrl: "",
        reflectionPictureUrl: "https://arhello-gift.oss-cn-hangzhou.aliyuncs.com/test/digital_test/env.jpg",
        ambientLightIntensity: 0.2,
        ambientLightColor: "#FFFFff",
    },
    // displayContentCustomVideoArgs: {
    //     videoUrl: "./resources/media/water.mp4",
    // },
    // displayContentCustomVideoModelArgs: {
    //     projectTotalTime: 18,
    //     // modelUrl: "./resources/model/ARCard_Animation.glb",
    //     modelUrl: "./resources/model/tayin.fbx",
    //     modelStartTime: 1.2,
    //     modelEndTime: 10,
    //     // videoUrl: "./resources/media/water.mp4",
    //     videoUrl: "./resources/media/tayin.mp4",
    //     videoStartTime: 2.0,
    //     videoEndTime: 16,
    //     // meshName: "Plane_Video",
    //     meshName: "Mod_TaYin_ShiPin01",
    //     // musicUrl: "./resources/media/music.mp3",
    //     musicUrl: "",
    //     spin: 1,
    //     shadowMesh: "Mod_ZongShua",
    //     wonderGate: 0,
    //     gateMeshList: ["Mod_ZongShua"],
    //     reflectionPictureUrl: "",
    //     ambientLightIntensity: 1,
    //     ambientLightColor: "#FF0000",
    // },
    // position: [0, 0, 0],
    position: [0, -0.3, 0],
    // angle: [90, 0, 0],
    angle: [0, 0, 0],
    // scale: 0.0004,
    // scale: 0.004,
    // scale: 0.001,
    // scale: 0.01,
    scale: 0.05,
};