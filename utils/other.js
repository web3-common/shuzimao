//尝试下载src
export const downloadSrc = (href, name) => {
    // 创建隐藏的可下载链接
    const eleLink = document.createElement("a");
    eleLink.setAttribute("href", href);
    eleLink.setAttribute("download", name);
    eleLink.style.display = "none";
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

//获取文件后缀类型
export function getExtension(path, toLowerCase = true) {
    if (!path) return "";
    let ext = path.substr(path.lastIndexOf(".") + 1) || "";
    return toLowerCase ? ext.toLowerCase() : ext;
}

//依靠a链接标签打卡url
export function openLinkByATag(url) {
    const alink = document.createElement("a");
    alink.href = url;
    alink.style.position = "absolute";
    alink.style.top = "-9999px";
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
}