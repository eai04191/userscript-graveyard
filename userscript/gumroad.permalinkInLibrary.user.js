// ==UserScript==
// @name         Gumroad Permalink in Library
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      0.0.1
// @match https://gumroad.com/library*
// ==/UserScript==

(function() {
    "use strict";
    document.querySelectorAll(".product-main").forEach(product => {
        const permalink = product
            .querySelector(".preview-container")
            .getAttribute("data-product-permalink");
        const html = `<a class="show-product-page-button js-show-product-page-trigger" href="https://gumroad.com/l/${permalink}" target="_blank"><i class="gi gi-external"></i></a>`;
        product
            .querySelector(".product-information")
            .insertAdjacentHTML("afterbegin", html);
    });
})();
