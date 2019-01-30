// ==UserScript==
// @name         :don: Sogigi
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0
// @include      https://mstdn.maud.io/web/*
// ==/UserScript==

window.addEventListener(
  "load",
  function() {
    addSogigiButton();
    document.getElementById("sogigi").onclick = eventHandlerSogigi;

    function sogigi() {
      const textarea = document.querySelector("textarea");
      const text = textarea.value;
      textarea.value = text + " #そぎぎ";
    }

    function addSogigiButton() {
      const buttons = document.querySelector(".compose-form__buttons");
      const sogigiHtml = `<button id="sogigi" title="そぎぎする" aria-label="そぎぎする" class="text-icon-button " aria-expanded="false" aria-controls="cw-spoiler-input">そぐ</button>`;
      buttons.innerHTML = buttons.innerHTML + sogigiHtml;
    }

    function eventHandlerSogigi() {
      sogigi();
    }
  },

  false
);
