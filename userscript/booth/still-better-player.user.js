// ==UserScript==
// @name               Booth | Still Better Player
// @name:ja-JP         Booth | マシな音楽プレイヤー
// @namespace          mizle.net
// @author             Eai <eai@mizle.net>
// @match              https://booth.pm/ja/items/*
// @match              https://booth.pm/en/items/*
// @match              https://booth.pm/ko/items/*
// @match              https://booth.pm/zh-cn/items/*
// @match              https://booth.pm/zh-tw/items/*
// @version            1.0.1
// @description:ja-JP  Boothの使い勝手の悪いデモ音楽プレイヤーを非表示にしてブラウザデフォルトの音楽プレイヤーを表示します
// @icon               https://booth.pm/favicon.ico
// @resource           css https://raw.githubusercontent.com/eai04191/userscript-graveyard/master/userscript/booth/still-better-player.css
// @run-at             document-idle
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_getResourceText
// ==/UserScript==
/*global GM_addStyle*/
/*global GM_getValue*/
/*global GM_setValue*/
/*global GM_getResourceText*/

GM_addStyle(GM_getResourceText("css"));

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

(async () => {
    const onVolumeChange = ({ target: { volume } }) => {
        if (typeof volume !== "number") return;
        GM_setValue("volume", volume);
    };

    await sleep(2500);
    document.querySelectorAll(".player audio").forEach((e) => {
        e.setAttribute("controls", "controls");
        e.volume = GM_getValue("volume", 0.5);
        e.addEventListener("volumechange", onVolumeChange);
    });
})();
