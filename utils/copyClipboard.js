import {
    isIOS
} from "utils";
//复制文本到剪贴板
export async function copyClipboardData(text) {
    //oppo手机这个的判断会导致复制失败
    if (!isIOS || !navigator.clipboard) {
        return copyByExeccmd(text);
    }
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("utils.copyClipboardData", error);
        return copyByExeccmd(text);
    }
}

function copyByExeccmd(text) {
    let selectedText = "";
    const fakeElement = createFakeElement(text);
    document.body.appendChild(fakeElement);
    try {
        selectedText = select(fakeElement);
        console.log("utils.copyByExeccmd-selectedText", selectedText, text);
        let res = document.execCommand("copy"); // 执行浏览器复制命令
        fakeElement.blur();
        document.body.removeChild(fakeElement);
        return res && res !== "unsuccessful";
    } catch (error) {
        console.error("utils.copyByExeccmd", error);
        document.body.removeChild(fakeElement);
        return false;
    }
}

//copy from https://github.com/zenorocha/clipboard.js
function createFakeElement(value) {
    const isRTL = document.documentElement.getAttribute("dir") === "rtl";
    const fakeElement = document.createElement("textarea");
    // Prevent zooming on iOS
    fakeElement.style.fontSize = "12pt";
    // Reset box model
    fakeElement.style.border = "0";
    fakeElement.style.padding = "0";
    fakeElement.style.margin = "0";
    // Move element out of screen horizontally
    fakeElement.style.position = "absolute";
    fakeElement.style[isRTL ? "right" : "left"] = "-9999px";
    // Move element to the same position vertically
    let yPosition = window.pageYOffset || document.documentElement.scrollTop;
    fakeElement.style.top = `${yPosition}px`;

    fakeElement.setAttribute("readonly", "");
    fakeElement.value = value;

    return fakeElement;
}

//copy from https://github.com/zenorocha/select
function select(element) {
    var selectedText;

    if (element.nodeName === "SELECT") {
        element.focus();

        selectedText = element.value;
    } else if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
        var isReadOnly = element.hasAttribute("readonly");

        if (!isReadOnly) {
            element.setAttribute("readonly", "");
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute("readonly");
        }

        selectedText = element.value;
    } else {
        if (element.hasAttribute("contenteditable")) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}