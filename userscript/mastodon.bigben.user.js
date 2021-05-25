// ==UserScript==
// @name         Mastodon Big Ben
// @namespace    mizle.net
// @description  BONG
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.1

// @include      https://*/web/*
// @require      https://raw.githubusercontent.com/eai04191/userscript-graveyard/master/userscript/lib/player.js
// ==/UserScript==
/*global player*/

"use strict";

window.addEventListener(
    "load",
    function () {
        class BigBen {
            constructor() {
                this.mutationObserver = new MutationObserver((mutations) =>
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
                    const status = node.querySelector(".status");
                    const url = status.querySelector(".status__display-name").href;
                    if (url === "https://mastodon.org.uk/@bigben") {
                        const count = status.textContent.split("BONG").length - 1;
                        this.bong(count);
                    }
                }
            }

            async bong(count) {
                console.log(`Play Bong ${count} times.`);
                const bongIntro = "https://cldup.com/8omi5_RQfb.mp3";
                const bong = "https://cldup.com/7KEDpYeng9.mp3";
                const bongLast = "https://cldup.com/vJ1OD6K6r0.mp3";

                await this.play(bongIntro);

                for (var i = 0; i < count - 1; i++) {
                    await this.play(bong);
                }

                await this.play(bongLast);
            }

            play(source) {
                var volume = 0.5;
                const settings = JSON.parse(localStorage.getItem("mizle.bigben")) || {};
                if ("volume" in settings) {
                    volume = settings.volume;
                }

                return player.play(
                    source,
                    { volume: volume },
                    document.querySelector(".drawer__inner"),
                    document.querySelector(".drawer__inner__mastodon")
                );
            }
        }

        new BigBen().start();
    },
    false
);
