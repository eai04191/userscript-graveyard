// ==UserScript==
// @name         Mastodon X Files
// @namespace    mizle.net
// @description  :thinking_face:
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.1.0

// @include      https://*/web/*
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
                    const node = mutation.addedNodes["0"];
                    const text = node.textContent;
                    if (/x-?files/gim.test(text)) {
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
                const removePlayer = function(id) {
                    document.getElementById(id).remove();
                    console.log("X-Files Theme Player Removed");
                };

                const player = document.createElement("audio");
                player.id =
                    "x-files_" +
                    Math.random()
                        .toString(32)
                        .substring(2);
                player.src = "https://cldup.com/cnkhRDR-D3.mp3";
                player.autoplay = true;
                player.controls = true;
                player.volume = volume;
                document
                    .querySelector(".drawer__inner")
                    .insertBefore(
                        player,
                        document.querySelector(".drawer__inner__mastodon")
                    );
                setTimeout(removePlayer, 9000, player.id);
            }
        }

        new Xfiles().start();
    },
    false
);
