// ==UserScript==
// @name         Pixiv 検索結果 ブックマークが多い順にソート
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0
// @match        https://www.pixiv.net/search.php?*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.3.6/tinysort.js
// ==/UserScript==

(function() {
    "use strict";

    const config = {
        childList: true,
    };
    const observer = new MutationObserver(function(record) {
        fook();
    });

    observer.observe(document.querySelector("#js-react-search-mid"), config);

    function fook() {
        sort();
    }

    function sort() {
        tinysort("#js-react-search-mid > div > div", {
            selector: "a[href^='/bookmark_detail']",
            order: "desc",
        });
        observer.disconnect();
    }
})();
