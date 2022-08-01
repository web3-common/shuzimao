import QRCode from "qrcode";
export function stringQrcode(url, opts = {}) {
    const defaultOpt = {
        errorCorrectionLevel: "M",
        quality: 0.3,
        margin: 1,
        color: {
            dark: "#000000",
            light: "#ffffff",
        },
    };
    opts = Object.assign(defaultOpt, opts);
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(url, opts, function(err, url) {
            if (err) reject(err);
            resolve(url);
        });
    });
}