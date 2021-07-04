// ==UserScript==
// @name         Discord | Image Mate
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      0.0.0
// @match        https://discordapp.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    window.addEventListener(
        "load",
        function () {
            class discordImagemate {
                constructor() {
                    this.mutationObserver = new MutationObserver((mutations) =>
                        this.onUpdate(mutations)
                    );
                }

                start() {
                    console.log("observe start");
                    this.mutationObserver.observe(document.getElementById("app-mount"), {
                        childList: true,
                        subtree: true,
                    });
                }

                onUpdate(mutations) {
                    console.log("mutation found: ", mutations);
                    const imageNodelist = document.querySelectorAll(
                        "a[class*='imageWrapper-'][href$='.png'], a[class*='imageWrapper-'][href$='.jpg']"
                    );
                    if (imageNodelist != 0) {
                        imageNodelist.forEach((a) => {
                            if (!a.classList.contains("imageMate-processed")) {
                                console.log(a);
                                a.classList.add("imageMate-processed");
                                const imageUrl = a.getAttribute("href");
                                const dlButton = document.createElement("a");
                                // dlButton.style.position = "absolute";
                                dlButton.style.fontSize = "125%";
                                // dlButton.style.bottom = 0;
                                dlButton.setAttribute("download", "download.png");
                                dlButton.setAttribute("href", imageUrl);
                                dlButton.textContent = "💾 Mate";
                                a.parentNode.insertBefore(dlButton, a.nextSibling);
                            }
                        });
                    }
                }
            }

            new discordImagemate().start();
        },
        false
    );
})();
