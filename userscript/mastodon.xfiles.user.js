// ==UserScript==
// @name         Mastodon X Files
// @namespace    mizle.net
// @description  :thinking_face:
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.2.2

// @include      https://*/web/*
// @require      https://raw.githubusercontent.com/eai04191/userscript-graveyard/master/userscript/lib/player.js
// ==/UserScript==
/*global player*/

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
                        childList: true,
                    }
                );
            }

            onUpdate(mutations) {
                const mutation = mutations[0];
                if (mutation.addedNodes.length != 0) {
                    const node = mutation.addedNodes["0"];
                    var text = node.textContent;

                    // 全角英数変換
                    text = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                        return String.fromCharCode(s.charCodeAt(0) - 65248);
                    });

                    // スペース削除
                    text = text.replace(/\s+/g, "");

                    if (/x[- ]?files/gim.test(text)) {
                        console.log("X-Files Theme Detected", node);
                        this.play();
                    }
                }
            }

            play() {
                var volume = 0.5;
                const settings =
                    JSON.parse(
                        localStorage.getItem("mizle.net_x-files theme")
                    ) || {};
                if ("volume" in settings) {
                    volume = settings.volume;
                }
                const xfiles = "https://cldup.com/cnkhRDR-D3.mp3";

                player.play(
                    xfiles,
                    { volume: volume },
                    document.querySelector(".drawer__inner"),
                    document.querySelector(".drawer__inner__mastodon")
                );
            }
        }

        new Xfiles().start();
    },
    false
);
