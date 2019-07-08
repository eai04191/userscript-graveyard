// ==UserScript==
// @name         Creative Market Free Items Auto Buy
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @match        https://creativemarket.com/free-goods*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    "use strict";

    const isLoggedin = !document.querySelector(
        "#user-menus a[href='/sign-in']"
    );
    const buttons = document.querySelectorAll(
        "[data-owned=''] [id^='btn-free-good-']"
    );

    if (isLoggedin && buttons.length != 0) {
        for (const button of buttons) {
            button.click();
        }
        location.reload();
    }
})();
