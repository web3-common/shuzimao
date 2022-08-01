import JSEncrypt from "./JSEncrypt/index.js";
import {
    privateKey,
    publicKey
} from "./keys";
import {
    debug
} from "config";
export {
    JSEncrypt,
    privateKey,
    publicKey
};
export const MaxEncryptLength = ((2048 + 7) >> 3) - 11; // 2048/8=256-11=245;
export const rsa = new JSEncrypt();

import {
    createLog,
    createGroup
} from "plugins/log";
const {
    warn
} = createLog("modules/rsa");

export function encrypt(text, usePublicKey = true) {
    if (typeof text != "string") {
        text = String(text);
    }
    if (text.length > MaxEncryptLength) {
        warn(
            "encrypt max length",
            MaxEncryptLength,
            ", but current length:",
            text.length
        );
    }
    rsa.setKey(usePublicKey ? publicKey : privateKey);
    return rsa.encrypt(text, usePublicKey);
}

export function decrypt(text, usePrivateKey = true) {
    if (typeof text != "string") {
        text = String(text);
    }
    rsa.setKey(usePrivateKey ? privateKey : publicKey);
    return rsa.decrypt(text, usePrivateKey);
}

/* eslint-disable-next-line */
function test() {
    if (!debug) return false;
    const [startGroup, endGroup] = createGroup("modules/rsa-test");
    startGroup();
    let phone = Array(246).join("0");
    phone = 15201082335;
    let usePrivateKeyEnc = false;
    let enc = encrypt(phone, !usePrivateKeyEnc);
    let dec = decrypt(enc, !usePrivateKeyEnc);
    console.log("encrypt\n", phone, "\nencrypt=>\n", enc, "\ndecrypt=>\n", dec);
    console.assert(phone == dec, "test 1");

    // const encByPrivate =
    //   "MGAdOMatwB9cduGJ7WEG5v8PldV65QbI13w41alW7A+GmNWzwzsQHD5LiddB7vfkRZ+q7xUTF\
    // zx23roOcJRRm+G2qZlwxB5/Y90lWuLEbAh/Z22K3ZNu0jZEVi9pNSy75lUbjUb+ZmTqudKYkTfykMh\
    // 5tLEf4Yv1omCEdqCsTV92GDI/UkH/fWxXLZ7XA/TprdB65FUwgbAospggqzk7VcPxnSrmUG6uMYedA\
    // qVouRb1xgIkqylKW6CE2kDJKli7Z30N/q2ZWZfL4saeGpiyGV4wzp71g1Wr+4ILvk0cIUzJDgKVMw1\
    // pLIVMj56SPZpe1psvWq/FYroj2a39BZTIAw==";

    // let dec2 = decrypt(encByPrivate, false);
    // console.log("decrypt:encByPrivate", dec2);
    // console.assert(dec2 == "15811541190", "test 2");

    const TestEncTest =
        "TEaui3kp98ch1QcHsjg9O1Hr4kKdLjAPHYgXofCwTQSXiCm6lyy8K0Vga13I3nZfdyccw4Oiznh6GENXED\
umeV0vCh8V3q1XMjByLh9+V6wFolpj54OP3kj8zMNVNuJF5Jbd985z+jIzPjNYqSXPwHozdHFxvB0yVtoEH\
c/dhQpLdZ638a996cpSRy7E90CqE514BUoh9LNVF2deSwinUg0OeuZLRcbNfKKd52OFJt/KvRr2D0zFIPj7\
aOtE3d0WWdOt17TcJlKrgbxHiKcLQevMhSb6d1RtNqDD2gT5h3awctzMpMXDlKB4UU/VhFy2djB7lwqUWjL\
F4D+g8bIOFQ=="; //15677778888;
    let dec3 = decrypt(TestEncTest, true);
    console.log("decrypt", TestEncTest);
    console.assert(dec3 == "15677778888", "test 2");
    endGroup();
}
// test();