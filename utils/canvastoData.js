function isNumber(value) {
    return !isNaN(value) && typeof value == "number";
}

function createCanvas() {
    let dom = document.createElement("canvas");
    dom.width = 400;
    dom.height = 400;
    dom.style.position = "absolute";
    dom.style.top = -400;
    dom.style.left = -400;

    document.body.appendChild(dom);
    return dom;
}
export class CanvasToImg {
    canvas;
    ctx;
    constructor(canvasDom) {
        if (!canvasDom) {
            this.canvas = createCanvas();
        } else {
            this.canvas = canvasDom;
        }
        this.ctx = this.canvas.getContext("2d");
    }
    getCanvas() {
        return this.canvas;
    }
    // 设置透明度
    setAlpha(val) {
        if (val < 0) val = 0;
        if (val > 1) val = 1;
        this.ctx.globalAlpha = val;
    }
    // 设置阴影
    setShadow({
        color = "fully-transparent black",
        blur = 0,
        offsetX = 0,
        offsetY = 0,
    } = {}) {
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = blur;
        this.ctx.shadowOffsetX = offsetX;
        this.ctx.shadowOffsetY = offsetY;
    }
    async addImage(
        url = "", {
            sx,
            sy,
            sWidth,
            sHeight,
            dx = 0,
            dy = 0,
            dWidth,
            dHeight,
            isCircle = false,
            isBlob = false,
        } = {}
    ) {
        if (!url) return Promise.reject("no img url");
        if (isBlob) {
            url = await imageToBlob(url); //下载blob
            url = await fileToDataURl(url); //转dataUrl
        }
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.src = url;
        const that = this;
        return new Promise((resolve, reject) => {
            img.onload = function() {
                if (isCircle) {
                    that.ctx.save();
                    let radius = dWidth / 2;
                    that.ctx.beginPath();
                    that.ctx.arc(dx + radius, dy + radius, radius, 0, 2 * Math.PI);
                    that.ctx.clip();
                    that.ctx.drawImage(img, dx, dy, dWidth, dHeight);
                    that.ctx.restore();
                    that.ctx.closePath();
                } else if (
                    isNumber(sx) &&
                    isNumber(sy) &&
                    isNumber(sWidth) &&
                    isNumber(sHeight)
                ) {
                    dWidth = sWidth;
                    dHeight = sHeight;
                    that.ctx.drawImage(
                        img,
                        sx,
                        sy,
                        sWidth,
                        sHeight,
                        dx,
                        dy,
                        dWidth,
                        dHeight
                    );
                } else if (isNumber(dWidth) && isNumber(dHeight)) {
                    that.ctx.drawImage(img, dx, dy, dWidth, dHeight);
                } else {
                    that.ctx.drawImage(img, dx, dy);
                }
                resolve();
            };
            img.onerror = function(err) {
                console.error(err);
                reject(err);
            };
        });
    }
    addText(
        txt, {
            tx = 0,
            ty = 0,
            tMaxWidth,
            font,
            color,
            textAlign,
            textBaseline,
            direction,
        } = {}
    ) {
        if (!txt) return Promise.reject("no fill text");
        this.ctx.fillStyle = color ? color : "#000";
        if (font) this.ctx.font = font;
        if (textAlign) this.ctx.textAlign = textAlign;
        if (textBaseline) this.ctx.textBaseline = textBaseline;
        if (direction) this.ctx.direction = direction;
        if (tMaxWidth) {
            this.ctx.fillText(txt, tx, ty, tMaxWidth);
        } else {
            this.ctx.fillText(txt, tx, ty);
        }
    }
    measureTextWidth(text) {
        if (!text) return 0;
        return this.ctx.measureText(text).width;
    }
    exportImage({
        type = "image/jpeg",
        encoderOptions = 1
    } = {}) {
        return this.canvas.toDataURL(type, encoderOptions);
    }
}

// url img地址，图片地址如果是网络图片，网络地址需要处理跨域
// fn  函数，返回一个blob对象
function imageToBlob(url) {
    if (!url) return false;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
            // 注意这里的this.response 是一个blob对象 就是文件对象
            resolve(this.status == 200 ? this.response : false);
        };
        xhr.onerror = function(err) {
            reject(err);
        };
        xhr.send();
    });
}

function fileToDataURl(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onload = function() {
            resolve(reader.result);
        };
        reader.onerror = function(err) {
            reject(err);
        };
    });
}