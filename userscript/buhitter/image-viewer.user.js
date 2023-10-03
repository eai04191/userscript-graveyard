// ==UserScript==
// @name         Buhitter | Image Viewer
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      0.0.0
// @match        https://buhitter.com/author/*
// @icon         https://buhitter.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/photoswipe.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/photoswipe-ui-default.min.js
// @resource     photoswipe_style https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/photoswipe.min.css
// @resource     photoswipe_skin_style https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/default-skin/default-skin.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==
/*global PhotoSwipe*/
/*global PhotoSwipeUI_Default*/
/*global GM_addStyle*/
/*global GM_getResourceText*/

"use strict";
GM_addStyle(GM_getResourceText("photoswipe_style"));
GM_addStyle(
    GM_getResourceText("photoswipe_skin_style").replace(
        /url\(/gm,
        "url(https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/default-skin/",
    ),
);
GM_addStyle(`
    /* https://gist.github.com/Grawl/e67aeffbe5e3c09c5ca1acc95765df61#file-previews-sass */
    :root {
        --size: 4em;
    }
    .pswp__caption {
        bottom: var(--size);
    }
    .pswp__previews {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        flex-flow: row;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        overflow: auto;
        scrollbar-width: none;
    }
    .pswp__previews::-webkit-scrollbar {
        display: none;
    }
    .pswp__previews img {
        width: var(--size);
        height: var(--size);
        object-fit: contain;
        opacity: 0.5;
        transition: opacity 0.3s;
        cursor: pointer;
    }
    .pswp__previews img:hover {
        opacity: 0.8;
    }
    .pswp__previews img.is-active {
        opacity: 1;
        cursor: default;
    }
`);
GM_addStyle(`
.pswp__top-bar {
    background: unset;
}
.pswp__top-bar > button {
    z-index: 1;
}
.pswp__top-bar > button::before {
    content: "";
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.pswp__counter {
    background: rgba(0, 0, 0, 0.5);
}
`);

// https://gist.github.com/Grawl/e67aeffbe5e3c09c5ca1acc95765df61
/**
 * @param {object} gallery
 */
const photoswipePreviews = (gallery) => {
    let added = false;
    const props = {
        gallery,
        selector: "[data-previews]",
    };
    gallery.listen("gettingData", () => {
        if (added) return;
        added = true;
        addPreviews(props);
    });
    gallery.listen("close", () => {
        removePreviews(props);
    });
    gallery.listen("afterChange", () => {
        setActivePreview(props);
    });
};

/**
 * @typedef photoSwipePreviewsMethodProps
 * @prop {object} gallery
 * @prop {string} selector
 */

/**
 * @param {photoSwipePreviewsMethodProps} props
 */
const addPreviews = ({ gallery, selector }) => {
    const { scrollWrap, items } = gallery;
    const place = scrollWrap.querySelector(selector);
    for (const item of items) {
        const { msrc: preview } = item;
        const element = document.createElement("img");
        element.setAttribute("src", preview);
        element.addEventListener("click", () => {
            gallery.goTo(items.indexOf(item));
        });
        place.appendChild(element);
    }
};

/**
 * @param {photoSwipePreviewsMethodProps} props
 */
const removePreviews = ({ gallery, selector }) => {
    const { scrollWrap } = gallery;
    const place = scrollWrap.querySelector(selector);
    place.innerHTML = "";
};

/**
 * @param {photoSwipePreviewsMethodProps} props
 */
const setActivePreview = ({ gallery, selector }) => {
    const { scrollWrap, currItem } = gallery;
    const { msrc: preview } = currItem;
    const place = scrollWrap.querySelector(selector);
    const previewElements = place.querySelectorAll("img");
    for (const element of previewElements) {
        const src = element.getAttribute("src");
        const className = "is-active";
        // Warning: collision possible if image not unique
        if (src === preview) {
            element.classList.add(className);
            element.scrollIntoView({ behavior: "smooth" });
        } else element.classList.remove(className);
    }
};

const getDestinationImageURL = (destination, url) => {
    return url.replace(/:[^/]+$/, `:${destination}`);
};

const addPswpElement = () => {
    const html = `
        <!-- Root element of PhotoSwipe. Must have class pswp. -->
        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
            <!-- Background of PhotoSwipe.
                 It's a separate element as animating opacity is faster than rgba(). -->
            <div class="pswp__bg"></div>
            <!-- Slides wrapper with overflow:hidden. -->
            <div class="pswp__scroll-wrap">
                <!-- Container that holds slides.
                    PhotoSwipe keeps only 3 of them in the DOM to save memory.
                    Don't modify these 3 pswp__item elements, data is added later on. -->
                <div class="pswp__container">
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
                <div class="pswp__ui pswp__ui--hidden">
                    <div class="pswp__top-bar">
                        <!--  Controls are self-explanatory. Order can be changed. -->
                        <div class="pswp__counter"></div>
                        <button
                            class="pswp__button pswp__button--close"
                            title="Close (Esc)"
                        ></button>
                        <button
                            class="pswp__button pswp__button--share"
                            title="Share"
                        ></button>
                        <button
                            class="pswp__button pswp__button--fs"
                            title="Toggle fullscreen"
                        ></button>
                        <button
                            class="pswp__button pswp__button--zoom"
                            title="Zoom in/out"
                        ></button>
                        <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
                        <!-- element will get class pswp__preloader--active when preloader is running -->
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                                <div class="pswp__preloader__cut">
                                    <div class="pswp__preloader__donut"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"
                    >
                        <div class="pswp__share-tooltip"></div>
                    </div>
                    <button
                        class="pswp__button pswp__button--arrow--left"
                        title="Previous (arrow left)"
                    ></button>
                    <button
                        class="pswp__button pswp__button--arrow--right"
                        title="Next (arrow right)"
                    ></button>
                    <div class="pswp__previews" data-previews></div>
                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
};

addPswpElement();

const cards = [...document.querySelectorAll(".card-img")].map((e) => {
    return { image: e.getAttribute("data-src"), url: e.parentNode.getAttribute("href") };
});

const items = cards.map((card) => {
    return {
        msrc: card.image,
        src: getDestinationImageURL("orig", card.image),
        title: `<a href="${card.url}" target="_blank" rel="noopener">${card.url}</a>`,
        w: 0,
        h: 0,
    };
});
const gallery = new PhotoSwipe(document.querySelectorAll(".pswp")[0], PhotoSwipeUI_Default, items, {
    bgOpacity: 0.5,
    // bottom: previewの大きさ + 44
    barsSize: { top: 0, bottom: 108 },
});
photoswipePreviews(gallery);

// 画像を読み込んだらw, hを再定義する
// https://github.com/dimsemenov/PhotoSwipe/issues/741#issuecomment-463694294
gallery.listen("imageLoadComplete", function (_index, item) {
    if (item.h < 1 || item.w < 1) {
        let img = new Image();
        img.onload = () => {
            item.w = img.width;
            item.h = img.height;
            gallery.invalidateCurrItems();
            gallery.updateSize(true);
        };
        img.src = item.src;
    }
});

gallery.init();
