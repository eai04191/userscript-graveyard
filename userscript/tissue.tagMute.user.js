// ==UserScript==
// @name         Tissue Tag Mute
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      0.1
// @match        https://shikorism.net/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    const hideTags = ["三次元", "3次元"];

    document
        .querySelectorAll(
            ".badge[href^='https://shikorism.net/search/checkin?q=']"
        )
        .forEach(tag => {
            const text = tag.innerText.trim();
            if (hideTags.includes(text)) {
                tag.parentElement.parentElement.style.display = "none";
            }
        });
})();
