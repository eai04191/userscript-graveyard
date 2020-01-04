// ==UserScript==
// @name         Fantia Archive Downloader
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @match        https://fantia.jp/posts/*
// @require      https://unpkg.com/axios/dist/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// ==/UserScript==

/*global axios*/
/*global JSZip*/

(function() {
    "use strict";

    const archviedFlag = "archived";

    const postId = document
        .querySelector('link[rel="canonical"]')
        .href.match(/https:\/\/fantia\.jp\/posts\/(?<postId>\d+)/u).groups
        .postId;

    const observer = new MutationObserver(() => {
        const gallery = document.querySelector(
            `.type-photo-gallery:not(.${archviedFlag})`
        );
        // 処理していないギャラリーがないなら終わる
        if (!gallery) {
            return;
        }

        // UIを追加する
        const post = gallery.closest("post-content");
        const html = `
            <div class="post-content-reactions" style="width: 100px; float: left;">
                <h3>Download</h3>
                <div class="reactions clearfix dropup">
                    <button class="btn btn-reaction btn-sm archive-downloader-button" style="padding: 5px 12px;">
                        <span class="icon">📦</span>
                        <span class="count"></span>
                    </button>
                </div>
            </div>`;
        post.querySelector(".post-content-reactions").style.float = "left";
        post.querySelector(".post-content-reactions").style.width =
            "calc(100% - 100px)";
        post.querySelector(".post-content-reactions").insertAdjacentHTML(
            "afterend",
            html
        );
        post.querySelector(".post-content-comments").style.clear = "both";
        post.querySelector(".archive-downloader-button").addEventListener(
            "click",
            download,
            false
        );
        post.querySelector(".archive-downloader-button .count").innerText = `${
            post.querySelectorAll(".type-photo-gallery img").length
        } files`;

        // 処理済みのクラスをつける
        gallery.classList.add(archviedFlag);
    });
    observer.observe(document.querySelector("#main"), {
        childList: true,
        subtree: true,
    });

    function download(event) {
        const button = event.srcElement.closest(".archive-downloader-button");
        butttonChangeState("processing", button);
        const gallery = event.srcElement
            .closest("post-content")
            .querySelector(".type-photo-gallery");

        const thambnails = gallery.querySelectorAll(".image-module img");
        const imageIds = [...thambnails].map(
            img =>
                img.src.match(
                    /https:\/\/cc\.fantia\.jp\/uploads\/post_content_photo\/file\/(?<imageId>\d+)\//
                ).groups.imageId
        );

        getFullImageUrls(postId, imageIds).then(fullImageUrls => {
            getBlobs(fullImageUrls).then(blobs => {
                const zip = new JSZip();
                blobs.forEach((response, index) => {
                    const fileType = response.data.type
                        .match(/image\/(?<type>.+)/)
                        .groups.type.replace("jpeg", "jpg");
                    const filename = `${imageIds[index]}.${fileType}`;
                    zip.file(filename, response.data, {
                        binary: true,
                    });
                    console.log(`${filename} added.`);
                });

                zip.generateAsync({ type: "blob" }).then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const title = `${postId}_${
                        document.querySelector("h1.post-title").innerText
                    }`;
                    downloadBlobUrl(blobUrl, title);
                    butttonChangeState("done", button);
                });
            });
        });
    }

    function butttonChangeState(state, buttonElement) {
        const icon = buttonElement.querySelector(".icon");
        if (state === "processing") {
            icon.innerHTML = `<i class="fa fa-refresh fa-spin fa-fw"></i>`;
        } else if (state === "done") {
            icon.innerText = "✅";
        } else {
            icon.innerText = "📦";
        }
    }

    function downloadBlobUrl(blobUrl, filename) {
        const a = document.createElement("a");
        a.download = filename;
        a.href = blobUrl;
        a.click();
    }

    // htmlを取得・パースしてフル画像のURLを取得する
    function getFullImageUrls(postId, imageIds) {
        const fullPageUrls = imageIds.map(
            imageId =>
                `https://fantia.jp/posts/${postId}/post_content_photo/${imageId}`
        );
        return Promise.all(fullPageUrls.map(url => axios.get(url))).then(
            responses => {
                const allResponse = [];
                responses.forEach(response => {
                    const doc = document
                        .createRange()
                        .createContextualFragment(response.data);
                    allResponse.push(doc.querySelector("img").src);
                });
                return Promise.resolve(allResponse);
            }
        );
    }

    // 画像urlの配列を受け取ってaxiosでblobを取得する
    // 返り値はblobのarrayではなく、axiosのresponseのarray
    function getBlobs(urls) {
        return Promise.all(
            urls.map(url => axios.get(url, { responseType: "blob" }))
        ).then(responses => {
            const allResponse = [];
            responses.forEach(response => {
                allResponse.push(response);
            });
            return Promise.resolve(allResponse);
        });
    }
})();
