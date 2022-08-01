import * as THREE from "three";
import BaseRender from "./base";
import {
    deepClone,
    deepEqual,
    createUUID
} from "utils";
import {
    createLog
} from "plugins/log";
const Log = createLog("modules/render", 100);
import {
    debug
} from "config";
import {
    RENDER_CONTENT_EVENT,
    RENDER_CONTENT_STATUS,
    DEBUG_CODE,
} from "./const";
const ModelPlaybackRate = 5;

export default class Render extends BaseRender {
    logCount = 100;
    _currentCameraPosIndex = null;
    _currentContentId = null;
    constructor(config) {
        super(config);
        this.displayContentsMap = new Map(); //contentId:content
        this.sceneEnvTextureMap = new Map(); //imgUrl:EnvTexture
    }

    /*********** 模型控制 ************/
    async AddDisplayContent(contentConfig) {
        Log.log("AddDisplayContent", contentConfig);
        let contentId = contentConfig ? .contentId;
        if (this.displayContentsMap.has(contentId)) {
            let content = this.displayContentsMap.get(contentId);
            if (deepEqual(content.config, contentConfig)) return false;
            this.RemoveDisplayContent(contentId);
        }
        let content = await this._addNewDisplayContent(contentConfig);
        if (!content) return false;
        content.config = contentConfig;
        if (
            typeof this._currentContentId == "undefined" ||
            this._currentContentId === null
        ) {
            this._checkSwitchContentId(contentId);
        }
    }

    RemoveDisplayContent(contentId) {
        if (!this.displayContentsMap.has(contentId)) return false;
        let content = this.displayContentsMap.get(contentId);
        let model = content ? .model;
        let mixer = content ? .mixer;
        model ? .traverse(this._disposeObj3D.bind(this));
        mixer ? .uncacheRoot(model);
        this.scene ? .remove(model);
        this._disposeObj3D(content ? .sceneEnvTexture);

        this.displayContentsMap.delete(contentId);
        this.sceneEnvTextureMap.delete(content ? .sceneEnvUrl);
        return true;
    }

    Start(replay = true) {
        this.Show();
        if (replay) {
            this.Replay();
        } else {
            this.Resume();
        }
        this.startRotation();
    }

    Show() {
        let content = this.getCurrentContent();
        if (!content) return false;
        this._showDisplayContent(content);
        this.render();
    }

    Hide() {
        let content = this.getCurrentContent();
        if (!content) return false;
        this._hideDisplayContent(content);
        this.render();
    }

    Reset() {
        let content = this.getCurrentContent();
        if (!content) return false;
        this._resetDisplayContent(content);
        this.resetCamera();
        return true;
    }

    Replay() {
        let content = this.getCurrentContent();
        if (!content) return false;
        this._resetDisplayContent(content);
        this._startDisplayContent(content);
        return true;
    }

    Pause() {
        let content = this.getCurrentContent();
        if (!content) return false;
        this._pauseDisplayContent(content);
        return true;
    }

    Resume() {
        let content = this.getCurrentContent();
        if (!content) return false;
        this._resumeDisplayContent(content);
        return true;
    }

    SwitchContent(contentId, render = true) {
        let result = this._checkSwitchContentId(contentId);
        if (!result) return result;
        if (render) this.render();
        return true;
    }

    getCurrentContent() {
        if (
            typeof this._currentContentId == "undefined" ||
            this._currentContentId === null
        )
            return null;
        return this.displayContentsMap.get(this._currentContentId);
    }

    dispose() {
        if (debug) {
            this.renderer.render(this.scene, this.camera);
            this._log("before dispose", deepClone(this.renderer.info));
        }
        this.clearContents();
        super.dispose();
    }

    clearContents() {
        let contentIds = this.displayContentsMap.keys();
        for (let contentId of contentIds) {
            this.RemoveDisplayContent(contentId);
        }
        this.displayContentsMap.clear();
        this.sceneEnvTextureMap.clear();
    }

    async _addNewDisplayContent({
        contentId = 0,
        contentName: name,
        displayContentCustomModelArgs: {
            modelUrl,
            spin: spinFlag = 0,
            shadowMesh: shadowMeshName = "",
            reflectionPictureUrl: sceneEnvUrl = "",
            ambientLightIntensity = 1,
            ambientLightColor = "#FFFFFF",
        },
        position = [0, 0, 0],
        angle: rotation = [90, 0, 0],
        scale = 1,
    } = {}) {
        let model = await this._loadModelAsync(modelUrl, (event) => {
            this._emitEvent(RENDER_CONTENT_EVENT.LOAD_PROGRESS, {
                contentId,
                ...event,
            });
        });
        if (!this.isReady) return null;
        this._log("_addNewDisplayContent", modelUrl, model);

        let {
            offsetPosVec3,
            offsetRotQuat,
            offsetScaleVec3
        } =
        this._addDisplayContentMatrix({
            model,
            position,
            rotation,
            scale,
        });

        this._addDisplayContentModelFilter({
            model,
            name,
            shadowMeshName
        });

        let {
            mixer,
            actions
        } = this._addDisplayContentAnimations(
            contentId,
            model
        );

        var sceneEnvTexture = await this._initSceneEnvTexture(sceneEnvUrl);

        this.displayContentsMap.set(contentId, {
            model,
            //动画参数
            hasAnimation: !!(mixer && actions ? .length),
            mixer,
            actions,
            playingActionId: null,
            //环境光
            ambientLightIntensity,
            ambientLightColor: ambientLightColor && new THREE.Color(ambientLightColor),
            //环境反射图片
            sceneEnvUrl,
            sceneEnvTexture,
            //播放状态
            status: RENDER_CONTENT_STATUS.READY,
            animationAutoplay: true,
            animationLoop: true,
            //位置旋转
            offsetPosVec3,
            offsetRotQuat,
            offsetScaleVec3,
            enableScreenTouchRotation: spinFlag == 1,
        });

        let content = this.displayContentsMap.get(contentId);
        this._log(contentId, content);
        return content;
    }
    _addDisplayContentMatrix({
        model,
        position,
        rotation,
        scale
    }) {
        let offsetPosVec3 = this._formatToVec3(position);
        let offsetRotQuat = new THREE.Quaternion();
        offsetRotQuat.setFromEuler(
            new THREE.Euler().setFromVector3(
                this._formatToVec3(rotation).multiplyScalar(Math.PI / 180)
            )
        );
        let offsetScaleVec3 = this._formatToVec3(scale).multiplyScalar(1);

        model.position.copy(offsetPosVec3);
        model.setRotationFromQuaternion(offsetRotQuat);
        model.scale.copy(offsetScaleVec3);

        return {
            offsetPosVec3,
            offsetRotQuat,
            offsetScaleVec3,
        };
    }
    _addDisplayContentModelFilter({
        model,
        name,
        shadowMeshName
    }) {
        model.visible = false;
        model.name = name;
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                //scene中包含阴影mesh，和美术协商统一名字
                if (shadowMeshName && child.name == shadowMeshName) {
                    child.material.transparent = true;
                }
            }
        });
        this.scene ? .add(model);
    }
    _addDisplayContentAnimations(contentId, model) {
        let mixer = null;
        let actions = [];
        if (model.animations ? .length) {
            mixer = new THREE.AnimationMixer(model);
            mixer.uuid = createUUID();
            model.animations.forEach((clip, index) => {
                if (!clip.duration) return false;
                let action = mixer.clipAction(clip);
                action.id = index;
                action.contentId = contentId;
                action.clampWhenFinished = true;
                action.setLoop(THREE.LoopOnce);
                actions.push(action);
                if (
                    this.debug &&
                    this.debugCode & DEBUG_CODE.PLAYBACK_RATE &&
                    typeof ModelPlaybackRate != "undefined"
                ) {
                    action.setEffectiveTimeScale(ModelPlaybackRate);
                }
            });
            let time = Date.now();
            let eventLogCount = 0;
            mixer.addEventListener("finished", (mixerEvent) => {
                let now = Date.now();
                if (eventLogCount++ < 10) {
                    this._log("mixer finished", mixerEvent, now - time);
                }
                time = now;
                let currentAction = mixerEvent.action;
                currentAction.stop();
                let contentId = currentAction.contentId;
                let content = this.displayContentsMap.get(contentId);
                let nextAction = content.actions[currentAction.id + 1];
                if (!nextAction && content.animationLoop) {
                    nextAction = content.actions[0];
                }
                if (nextAction && content.animationAutoplay) {
                    nextAction.play();
                    content.playingActionId = nextAction.id;

                    let eventName =
                        nextAction.id > 0 ?
                        RENDER_CONTENT_EVENT.STEP :
                        RENDER_CONTENT_EVENT.LOOP;
                    this._emitEvent(eventName, mixerEvent);
                } else {
                    content.status = RENDER_CONTENT_STATUS.END;
                    content.playingActionId = null;
                    this._emitEvent(RENDER_CONTENT_EVENT.END, mixerEvent);
                }
            });
            mixer.addEventListener("loop", (mixerEvent) => {
                this._emitEvent(RENDER_CONTENT_EVENT.LOOP, mixerEvent);
            });
        }

        return {
            mixer,
            actions,
        };
    }

    //初始化模型对应场景环境反射（scene.environment）
    _initSceneEnvTexture(imgUrl) {
        if (!imgUrl) return Promise.resolve(null);
        if (this.sceneEnvTextureMap.has(imgUrl)) {
            return Promise.resolve(this.sceneEnvTextureMap.get(imgUrl));
        }
        return new Promise((resolve, reject) => {
            this._addImageTextureAsync(imgUrl)
                .then((tex) => {
                    if (this.sceneEnvTextureMap.has(imgUrl)) {
                        return resolve(this.sceneEnvTextureMap.get(imgUrl));
                    }
                    tex.mapping = THREE.EquirectangularReflectionMapping;
                    tex.needsUpdate = true;
                    this.sceneEnvTextureMap.set(imgUrl, tex);
                    resolve(tex);
                })
                .catch((err) => {
                    Log.error("_initSceneEnvTexture", err);
                    if (this.sceneEnvTextureMap.has(imgUrl)) {
                        return resolve(this.sceneEnvTextureMap.get(imgUrl));
                    }
                    reject(err);
                });
        });
    }

    _updateThreeClock() {
        if (!this.clock) return false;
        var delta = this.clock.getDelta();
        let content = this.getCurrentContent();
        content ? .mixer ? .update(delta);
        return delta;
    }

    _checkSwitchContentId(contentId) {
        if (contentId == this._currentContentId) return false;
        let oldContent = this.getCurrentContent();
        if (oldContent) {
            this._hideDisplayContent(oldContent);
            this._resetDisplayContent(oldContent);
        }
        this._currentContentId = contentId;
        let newContent = this.getCurrentContent();
        if (newContent) {
            this._setLight(
                newContent.ambientLightColor,
                newContent.ambientLightIntensity
            );
            if (this.scene && this.scene.environment !== newContent.sceneEnvTexture) {
                this.scene.environment = newContent.sceneEnvTexture;
            }
            this._emitEvent(
                RENDER_CONTENT_EVENT.CHANGE_ROTATION_FLAG,
                newContent.enableScreenTouchRotation
            );
        }
        return true;
    }

    _hideDisplayContent(content) {
        if (!content || !content.model) return false;
        if (!content.model.visible) return false;
        content.model.visible = false;
        if (content.sceneEnvTexture) {
            if (this.scene && this.scene.environment == content.sceneEnvTexture) {
                this.scene.environment = null;
            }
        }
        return true;
    }
    _showDisplayContent(content) {
        if (!content || !content.model || !this.scene) return false;
        if (content.model.visible) return false;
        if (content.sceneEnvTexture) {
            if (this.scene && this.scene.environment !== content.sceneEnvTexture) {
                this.scene.environment = content.sceneEnvTexture;
            }
        }
        content.model.visible = true;
        return true;
    }
    _resetDisplayContent(content) {
        if (!content || !content.hasAnimation) return false;
        if (content.status == RENDER_CONTENT_STATUS.READY) return false;
        let {
            model,
            mixer,
            offsetPosVec3,
            offsetRotQuat,
            offsetScaleVec3
        } =
        content || {};
        mixer ? .stopAllAction();
        model ? .position.copy(offsetPosVec3);
        model ? .setRotationFromQuaternion(offsetRotQuat);
        model ? .scale.copy(offsetScaleVec3);
        content.playingActionId = null;
        content.status = RENDER_CONTENT_STATUS.READY;
        this._log("_resetDisplayContent");
        return true;
    }
    _startDisplayContent(content) {
        if (!content || !content.hasAnimation) return false;
        if (
            content.status != RENDER_CONTENT_STATUS.READY &&
            content.status != RENDER_CONTENT_STATUS.END
        )
            return false;
        content.actions[0].reset().play();
        content.playingActionId = 0;
        content.status = RENDER_CONTENT_STATUS.PLAYING;
        this._log("_startDisplayContent");
        return true;
    }
    _resumeDisplayContent(content) {
        if (!content || !content.hasAnimation) return false;
        if (content.status != RENDER_CONTENT_STATUS.PAUSE) return false;
        content.mixer.timeScale = 1;
        content.status = RENDER_CONTENT_STATUS.PLAYING;
        this._log("_resumeDisplayContent");
        return true;
    }
    _pauseDisplayContent(content) {
        if (!content || !content.hasAnimation) return false;
        if (content.status != RENDER_CONTENT_STATUS.PLAYING) return false;
        content.mixer.timeScale = 0;
        content.status = RENDER_CONTENT_STATUS.PAUSE;
        this._log("_pauseDisplayContent");
        return true;
    }
    _stopDisplayContent(content) {
        if (!content || !content.hasAnimation) return false;
        if (content.status == RENDER_CONTENT_STATUS.END) return false;
        content.mixer.stopAllAction();
        content.playingActionId = null;
        content.status = RENDER_CONTENT_STATUS.END;
        this._log("_stopDisplayContent");
        return true;
    }

    //根据传入val（number/object/Vector3/Array） 返回{x,y,z}结构的Vector3
    _formatToVec3(val) {
        let x, y, z;
        if (Array.isArray(val)) {
            //如果传入数组：取前三个值
            x = val[0];
            y = val[1];
            z = val[2];
        } else if (typeof val === "object") {
            //如果本身就是Vector3 直接返回
            if (val.isVector3) return val;
            //否则取x,y,z字段
            x = val.x;
            y = val.y;
            z = val.z;
        } else if (typeof val === "number") {
            //如果传入数字：应用到每一个值
            x = y = z = val;
        } else {
            x = y = z = 0;
        }
        return new THREE.Vector3(x, y, z);
    }
}