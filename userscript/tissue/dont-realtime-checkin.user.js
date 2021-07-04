// ==UserScript==
// @name        Tissue | Don't Realtime Checkin
// @name:ja-JP  Tissue | 現在時刻でチェックインしない
// @namespace   mizle.net
// @match       https://shikorism.net/checkin
// @icon        https://shikorism.net/favicon.ico
// @grant       none
// @version     1.0.0
// @author      Eai <eai@mizle.net>
// @license     MIT
// ==/UserScript==

(async () => {
    await new Promise((res) => setTimeout(res, 1000));
    document.querySelector("#isRealtime").click();
})();
