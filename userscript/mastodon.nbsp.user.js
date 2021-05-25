// ==UserScript==
// @name         Mastodon NBSP converter
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @include      https://*/web/*
// ==/UserScript==

window.addEventListener(
    "load",
    function () {
        addNBSPButton();
        document.getElementById("nbspConvert").onclick = eventHandlerNBSP;

        function NBSPConvert() {
            const textarea = document.querySelector("textarea");
            const zwnbs = "﻿";
            textarea.value = textarea.value.replace(/ /g, zwnbs);
            textarea.value = textarea.value.replace(new RegExp(zwnbs + "+"), zwnbs);
            return true;
        }

        function addNBSPButton() {
            const buttons = document.querySelector(".compose-form__buttons");
            const nbspHtml = `<button id="nbspConvert" title="NBSP変換" aria-label="NBSP変換" class="text-icon-button " aria-expanded="false" aria-controls="cw-spoiler-nbsp" style="line-height: 1;">NB<br>SP</button>`;
            if (buttons) {
                buttons.insertAdjacentHTML("beforeend", nbspHtml);
            }
        }

        function eventHandlerNBSP() {
            NBSPConvert();
        }
    },
    false
);
