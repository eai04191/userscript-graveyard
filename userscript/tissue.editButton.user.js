// ==UserScript==
// @name         tissue edit button
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0
// @match        https://shikorism.net/
// @match        https://shikorism.net/timeline/public
// @grant        none
// ==/UserScript==

(function() {
    "use strict";
    const mypage = document.querySelector(`[href^='${location.origin}/user/']`)
        .href;
    document
        .querySelectorAll(
            `.list-group-item [href='${mypage}'] img, .container-fluid [href='${mypage}'] img`
        )
        .forEach(element => {
            const checkin = element.closest(".list-group-item, div.text-break");
            const actions = checkin.querySelector(".ejaculation-actions");
            const editUrl =
                checkin.querySelector(`[href^='${location.origin}/checkin']`)
                    .href + "/edit";
            const editHtml = `<button type="button" class="btn btn-link text-secondary" data-toggle="tooltip" data-placement="bottom" title="" data-href="${editUrl}" data-original-title="修正"><span class="oi oi-pencil"></span></button>`;
            actions.insertAdjacentHTML("beforeEnd", editHtml);
        });
})();
