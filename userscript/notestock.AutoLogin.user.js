// ==UserScript==
// @name         Notestock Auto login
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0
// @match        https://notestock.osa-p.net/index.html
// @match        https://notestock.osa-p.net/reserve.html
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_getValue
// ==/UserScript==
/*global axios*/
/*global GM_getValue*/

(function() {
    "use strict";
    const mastodonClient = axios.create({
        baseURL: `https://${GM_getValue("host")}/api/v1/`,
        headers: {
            Authorization: `Bearer ${GM_getValue("token")}`,
        },
    });

    function post(status) {
        mastodonClient.post("/statuses", {
            status: status,
            visibility: "direct",
        });
    }

    if (document.querySelector("a[href='/logout.html']")) {
        return;
    }

    if (location.pathname === "/index.html") {
        document.querySelector("input[name='acct']").value = GM_getValue(
            "acct"
        );
    } else if (location.pathname === "/reserve.html") {
        post(document.querySelector("#code").value);
    }
})();
