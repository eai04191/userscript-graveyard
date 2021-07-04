// ==UserScript==
// @name         notestock | Login Code Button
// @namespace    https://mizle.net/
// @version      0.1.0
// @description  Add Login Code Toot Button in notestock authentication screen.
// @author       Eai <eai@mizle.net>
// @match        https://notestock.osa-p.net/reserve.html
// @icon         https://notestock.osa-p.net/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const login_code = document.getElementById("code").value;

    const accts = document.querySelector(".card-body").innerText.match(/@.+?@.+? /g);
    const login_instance = accts[0].trim().match(/[^@]*$/);

    const button = document.getElementById("btn_next");
    button.insertAdjacentHTML(
        "beforeBegin",
        `<a href="https://${login_instance}/share?text=${login_code}" class="btn btn-secondary" target="_blank">投稿する</a>`
    );
})();
