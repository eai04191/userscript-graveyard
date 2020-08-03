// ==UserScript==
// @name         Steamワークショップ Rimworld Modデータベース統合
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.1
// @match        https://steamcommunity.com/sharedfiles/filedetails/
// @match        https://steamcommunity.com/workshop/filedetails/
// @require      https://raw.githubusercontent.com/mitchellmebane/GM_fetch/master/GM_fetch.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==
/*global GM_fetch*/

(async q => {
    "use strict";
    const dbBaseURL = "https://rimworld.2game.info/detail.php?id=";
    const workshopId = q("#application_root").getAttribute("data-publishedfileid");
    const dbURL = dbBaseURL + workshopId;

    // in Steam workshop functions
    const isRimWorldWorkshop = () => {
        return q("#PublishedFileSubscribe [name='appid']").value === "294100";
    };

    const addDescripton = ({ isDescriptionAvilable, isJaTranslationAvailable, commentCount }) => {
        const divider = `<div class="dotted_hr_uri hr padded"></div>`;
        const link = `<a href="${dbURL}" target="_blank">RimWorld Mod データベース</a>`;
        const text = isDescriptionAvilable
            ? "にこのMODの説明があります。"
            : "にこのMODの説明はありませんでした。";
        const text2 = commentCount ? `コメントが${commentCount}件あります。` : "";
        const text3 = isJaTranslationAvailable ? "また、日本語化ファイルがあります。" : "";
        const html = `${divider}<p>${link}${text}<br>${text2}<br>${text3}</p>`;
        q(".workshop_item_header .responsive_local_menu").insertAdjacentHTML("beforeend", html);
    };

    // in DB functions
    const isDescriptionAvilable = dom => {
        return !!dom.querySelector("#modDesc .desc+small a");
    };

    const isJaTranslationAvailable = dom => {
        return !!dom.querySelector(".jpUpFilesBox");
    };

    const getCommentCount = dom => {
        return dom.querySelector(".comNum")
            ? dom.querySelector(".comNum").textContent.replace("#", "")
            : null;
    };

    if (!isRimWorldWorkshop()) {
        return;
    }

    const response = await GM_fetch(dbURL);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    addDescripton({
        isDescriptionAvilable: isDescriptionAvilable(doc),
        isJaTranslationAvailable: isJaTranslationAvailable(doc),
        commentCount: getCommentCount(doc),
    });
})(document.querySelector.bind(document));
