// ==UserScript==
// @name         mouneyou Mastodon Integration
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @require      https://unpkg.com/axios/dist/axios.min.js
// @match        http://mouneyou.rgx6.com/
// @icon         http://mouneyou.rgx6.com/images/favicon.png
// @grant        GM_getValue
// ==/UserScript==
/*global axios*/
/*global GM_getValue*/

(function() {
    "use strict";

    const mastodon = {
        host: GM_getValue("host"),
        token: GM_getValue("token"),
        // https://host/settings/applications
    };

    injectionShareButton();
    document.getElementById("count").addEventListener("click", share, false);

    function injectionShareButton() {
        const button = document.getElementById("count");
        button.style.fontSize = "unset";
        button.style.lineHeight = "1";
        button.style.backgroundColor = "#2b90d9";
        button.style.backgroundSize = "50%";
        button.style.backgroundPosition = "center center";
        button.style.backgroundImage = `url("https://${
            mastodon.host
        }/favicon.ico")`;
        button.innerHTML = "<p>トゥート</p>";
        button.removeAttribute("href");
    }

    function share() {
        changeShareButtonStyle("progress");
        uploadImage(getShareStatus().imageUrl)
            .then(data => {
                postWithImage(getShareStatus().text, data.id);
            })
            .then(() => {
                changeShareButtonStyle("success");
            })
            .catch(error => {
                console.error(error);
                changeShareButtonStyle("error");
            });
    }

    const mastodonClient = axios.create({
        baseURL: `https://${mastodon.host}/api/v1/`,
        headers: {
            Authorization: `Bearer ${mastodon.token}`,
        },
    });

    function getShareStatus() {
        return {
            text: "http://mouneyou.rgx6.com/ #てゆうかもう寝よう #すたンプ",
            imageUrl:
                "http://mouneyou.rgx6.com/" +
                document
                    .getElementById("selected")
                    .style.backgroundImage.match(/^url\("(.+)"\)/)[1],
        };
    }

    function uploadImage(imageUrl) {
        return axios
            .get(imageUrl, {
                responseType: "blob",
                dataType: "binary",
            })
            .then(response => {
                const blob = new Blob([response.data], { type: "image/png" });
                const formData = new FormData();
                formData.append("file", blob, "image.png");
                return formData;
            })
            .then(formData => {
                return mastodonClient.post("/media", formData);
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error(error);
            });
    }

    function postWithImage(status, imageId) {
        mastodonClient.post("/statuses", {
            status: status,
            media_ids: [imageId],
            // visibility: "direct",
        });
    }

    function changeShareButtonStyle(style) {
        const button = document.getElementById("count");
        const twemojiBaseURL = "https://cdnjs.cloudflare.com/ajax/libs/twemoji";
        const twemojiVersion = "12.0.4";
        switch (style) {
            case "progress":
                // 📨
                button.style.backgroundImage = `url("${twemojiBaseURL}/${twemojiVersion}/2/svg/1f4e8.svg")`;
                break;
            case "success":
                // ✅
                button.style.backgroundImage = `url("${twemojiBaseURL}/${twemojiVersion}/2/svg/2705.svg")`;
                break;
            case "error":
                // 🚫
                button.style.backgroundImage = `url("${twemojiBaseURL}/${twemojiVersion}/2/svg/1f6ab.svg")`;
                break;
        }
    }
})();
