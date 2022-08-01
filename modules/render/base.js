import * as THREE from "three";
import {
    FBXLoader
} from "three/examples/jsm/loaders/FBXLoader";
import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
// import LogStats from "./logStats";
import {
    deepClone,
    now,
    getExtension
} from "utils";
import {
    createLog
} from "plugins/log";
const Log = createLog("modules/render/base");
import {
    debug
} from "config";
import {
    FPS,
    AutoLoopSecond,
    RENDER_STATUS,
    CameraPositions,
    DEFAULT_DEBUG_CODE,
} from "./const";

let _cachePerformance = null;
export default class BaseRender extends THREE.EventDispatcher {
    logCount = 100;
    _currentCameraPosIndex = null;
    rendererHighDprThreshold = 5.0;
    constructor({
        debug = debug,
        canvasSelector = ".canvas",
        width,
        height,
        fov = 40,
        maxControlScale = 8,
        minControlScale = 0.25,
        encoding = THREE.sRGBEncoding,
    } = {}) {
        super();
        this.debug = debug;
        this.debugCodee = DEFAULT_DEBUG_CODE;
        this.canvasSelector = canvasSelector;
        this.width = width;
        this.height = height;
        this.fov = fov;
        this.maxControlScale = maxControlScale;
        this.minControlScale = minControlScale;
        this.encoding = encoding;

        this.status = RENDER_STATUS.UNREADY;
    }
    /**
     * 初始化
     * @param {String} canvasSelector canvas选择名称
     */
    async init(canvasSelector = this.canvasSelector) {
        if (this.status !== RENDER_STATUS.UNREADY) return false;
        try {
            this.status = RENDER_STATUS.INITIALIZING;
            await this._initCanvas(canvasSelector);
            this._initThreejs();
            this._initLogStats();
            this.status = RENDER_STATUS.READY;
            return true;
        } catch (err) {
            Log.error("Render.init error:", err);
            this.status = RENDER_STATUS.UNREADY;
            return false;
        }
    }

    async _initCanvas(canvasSelector = this.canvasSelector) {
        if (canvasSelector != this.canvasSelector)
            this.canvasSelector = canvasSelector;
        let canvas = this._getCanvasBySelector(canvasSelector);
        console.group("renderInit");
        this._log("initCanvas", canvas);
        if (!canvas) {
            console.groupEnd("renderInit");
            return Promise.reject("no canvas");
        }
        // const gl = canvas.getContext("webgl", {
        //   antialias: true,
        //   alpha: true,
        // });
        this.canvas = canvas;
        if (
            typeof this.width == "undefined" ||
            typeof this.height === "undefined"
        ) {
            let _canvasSize = this._getCanvasSizeByBoundingRect();
            this.width = _canvasSize.width;
            this.height = _canvasSize.height;
        }
        this.canvas.width = this.canvasWidth = this.width;
        this.canvas.height = this.canvasHeight = this.height;
        // this.gl = gl;
        this._log("THREE", THREE);
    }
    _initThreejs() {
        if (!this.canvas) return false;
        this._initRenderer();
        this._initCameraScene();
        this._initOrbitControls();
        this._initThreeClock();
        Log.log(this);
        console.groupEnd("renderInit");
    }
    _initRenderer() {
        let renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        });
        this._log("canvas width:", this.canvasWidth, this.canvasHeight);
        renderer.setSize(this.canvasWidth, this.canvasHeight, false);
        if (this._measurePerformance() > this.rendererHighDprThreshold)
            renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setClearColor(0x0, 0);
        renderer.outputEncoding = this.encoding;
        renderer.clear();
        this.renderer = renderer;
    }
    _initCameraScene() {
        let camera = new THREE.PerspectiveCamera(
            this.fov,
            this.canvasWidth / this.canvasHeight,
            0.01,
            1000
        );
        this.camera = camera;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.switchCameraPosition(0);

        let scene = new THREE.Scene();
        this.scene = scene;

        var light = new THREE.AmbientLight(0x0, 0);
        this.light = light;
        scene.add(light);
    }
    _initOrbitControls() {
        if (!this.camera || !this.canvas) return false;
        let controls = new OrbitControls(this.camera, this.canvas);
        controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE; //双指操作是使用缩放-旋转模式
        controls.enablePan = false; //禁用摄像机平移
        controls.enableDamping = true; //启用阻尼
        controls.dampingFactor = 0.1; //阻尼惯性有多大
        controls.minDistance = this.minControlScale; //缩放时最近相机距离
        controls.maxDistance = this.maxControlScale; //缩放时最远相机距离
        controls.autoRotateSpeed = 3600 / AutoLoopSecond / FPS; //自动旋转的速度将有多快，默认值为2.0，相当于在60fps时每旋转一周需要30秒。
        controls.enabled = false;
        this.controls = controls;
    }
    _getCanvasBySelector(canvasSelector) {
        if (canvasSelector instanceof HTMLCanvasElement) return canvasSelector;
        if (typeof canvasSelector == "string") {
            return document.querySelector(canvasSelector);
        }
        return null;
    }
    _getCanvasSizeByBoundingRect() {
        if (!this.canvas) return null;
        const domRect = this.canvas.getBoundingClientRect();
        this._log("_getCanvasSizeByBoundingRect", domRect);
        return {
            width: Math.floor(
                domRect.width || Math.abs(domRect.right - domRect.left)
            ),
            height: Math.floor(
                domRect.height || Math.abs(domRect.bottom - domRect.top)
            ),
        };
    }

    _initLogStats() {
        // if (!debug) return false;
        // this.logStats = new LogStats();
    }

    /**
     * 全部销毁 与init相反
     */
    dispose() {
        if (this.status !== RENDER_STATUS.READY) return false;
        this._clearLoopRenderId();
        this.status = RENDER_STATUS.DISPOSING;
        this.renderer ? .dispose();
        this.scene.traverse(this._disposeObj3D.bind(this));
        this.scene.remove.apply(this.scene, this.scene.children);
        this.scene.environment = null;
        let programs = this.renderer ? .info ? .programs || [];
        for (let i = programs.length - 1; i >= 0; i--) {
            //这里的scene.env对应program没有被renderer.dispose清掉，需要手动清理
            programs.forEach((program, index) => {
                if (program.name != "RawShaderMaterial") return false;
                program.destroy();
                programs.splice(index, 1);
            });
        }
        this.controls ? .dispose();

        if (debug) {
            this.renderer ? .render(this.scene, this.camera);
            this._log("after dispose", deepClone(this.renderer.info));
        }

        this.renderer = null;
        this.camera = null;
        this.scene = null;
        this.controls = null;
        this.canvas = null;
        // this.gl = null;
        this.logStats ? .stopLog();
        this.logStats = null;
        this.status = RENDER_STATUS.UNREADY;
        return true;
    }

    async resizeCanvas(width, height) {
        if (!this.canvas) return false;
        if (typeof width == "undefined" || typeof height === "undefined") {
            let _canvasSize = this._getCanvasSizeByBoundingRect();
            this.width = _canvasSize.width;
            this.height = _canvasSize.height;
        } else {
            this.width = width;
            this.height = height;
        }
        if (this.canvasWidth == this.width && this.canvasHeight == this.height)
            return false;

        this.canvas.width = this.canvasWidth = this.width;
        this.canvas.height = this.canvasHeight = this.height;
        this.renderer ? .setSize(this.width, this.height, false);
        if (this.camera) {
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        }
        return true;
    }

    get isReady() {
        return this.status == RENDER_STATUS.READY;
    }

    /*********** 其他对外接口 ************/
    switchCameraPosition(posIndex) {
        if (this._currentCameraPosIndex === posIndex) return false;
        this._currentCameraPosIndex = posIndex;
        this.camera.position.fromArray(CameraPositions[posIndex]);
        this.controls ? .saveState();
        return true;
    }

    scaleModelByCamera(step) {
        if (!step) return false;
        const camera = this.camera;
        const controlTarget = this.controls.target;
        const cameraPosition = camera.position;
        cameraPosition.lerpVectors(
            controlTarget,
            cameraPosition,
            step < 0 ? 10 / 9 : 9 / 10
        );
    }

    resetCamera() {
        this.controls && this.controls.reset();
    }

    render() {
        if (!this.renderer || !this.scene || !this.camera) return false;
        this._updateThreeClock();
        this.controls && this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.stat ? .update();
    }

    startRotation(startRenderLoop = true) {
        if (this.controls) this.controls.autoRotate = true;
        if (startRenderLoop) {
            this._clearLoopRenderId();
            this.startRenderLoop();
        }
    }

    stopRotation(stopRenderLoop = true) {
        let controls = this.controls;
        if (controls) {
            controls.autoRotate = false;
            //这里清空一下阻尼导致的自动旋转惯性
            controls.enableDamping = false;
            controls.update();
            controls.enableDamping = true;
        }
        if (stopRenderLoop) {
            this.stopRenderLoop();
        }
    }

    startRenderLoop() {
        let t1, t2;
        this.loopRenderId = setInterval(() => {
            this.logStats && (t1 = now(true));
            this.render();
            this.logStats && (t2 = now(true));
            this.logStats ? .recordFrame("render", t2 - t1);
        }, Math.ceil(1000 / FPS));
        this.logStats ? .startLog();
    }

    stopRenderLoop() {
        this._clearLoopRenderId();
    }

    enableTouch() {
        if (!this.controls) return false;
        this.controls.enabled = true;
    }
    disableTouch() {
        if (!this.controls) return false;
        this.controls.enabled = false;
    }

    _clearLoopRenderId() {
        if (!this.loopRenderId) return false;
        clearInterval(this.loopRenderId);
        this.loopRenderId = null;
        this.logStats ? .stopLog();
    }

    //初始化Threejs
    _initThreeClock() {
        this.clock = new THREE.Clock();
    }

    _updateThreeClock() {
        return this.clock ? .getDelta();
    }

    _addImageTextureAsync(imgSrc, onProgress) {
        if (!imgSrc) return Promise.reject("no src");
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(imgSrc, resolve, onProgress, reject);
        });
    }

    //根据url, 异步加载解析模型
    _loadModelAsync(url, progressCallback) {
        return new Promise((resolve, reject) => {
            let modelUrlExt = getExtension(url.split("?")[0]);
            let loader;
            this._log("_loadModelAsync", modelUrlExt);
            const onProgress = (event) => {
                let loaded = event ? .loaded;
                let total = event ? .total;
                let timeStamp = event ? .timeStamp;
                let rate = loaded / total;
                let result = {
                    loaded,
                    total,
                    timeStamp,
                    rate,
                    event,
                };
                progressCallback ? .(result);
            };
            switch (modelUrlExt) {
                case "fbx":
                    loader = new FBXLoader();
                    loader.load(url, resolve, onProgress, reject);
                    return;
                case "glb":
                case "gltf":
                    loader = new GLTFLoader();
                    loader.load(
                        url,
                        (object) => {
                            if (object.scene instanceof THREE.Group) {
                                object.scene.animations = object.animations;
                                resolve(object.scene);
                            } else {
                                resolve(object);
                            }
                        },
                        onProgress,
                        reject
                    );
                    return;
                case "json":
                    loader = new THREE.ObjectLoader();
                    loader.load(url, resolve, onProgress, reject);
                    return;
                default:
                    reject(new TypeError(`unsupport type: ${modelUrlExt} in ${url}`));
                    return;
            }
        });
    }

    //设置环境光颜色/强度
    _setLight(color, intensity) {
        if (!this.light) return false;
        if (color ? .isColor) {
            this.light.color = color;
        }
        if (typeof intensity == "number") {
            this.light.intensity = intensity;
        }
    }

    _emitEvent(eventName, detail) {
        if (!eventName) return false;
        let myEvent = {
            name: eventName
        };
        myEvent.detail = detail;
        this.dispatchEvent(myEvent);
        return true;
    }

    _disposeObj3D(obj3D) {
        try {
            if (obj3D instanceof THREE.Scene) return false;
            if (!obj3D || typeof obj3D != "object") return false;

            if (typeof obj3D.dispose == "function") {
                obj3D.dispose();
            }

            if (Array.isArray(obj3D)) {
                return obj3D.forEach((_object) => this._disposeObj3D(_object));
            }

            if (obj3D instanceof THREE.Object3D) {
                this._disposeObj3D(obj3D.geometry);
                this._disposeObj3D(obj3D.material);
                this._disposeObj3D(obj3D.children);
            } else if (obj3D instanceof THREE.Material) {
                Object.values(obj3D).forEach((value) => {
                    if (value instanceof THREE.Texture) {
                        this._disposeObj3D(value);
                    }
                });
                if (obj3D.uniforms) {
                    Object.values(obj3D.uniforms).forEach((uniform) => {
                        if (!uniform) return false;
                        const uniformValue = uniform.value;
                        if (
                            uniformValue instanceof THREE.Texture ||
                            Array.isArray(uniformValue)
                        ) {
                            this._disposeObj3D(uniformValue);
                        }
                    });
                }
            } else if (obj3D instanceof THREE.Texture) {
                let image = obj3D.image;
                if (image) {
                    image.onload = null;
                    image.onerror = null;
                    image.src = "";
                    delete obj3D.image;
                }
            }
            return obj3D;
        } catch (err) {
            Log.error("_disposeObj3D", err);
        }
    }
    _measurePerformance(Loop = 10000) {
        if (_cachePerformance) {
            this._log("_measurePerformance _cachePerformance:", _cachePerformance);
            return _cachePerformance;
        }
        if (Loop > 4e10) return Infinity;
        let startTime = now(true);
        for (let i = 0; i < Loop;) i++;
        let endTime = now(true);
        let deltaTime = endTime - startTime;
        this._log("_measurePerformance", Loop, deltaTime);
        if (deltaTime < 1) {
            return this._measurePerformance(Loop * 100);
        }
        if (deltaTime < 10) {
            return this._measurePerformance(Loop * 10);
        }
        if (deltaTime < 30) {
            return this._measurePerformance(Loop * 3);
        }
        if (deltaTime < 50) {
            return this._measurePerformance(Loop * 2);
        }
        let perform = Loop / deltaTime;
        _cachePerformance = Math.log10(perform);
        this._log("_measurePerformance result:", perform, _cachePerformance);
        return Math.log10(perform);
    }
    _log() {
        if (!debug) return false;
        let args = arguments;
        if (this.logCount <= 0) return false;
        if (this.logCount == 0) {
            Log.warn(`/js/render:`, "reach max log");
            this.logCount--;
            return false;
        }
        this.logCount--;
        try {
            Array.prototype.unshift.call(args, "/js/render:");
        } finally {
            Log.log.apply(Log, args);
        }
    }
}