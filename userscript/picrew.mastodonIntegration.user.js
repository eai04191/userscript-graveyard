// ==UserScript==
// @name         Picrew Mastodon Integration
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @require      https://unpkg.com/axios/dist/axios.min.js
// @match        https://picrew.me/image_maker/*/complete?cd=*
// ==/UserScript==
/*global axios*/

(function() {
    "use strict";

    const mastodon = {
        host: "stellaria.network",
        token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        // https://host/settings/applications
    };

    injectionShareButton();
    document
        .getElementById("share_btn_mastodon")
        .addEventListener("click", share, false);

    function injectionShareButton() {
        const shareWrapper = document.querySelector(".pc_complete_share_sns");
        shareWrapper.style.display = "flex";

        const mastodonList = document.createElement("li");
        const mastodonButton = document.createElement("a");
        mastodonButton.id = "share_btn_mastodon";
        mastodonButton.style.display = "flex";
        mastodonButton.style.justifyContent = "center";
        mastodonButton.style.alignItems = "center";
        mastodonButton.style.width = "auto";
        mastodonButton.style.padding = "8px";
        mastodonButton.style.background = "#3c99dc";
        mastodonButton.style.borderRadius = "4px";
        mastodonButton.style.textAlign = "center";
        mastodonButton.style.wordBreak = "break-all";
        mastodonButton.style.color = "#fff";
        mastodonButton.style.cursor = "pointer";
        mastodonButton.appendChild(document.createTextNode("🐘 Mastodon"));
        mastodonList.appendChild(mastodonButton);
        shareWrapper.appendChild(mastodonList);
    }

    function share() {
        uploadImage(getShareStatus().imageUrl).then(data => {
            postWithImage(getShareStatus().text, data.id);
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
            text: document.getElementById("share-text").value,
            imageUrl: document.getElementById("complete-image").src,
        };
    }

    function uploadImage(imageUrl) {
        return axios
            .get(imageUrl, {
                responseType: "blob",
                dataType: "binary",
            })
            .then(function(response) {
                const blob = new Blob([response.data], { type: "image/png" });
                const formData = new FormData();
                formData.append("file", blob, "image.png");
                return formData;
            })
            .then(function(formData) {
                return mastodonClient.post("/media", formData);
            })
            .then(function(response) {
                return response.data;
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    function postWithImage(status, imageId) {
        mastodonClient.post("/statuses", {
            status: status,
            media_ids: [imageId],
            // ,visibility: "direct"
        });
    }
})();
