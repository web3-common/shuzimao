export function getCookie(key) {
    var cookies = document.cookie;
    var cookiePos = cookies.indexOf(key);
    if (cookiePos !== -1) {
        cookiePos = cookiePos + key.length + 1;
        var cookieEnd = cookies.indexOf(";", cookiePos);
        if (cookieEnd == -1) {
            cookieEnd = cookies.length;
        }
        return unescape(cookies.substring(cookiePos, cookieEnd));
    }
    return undefined;
}
//设置cookie
export function setCookie(key, cvalue, exdays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + cvalue + "; " + expires;
}
//清除cookie
export function clearCookie(key) {
    setCookie(key, "", -1);
}