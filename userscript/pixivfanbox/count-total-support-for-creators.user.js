// ==UserScript==
// @name        pixivFANBOX | Count total support for creators
// @name:ja-JP  pixivFANBOX | 毎月の支援の合計額を計算するやつ
// @namespace   mizle.net
// @author      Eai <eai@mizle.net>
// @license     MIT
// @match       https://www.fanbox.cc/creators/supporting
// @grant       GM_registerMenuCommand
// @version     1.0.0
// ==/UserScript==
/*global GM_registerMenuCommand*/

GM_registerMenuCommand("合計額を計算する", () => {
    alert(
        document.querySelectorAll("a[href^='/creators/supporting/@']").length +
            " クリエイター\n" +
            "合計 ¥" +
            [...document.querySelectorAll("span")]
                .filter((span) => span.innerText.startsWith("¥"))
                .reduce((a, x) => (a += parseInt(x.innerText.replace("¥", ""))), 0) +
            "/月",
    );
});
