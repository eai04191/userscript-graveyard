// ==UserScript==
// @name         Tissue | Favorite Tags
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.1.1
// @match        https://shikorism.net/checkin
// @match        https://shikorism.net/checkin/*/edit
// @icon         https://shikorism.net/favicon.ico
// ==/UserScript==

/**
 * 渡されたテキストをタグ欄に追加する
 */
const dispatchTag = (tag) => {
    const input = document.querySelector("#tagInput");

    // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js#46012210
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
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

const createTagHtml = (tagText) => {
    const username = document.querySelector(`.dropdown-item`).href.match(/user\/(.+)/)[1];
    return `<a
        class="list-inline-item badge badge-primary tis-tag-input-item favorite-tags"
        href="https://shikorism.net/search/checkin?q=user:${username}+tag:${tagText}"
    >
        ${tagText}
    </a>`;
};

const addTagEvent = (tagElement) => {
    tagElement.addEventListener("click", (event) => {
        event.preventDefault();
        dispatchTag(event.target.textContent);
    });
};

(async () => {
    const favoriteTagsSet = await fetch(
        `${document.querySelector(".dropdown-item[href$='/stats']").href}`,
    )
        .then((res) => res.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const tags = [
                ...doc.querySelectorAll(".tis-stat-table a.text-reset:not(.text-decoration-none)"),
            ].reduce((set, element) => set.add(element.innerText.trim()), new Set());
            return tags;
        });

    const recentTagsSet = await fetch(
        `${document.querySelector(".dropdown-item[href$='/okazu']").href}`,
    )
        .then((res) => res.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const tags = [...doc.querySelectorAll(`.mb-2 .badge-secondary`)]
                // 五十音順でソート
                .sort((a, b) => a.innerText.localeCompare(b.innerText), "ja")
                .reduce((set, element) => set.add(element.innerText.trim()), new Set());
            return tags;
        });

    const fragment = document.createDocumentFragment();

    // TODO: refactor
    const favoriteTags = document.createElement("div");
    favoriteTags.insertAdjacentHTML(
        "afterbegin",
        `<small class="form-text text-muted">よく使うタグ: </small>`,
    );
    favoriteTagsSet.forEach((tagText) => {
        const template = document.createElement("template");
        template.innerHTML = createTagHtml(tagText);
        const element = template.content.firstChild;
        addTagEvent(element);
        favoriteTags.appendChild(element);
    });
    fragment.appendChild(favoriteTags);

    // TODO: refactor 2
    const recentTags = document.createElement("div");
    recentTags.insertAdjacentHTML(
        "afterbegin",
        `<small class="form-text text-muted">最近使ったタグ: </small>`,
    );
    recentTagsSet.forEach((tagText) => {
        const template = document.createElement("template");
        template.innerHTML = createTagHtml(tagText);
        const element = template.content.firstChild;
        addTagEvent(element);
        recentTags.appendChild(element);
    });
    fragment.appendChild(recentTags);

    // Fragmentを挿入
    document
        .querySelector(`label[for='tagInput']`)
        .parentElement.insertBefore(fragment, document.querySelector(`.form-group .form-text`));
})();
