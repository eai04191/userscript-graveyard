// ==UserScript==
// @name         Pixiv | Pixiv with Practical
// @namespace    mizle.net
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      0.0.0
// @match        https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @match        https://www.pixiv.net/member_illust.php?illust_id=*
// @icon         https://i.imgur.com/rQcZZqA.png
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
/*global GM_setValue*/
/*global GM_getValue*/

(function () {
    "use strict";

    const $ = document.querySelector.bind(document);
    // const $$ = document.querySelectorAll.bind(document);

    const prefix = "PwP";
    const config = {
        gridColumn: GM_getValue("gridColumn", 3),
        gridColumnMin: GM_getValue("gridColumnMin", 1),
        gridColumnMax: GM_getValue("gridColumnMax", 10),
        gridGapRow: GM_getValue("gridGapRow", 0),
        gridGapColumn: GM_getValue("gridGapColumn", "12px"),
        hideLike: GM_getValue("hideLike", false),
        hideBookmark: GM_getValue("hideBookmark", false),
    };

    const observer = new MutationObserver(function () {
        fook();
    });

    observer.observe(document.getElementById("root"), {
        childList: true,
        subtree: true,
    });

    function fook() {
        initializeRecommendZone();
        updateRecommendZoneItems();
    }

    function initializeRecommendZone() {
        if ($(`.gtm-illust-recommend-zone:not(.${prefix}-recommend-zone-patched)`)) {
            const zone = $(".gtm-illust-recommend-zone");

            // スタイルの設定
            zone.style.gap = `${config.gridGapRow} ${config.gridGapColumn}`;
            updateRecommendZoneGridTemplateColumnsCount(config.gridColumn);

            zone.previousElementSibling.style.float = "left";
            zone.style.clear = "left";
            zone.previousElementSibling.insertAdjacentElement("afterend", createOptionUiElement());

            zone.classList.add(`${prefix}-recommend-zone-patched`);
        }
    }

    function updateRecommendZoneItems() {
        if ($(".gtm-illust-recommend-zone li img")) {
            const items = document
                .querySelector(".gtm-illust-recommend-zone")
                .querySelectorAll(`li:not(.${prefix}-recommend-zone-item-pathed)`);

            unsetSizeStyles(items);

            for (const item of items) {
                const img = item.querySelector("img[src^='https://i.pximg.net/c/']");

                const pageIcon = item.querySelector("svg[viewBox='0 0 9 10']");
                const pageCount = pageIcon ? parseInt(pageIcon.nextSibling.innerText) : 1;

                if (img) {
                    // 大きいURLに置換
                    img.setAttribute("src", getMasterUrl(img.getAttribute("src")));
                    img.style.width = "100%";
                    img.style.height = "100%";
                    // TODO: カラムの大きさに応じていい感じのmax-heightを決めたい
                    // img.style.maxHeight = "300px";
                    img.style.objectPosition = "top";
                    item.style.overflow = "hidden";
                    item.classList.add(`${prefix}-recommend-zone-item-pathed`);

                    // 複数枚の場合カーソル位置でプレビューする処理
                    if (pageCount !== 1) {
                        // 現在のページ数を表記する枠を作る
                        if (!item.querySelector(`.${prefix}-page-status`)) {
                            const pageStatus = document.createElement("span");
                            pageStatus.classList.add(`${prefix}-page-status`);
                            pageStatus.innerText = `1 /`;
                            pageIcon.insertAdjacentElement("beforebegin", pageStatus);
                            pageIcon.style.order = "0";
                            pageStatus.style.order = "1";
                            pageIcon.nextElementSibling.style.order = "2";
                        }

                        // FIXME: itemの中にある要素それぞれにこの処理が適用されてしまっている？
                        item.addEventListener("mousemove", (ev) => {
                            const rect = ev.target.getBoundingClientRect();
                            const width = rect.width;
                            // const height = rect.height;
                            const x = ev.clientX - Math.floor(rect.left) || 1;
                            // const y = ev.clientY - Math.floor(rect.top) || 1;
                            const pagePosition = Math.ceil(x / (width / pageCount));
                            // console.log(width, height, pageCount);
                            // console.log(x, y, pagePosition);

                            // 画像を差し替える
                            img.setAttribute(
                                "src",
                                img
                                    .getAttribute("src")
                                    .replace(/p(\d+)(_master\d+\....)$/, `p${pagePosition - 1}$2`),
                            );

                            updatePageStatus(item, pagePosition);
                        });

                        // カーソルが離れたら1枚めにする
                        item.addEventListener("mouseleave", () => {
                            img.setAttribute(
                                "src",
                                img.getAttribute("src").replace(/p(\d+)(_master\d+\....)$/, `p0$2`),
                            );

                            updatePageStatus(item, 1);
                        });
                    }
                }

                const ugoiraIcon = item.querySelector("img[src^='https://i.pximg.net/']+svg");
                if (ugoiraIcon) {
                    ugoiraIcon.style.display = "none";
                    // TODO: なんとかしてうごイラを動かす
                }

                const userImg = item.querySelector("a[href^='/member.php?id='] img");
                if (userImg) {
                    userImg.style.width = "1em";
                    userImg.style.height = "1em";
                }
            }
        }
    }

    function updatePageStatus(item, page) {
        const pageStatus = item.querySelector(`.${prefix}-page-status`);
        pageStatus.innerText = `${page} /`;
    }

    function getMasterUrl(thumbnailurl) {
        return thumbnailurl
            .replace("/c/360x360_70", "")
            .replace("square1200.jpg", "master1200.jpg");
    }

    function createOptionUiElement() {
        // カラム数変更スライダーを追加
        const element = document.createElement("div");
        element.innerHTML = `
            <div id="${prefix}-column-range-wrapper">
                <label
                    for="${prefix}-column-range"
                >
                    Column:
                </label>
                <input
                    id="${prefix}-column-range"
                    type="range"
                    value="${config.gridColumn}"
                    min="${config.gridColumnMin}"
                    max="${config.gridColumnMax}"
                >
                </input>
                <output>${config.gridColumn}</output>
            </div>
        `;

        element.addEventListener("input", () => {
            rangeChanged(element.querySelector("input"), element.querySelector("output"));
        });

        return element;
    }

    function unsetSizeStyles(nodeList) {
        nodeList.forEach((item) => {
            item.querySelectorAll("*").forEach((e) => {
                e.style.width = "unset";
                e.style.height = "unset";
            });
        });
    }

    function rangeChanged(element, target) {
        const value = element.value;
        target.value = value;
        config.gridColumn = value;
        GM_setValue("gridColumn", value);
        updateRecommendZoneGridTemplateColumnsCount(value);
    }

    function updateRecommendZoneGridTemplateColumnsCount(value) {
        const zone = $(".gtm-illust-recommend-zone");
        zone.style.gridTemplateColumns = `
            repeat(${value}, minmax(0, 1fr))
        `;
    }
})();
