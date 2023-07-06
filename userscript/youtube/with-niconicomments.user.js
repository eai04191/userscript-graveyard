// ==UserScript==
// @name         YouTube | with niconicomments
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @match        https://www.youtube.com/watch
// @icon         https://www.youtube.com/favicon.ico
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/@xpadev-net/niconicomments@latest/dist/bundle.min.js
// ==/UserScript==
/* global GM_registerMenuCommand */
/* global NiconiComments */

/**
 * 動画の概要の要素を取得する
 * @returns {Element}
 */
function getDescriptionElement() {
    // #description はいくつかあるけど#metaの中にあるものは常に全文が取れる
    const description = document.querySelector("#meta #description");
    if (!description) {
        throw new Error("Unexpected page format: video description not found.");
    }
    return description;
}

/**
 * 概要テキストからURLを抽出する
 * @param {string} descriptionElement
 * @returns {string[]} 概要テキストに含まれるURLの配列
 */
function getURLsFromDescription(descriptionElement) {
    const urlArrayInDescription = [...descriptionElement.querySelectorAll("a")]
        .map((node) => new URL(node.href).searchParams.get("q"))
        // nullを除外
        .filter((url) => url !== null);
    return urlArrayInDescription;
}

/**
 * URLの配列に含まれる最初のニコニコ動画のURLを取得する
 * @param {string[]} urlArray
 * @returns string | null
 */
function findNiconicoUrl(urlArray) {
    const niconicoURL = urlArray.find((url) => url.includes("www.nicovideo.jp"));
    if (!niconicoURL) {
        return null;
    }
    return niconicoURL;
}

async function fetchNiconicoComments(niconicoURL) {
    const response = await fetch(`https://nicovideo-comment.deno.dev/?url=${niconicoURL}`);
    const json = await response.json();
    return json;
}

/**
 * canvas要素を作成する
 * 大きさは1920x1080固定
 * @returns {HTMLCanvasElement}
 */
function createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    return canvas;
}

/**
 * 動画の近くにcanvasを挿入する
 * @param {HTMLCanvasElement} canvas
 * @returns {HTMLCanvasElement}
 */
function insertCanvas(canvas) {
    return document.querySelector("video").parentNode.appendChild(canvas);
}

/**
 * videoとcanvasの位置を合わせる関数
 *
 * videoのattrを監視して変化があったらinner_styleをcanvasに書き写す
 * @param {HTMLCanvasElement} canvas
 */
const observeVideo = (canvas) => {
    const video = document.querySelector("video");
    /**
     * @param {MutationRecord[]} mutations
     */
    const callback = (mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "style") {
                const videoStyle = mutation.target.style;
                canvas.style.cssText = videoStyle.cssText;
                canvas.style.position = "absolute";
            }
        });
    };
    const observer = new MutationObserver(callback);
    observer.observe(video, {
        attributes: true,
        attributeFilter: ["style"],
    });
    // 初期値を取得するために一度callbackを呼ぶ
    callback([{ target: video, attributeName: "style" }]);
};

/**
 * 概要欄からニコニコ動画のURLを取得する
 *
 * 概要欄にニコニコ動画のURLが含まれていない場合はプロンプトを表示して手動で入力させる
 * @returns {string | null}
 */
function getNiconicoURL() {
    const descriptionElement = getDescriptionElement();
    const urlList = getURLsFromDescription(descriptionElement);
    const niconicoURL = findNiconicoUrl(urlList);

    if (niconicoURL) {
        return niconicoURL;
    }

    const input = prompt(
        "概要欄にニコニコ動画のURLが見つかりませんでした。手動で入力するかキャンセルしてください。",
        ""
    );

    if (!input) {
        return null;
    }

    return input;
}

async function main() {
    const video = document.querySelector("video");
    const niconicoURL = getNiconicoURL();

    // キャンセルされた場合は何もしない
    if (!niconicoURL) {
        return;
    }

    /**
     * @type {any[]}
     */
    const comments = await fetchNiconicoComments(niconicoURL);
    const commentCount = comments.filter((c) => c.chat?.content).length;
    const refferenceComment = comments.find((c) => c.chat?.content);
    // 読み込んだ旨をコメントとして追加する
    comments.push({
        chat: {
            ...refferenceComment.chat,
            vpos: Math.round((video.currentTime + 5) * 100),
            no: refferenceComment.chat.no + 1,
            mail: "red cyan 184",
            content: `${commentCount}件のコメントを読み込みました`,
        },
    });
    console.log(comments);

    const commentCanvas = createCanvas();
    insertCanvas(commentCanvas);
    observeVideo(commentCanvas);

    const niconiComments = new NiconiComments(commentCanvas, comments);
    const intervalId = setInterval(
        () => niconiComments.drawCanvas(Math.floor(video.currentTime * 100)),
        10
    );

    // タイトルが変わったら色々初期化する
    const titleObserver = new MutationObserver(() => {
        console.log("Title changed. Clearing interval.");
        clearInterval(intervalId);
        niconiComments.clear();
        commentCanvas.remove();
        titleObserver.disconnect();
    });
    titleObserver.observe(document.querySelector("title"), {
        childList: true,
    });
}

(() => {
    GM_registerMenuCommand("With NiconicoComments", main);
})();
