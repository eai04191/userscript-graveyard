// ==UserScript==
// @name         :don: Sogigi
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.1.0
// @include      https://mstdn.maud.io/web/*
// ==/UserScript==

window.addEventListener(
    "load",
    function() {
        addSogigiButton();
        document.getElementById("sogigi").onclick = eventHandlerSogigi;

        function sogigi() {
            const cwButton = document.querySelector(
                'button[aria-controls="cw-spoiler-input"][aria-expanded="false"]'
            );
            const cwInput = document.querySelector("#cw-spoiler-input");
            if (!cwButton) {
                return false;
            }
            if (!cwInput) {
                // NOTE: fallback old solution
                const textarea = document.querySelector("textarea");
                const text = textarea.value;
                textarea.value = text + " #そぎぎ";
                return true;
            }

            cwButton.dispatchEvent(
                new Event("click", {
                    bubbles: true,
                    cancelable: true,
                })
            );
            setNativeValue(cwInput, "そぎぎ");
            cwInput.dispatchEvent(
                new Event("input", {
                    bubbles: true,
                    cancelable: false,
                })
            );
            return true;
        }

        function addSogigiButton() {
            const buttons = document.querySelector(".compose-form__buttons");
            const sogigiHtml = `<button id="sogigi" title="そぎぎする" aria-label="そぎぎする" class="text-icon-button " aria-expanded="false" aria-controls="cw-spoiler-sogigi">そぐ</button>`;
            if (buttons) {
                buttons.insertAdjacentHTML("beforeend", sogigiHtml);
            }
        }

        function eventHandlerSogigi() {
            sogigi();
        }

        // REF: https://github.com/facebook/react/issues/10135#issuecomment-401496776
        function setNativeValue(element, value) {
            const { set: valueSetter } =
                Object.getOwnPropertyDescriptor(element, "value") || {};
            const prototype = Object.getPrototypeOf(element);
            const { set: prototypeValueSetter } =
                Object.getOwnPropertyDescriptor(prototype, "value") || {};

            if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value);
            } else if (valueSetter) {
                valueSetter.call(element, value);
            } else {
                throw new Error(
                    "The given element does not have a value setter"
                );
            }
        }
    },
    false
);
