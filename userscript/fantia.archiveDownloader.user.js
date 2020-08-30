// ==UserScript==
// @name         Fantia Archive Downloader
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.1.0
// @match        https://fantia.jp/posts/*
// @require      https://raw.githubusercontent.com/mitchellmebane/GM_fetch/master/GM_fetch.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==
/*global GM_fetch*/
/*global JSZip*/

(function() {
    "use strict";

    const archviedFlag = "archived";
    const compressLevel = 2;

    const postId = document
        .querySelector('link[rel="canonical"]')
        .href.match(/https:\/\/fantia\.jp\/posts\/(?<postId>\d+)/u).groups.postId;

    const observer = new MutationObserver(() => {
        const gallery = document.querySelector(`.type-photo-gallery:not(.${archviedFlag})`);
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
        post.querySelector(".post-content-reactions").style.width = "calc(100% - 100px)";
        post.querySelector(".post-content-reactions").insertAdjacentHTML("afterend", html);
        post.querySelector(".post-content-comments").style.clear = "both";
        post.querySelector(".archive-downloader-button").addEventListener("click", download, false);
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

    async function download(event) {
        const postTitle = document.querySelector("h1.post-title").innerText;
        const postContentTitle = event.srcElement.closest(".post-content-body")
            .previousElementSibling.innerText;

        // ボタンの状態を変える
        const button = event.srcElement.closest(".archive-downloader-button");
        butttonChangeState("processing", button);

        // 画像のURLを収集する
        console.time("fetching urls");
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
        const fullImageUrls = await getFullImageUrls(postId, imageIds);
        const filenames = fullImageUrls.map(url => new URL(url).pathname.split("/").pop());
        const blobs = await getBlobs(fullImageUrls);
        const files = filenames.map((x, i) => ({ filename: x, blob: blobs[i] }));
        console.timeEnd("fetching urls");

        const zip = new JSZip();

        // 詰める
        files.forEach(file => {
            const { filename, blob } = file;
            zip.file(filename, blob, { binary: true });
            console.log(`${filename} added to zip.`);
        });

        // zipを作成する
        console.time("generate zip");
        const zipped = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: compressLevel,
            },
        });
        console.timeEnd("generate zip");

        // zipをブラウザでダウンロードする
        downloadBlobUrl(URL.createObjectURL(zipped), `${postId}_${postTitle}_${postContentTitle}`);
        butttonChangeState("done", button);
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
            imageId => `https://fantia.jp/posts/${postId}/post_content_photo/${imageId}`
        );
        return Promise.all(
            fullPageUrls.map(async url => {
                const response = await GM_fetch(url);
                const html = await response.text();
                const doc = document.createRange().createContextualFragment(html);
                const src = doc.querySelector("img").src;
                return src;
            })
        );
    }

    // 画像urlの配列を受け取ってGM_fetchでblobを取得する
    // 返り値はblobのarray
    function getBlobs(urls) {
        return Promise.all(urls.map(url => GM_fetch(url).then(r => r.blob())));
    }
})();
