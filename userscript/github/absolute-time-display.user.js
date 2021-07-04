// ==UserScript==
// @name         GitHub | Absolute time Display
// @name:ja-JP   GitHub | 絶対時刻表示
// @namespace    https://mizle.net/
// @version      0.2.0
// @description  うるせ～～～～～～～～！英語よめね～～～～～～～～～～！！
// @author       Eai
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    window.addEventListener("DOMNodeInserted", replaceRelativeTime, false);

    function replaceRelativeTime() {
        document.querySelectorAll("relative-time").forEach(function (element) {
            element.innerText = element.title
                .replace("JST", "")
                .replace("日", "")
                .replace(/[年月]/g, "/");
        });
    }
    replaceRelativeTime();
})();
