// ==UserScript==
// @name         Twitter | 原寸画像ダウンローダー
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.1
// @match        https://twitter.com/*
// @icon         https://github.com/twitter.png
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @grant        GM_download
// ==/UserScript==

/*global VM*/
/*global GM_download*/

(function () {
    "use strict";

    VM.registerShortcut("d", () => {
        console.log("You have pressed D");
        downloadImages();
    });

    function downloadImages() {
        const state = getState();
        if (state === "TIMELINE") {
            console.log("Now is in Timeline. Do Nothing.");
            return false;
        }

        const images = getImageList(state);

        let urls = [];
        images.forEach((img) => {
            urls.push(getOriginalURL(img.src));
        });
        console.log(urls);

        urls.forEach((url) => {
            const o = new URL(url);

            const ext = o.searchParams.get("format");
            const dlObj = {
                url: url,
                name: o.pathname.slice(1).replace("/", "-") + "." + ext,
                onload: null,
            };
            GM_download(dlObj);
        });
    }

    function getOriginalURL(url) {
        if (!/pbs\.twimg\.com\/media\/.+format=.../.test(url)) {
            return null;
        }
        const o = new URL(url);

        const originalUrl =
            o.origin + o.pathname + "?format=" + o.searchParams.get("format") + "&name=orig";

        return originalUrl;
    }

    function getImageList(state) {
        if (state === "IMAGE_MODAL") {
            return [document.querySelector("img[src^='https://pbs.twimg.com/media']")];
        }

        if (state === "TWEET_DETAILED") {
            const id = document.location.href.match(/status\/(?<id>\d+)/).groups.id;
            return document.querySelectorAll(
                `article a[href*='${id}'] img[src^='https://pbs.twimg.com/media']`,
            );
        }
    }

    // DOMの今の状態を返す
    // "TIMELINE", "IMAGE_MODAL", "TWEET_DETAILED"
    function getState() {
        const l = document.location;
        const imageModalRegEx = /twitter\.com\/.+\/status\/\d+\/photo\/\d/;
        const tweetDetailedRegEx = /twitter\.com\/.+\/status\/\d+$/;

        const state = imageModalRegEx.test(l)
            ? "IMAGE_MODAL"
            : tweetDetailedRegEx.test(l)
            ? "TWEET_DETAILED"
            : "TIMELINE";

        return state;
    }
})();
