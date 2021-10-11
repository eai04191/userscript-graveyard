// ==UserScript==
// @name         Tissue | Favorite Tags
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @match        https://shikorism.net/checkin
// @match        https://shikorism.net/checkin/*/edit
// @icon         https://shikorism.net/favicon.ico
// ==/UserScript==
/*global GM_getValue*/
/*global GM_setValue*/

/**
 * 渡されたテキストをタグ欄に追加する
 */
const dispatchTag = (tag) => {
    const input = document.querySelector("#tagInput");

    // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js#46012210
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
    ).set;
    nativeInputValueSetter.call(input, tag);

    const inputEvent = new Event("input", { bubbles: true });
    const submitEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    });
    input.dispatchEvent(inputEvent);
    input.dispatchEvent(submitEvent);
};

(async () => {
    const favoriteTagsSet = await fetch(
        `${document.querySelector(".dropdown-item[href$='stats']").href}`
    )
        .then((res) => res.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const tags = [
                ...doc.querySelectorAll(".tis-stat-table a.text-reset:not(.text-decoration-none)"),
            ].reduce((set, current) => set.add(current.innerText), new Set());
            return tags;
        });

    const favoriteTags = document.createDocumentFragment();
    favoriteTags.innerText = `よく使うタグ: `;
    favoriteTagsSet.forEach((tagText) => {
        const template = document.createElement("template");
        template.innerHTML = `<span class="list-inline-item badge badge-primary tis-tag-input-item favorite-tags">${tagText}</span>`;
        const element = template.content.firstChild;
        // イベント付与
        element.addEventListener("click", (event) => {
            dispatchTag(event.target.textContent);
        });
        favoriteTags.appendChild(element);
    });

    // Fragmentを挿入
    document
        .querySelector(`label[for='tagInput']`)
        .parentElement.insertBefore(favoriteTags, document.querySelector(`.form-group .form-text`));
})();
