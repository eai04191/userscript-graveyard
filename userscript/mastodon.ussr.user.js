// ==UserScript==
// @name         Mastodon Anthem of USSR
// @namespace    mizle.net
// @description  ☭
// @icon         https://media.stellaria.network/custom_emojis/images/000/000/767/static/Hammer_and_sickle_red_on_transparent-min.png
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0

// @include      https://*/web/*
// @require      https://raw.githubusercontent.com/eai04191/userscript-graveyard/master/userscript/lib/player.js
// ==/UserScript==
/*global player*/

"use strict";

window.addEventListener(
    "load",
    function() {
        class USSR {
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
                    const lyric =
                        ":Soyuz_nerushimy_respublik_svobodnykh_Splotila_naveki_velikaya_Rus_Da_zdravstvuyet_sozdanny_voley_narodov_Yediny_moguchy_Sovetsky_Soyuz:";

                    if (
                        node.textContent.includes(lyric) ||
                        node.textContent.includes("☭")
                    ) {
                        this.play();
                    } else {
                        node.querySelectorAll(
                            ".status__content img.emojione"
                        ).forEach(emoji => {
                            if (emoji.alt === lyric) {
                                this.play();
                            }
                        });
                    }
                }
            }

            play() {
                const volume = 1;
                const USSRAnthem =
                    "https://upload.wikimedia.org/wikipedia/commons/d/db/Gimn_Sovetskogo_Soyuza_%281977_Vocal%29.oga";

                player.play(
                    USSRAnthem,
                    { volume: volume, controls: true },
                    document.querySelector(".drawer__inner"),
                    document.querySelector(".drawer__inner__mastodon")
                );
            }
        }

        new USSR().start();
    },
    false
);
