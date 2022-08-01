import {
    debug
} from "config";
import DevPrivateKey from "./dev.private.key";
import DevPublicKey from "./dev.public.key";
import OnlinePublicKey from "./online.public.key";
export const privateKey = debug ? DevPrivateKey : "";
export const publicKey = debug ? DevPublicKey : OnlinePublicKey;
console.warn(
    "RSA模块密钥使用：",
    `\nprivateKey: ${privateKey == DevPrivateKey ? "Dev" : ""}`,
    `\npublicKey: ${publicKey == DevPublicKey ? "Dev" : "Online"}`
);