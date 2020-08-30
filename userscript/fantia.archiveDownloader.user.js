// ==UserScript==
// @name         Fantia Archive Downloader
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.2.0
// @match        https://fantia.jp/posts/*
// @match        https://fantia.jp/fanclubs/*/backnumbers?*
// @require      https://raw.githubusercontent.com/mitchellmebane/GM_fetch/master/GM_fetch.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// ==/UserScript==
/*global GM_fetch*/
/*global GM_xmlhttpRequest*/
/*global GM_download*/
/*global JSZip*/

(function() {
    "use strict";

    const archviedFlag = "archived";
    const compressLevel = 2;

    const observer = new MutationObserver(() => {
        const gallery = document.querySelector(`.type-photo-gallery:not(.${archviedFlag})`);
        // 処理していないギャラリーがないなら終わる
        if (!gallery) {
            return;
        }

        // UIを追加する
        const post = gallery.closest(".post-content");
        const html = `
            <div class="post-content-reactions archive-downloader-wrapper">
                <h3>Download</h3>
                <div class="reactions clearfix dropup">
                    <button class="btn btn-reaction btn-sm archive-downloader-button" style="padding: 5px 12px;">
                        <span class="icon">📦</span>
                        <span class="count"></span>
                    </button>
                </div>
            </div>`;
        if (isBacknumberPage()) {
            post.querySelector(".post-content-body").insertAdjacentHTML("afterend", html);
            post.querySelector(".archive-downloader-wrapper .reactions ").style.marginTop = "1em";
        } else {
            post.querySelector(".post-content-reactions").style.float = "left";
            post.querySelector(".post-content-reactions").style.width = "calc(100% - 100px)";
            post.querySelector(".post-content-reactions").insertAdjacentHTML("afterend", html);
            post.querySelector(".archive-downloader-wrapper").style.width = "100px";
            post.querySelector(".archive-downloader-wrapper").style.float = "left";
            post.querySelector(".post-content-comments").style.clear = "both";
        }
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
        const el = event.srcElement;
        const post = el.closest(".post-content");

        const postTitle = isBacknumberPage()
            ? post.querySelector("a").innerText
            : document.querySelector("h1.post-title").innerText;
        const postContentTitle = isBacknumberPage()
            ? post.querySelector(".post-content-title").innerText
            : el.closest(".post-content-body").previousElementSibling.innerText;
        const postId = isBacknumberPage()
            ? el
                  .closest(".post-content")
                  .querySelector("a")
                  .href.match(/(\d+)/)[0]
            : document
                  .querySelector('link[rel="canonical"]')
                  .href.match(/https:\/\/fantia\.jp\/posts\/(?<postId>\d+)/u).groups.postId;

        // ボタンの状態を変える
        const button = el.closest(".archive-downloader-button");
        butttonChangeState("processing", button);

        // 画像のURLを収集する
        console.time("fetching urls");
        const gallery = post.querySelector(".type-photo-gallery");
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
        GM_download(URL.createObjectURL(zipped), `${postId}_${postTitle}_${postContentTitle}`);
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

    // 画像urlの配列を受け取ってGM_xmlhttpRequestでblobを取得する
    // 返り値はblobのarray
    function getBlobs(urls) {
        return Promise.all(
            urls.map(url => {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        url: url,
                        method: "GET",
                        responseType: "blob",
                        onload: response => {
                            console.log("GM_xmlhttpRequest", response);
                            if (response.status === 200) {
                                resolve(response.response);
                            } else {
                                reject(new Error(response.statusText));
                            }
                        },
                    });
                });
            })
        );
    }

    function isBacknumberPage() {
        return location.href.includes("backnumbers");
    }
})();
