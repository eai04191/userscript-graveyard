// ==UserScript==
// @name         Mastodon X Files
// @namespace    mizle.net
// @description  :thinking_face:
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.1

// @include      https://*/web/*

// @require      https://cdnjs.cloudflare.com/ajax/libs/howler/2.0.15/howler.min.js
// ==/UserScript==

"use strict";

window.addEventListener(
    "load",
    function() {
        class Xfiles {
            constructor() {
                this.mutationObserver = new MutationObserver(mutations =>
                    this.onUpdate(mutations)
                );
            }

            start() {
                this.mutationObserver.observe(
                    document
                        .querySelector(".fa-home.column-header__icon") // Home Column Icon
                        .closest("div.column") // Home Column
                        .querySelector("div.item-list"),
                    {
                        childList: true
                    }
                );
            }

            onUpdate(mutations) {
                const mutation = mutations[0];
                if (mutation.addedNodes.length != 0) {
                    const text = mutation.addedNodes["0"].textContent;
                    if (text.includes("X-Files Theme")) {
                        console.log("X-Files Theme Detected", text);
                        this.beep();
                    }
                }
            }

            beep() {
                const source =
                    "https://stellaria.network/system/media_attachments/files/000/169/004/original/bed2700bef30a016.mp4";
                const sound = new Howl({
                    src: source,
                    volume: 0.5
                });
                sound.play();
            }
        }

        new Xfiles().start();
    },
    false
);
