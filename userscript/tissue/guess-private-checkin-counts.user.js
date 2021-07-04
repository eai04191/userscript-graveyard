// ==UserScript==
// @name        Tissue | 非公開チェックイン数推測
// @namespace   mizle.net
// @match       https://shikorism.net/user/*
// @icon        https://shikorism.net/favicon.ico
// @grant       none
// @version     1.0.0
// @author      Eai <eai@mizle.net>
// @license     MIT
// ==/UserScript==

(async () => {
    const lastURL = [...document.querySelectorAll("a.page-link:not([rel])")].pop().href;
    const lastPnumber = Number(new URL(lastURL).searchParams.get("page"));
    const html = await fetch(lastURL).then((r) => r.text());
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const amari = doc.querySelectorAll(".list-group-item h5 a").length;
    const publicCheckinCount = 20 * (lastPnumber - 1) + amari;
    const countElement = [...document.querySelectorAll(".card.mb-4 .card-text")].pop();
    const allCheckinCount = Number(countElement.innerText.replaceAll(",", "").match(/\d+/)[0]);
    console.log(allCheckinCount, publicCheckinCount);
    countElement.innerText =
        countElement.innerText + ` うち非公開: ${allCheckinCount - publicCheckinCount}回`;
})();
