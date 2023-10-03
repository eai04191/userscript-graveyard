// ==UserScript==
// @name         npm | some managers
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @match        https://www.npmjs.com/package/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/toastify-js
// @resource     toastify_css https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// ==/UserScript==
/*global GM_addStyle*/
/*global GM_getResourceText */
/*global Toastify*/

(async () => {
    "use strict";
    GM_addStyle(GM_getResourceText("toastify_css"));

    const timeout = (delay) => {
        return new Promise((res) => setTimeout(res, delay));
    };

    const createCommandWithTypes = (packageName, manager, devFlag, hasDT) => {
        if (hasDT) {
            return [
                createCommand("@types/" + packageName, manager, true),
                createCommand(packageName, manager, devFlag),
            ].join(" && ");
        } else {
            return createCommand(packageName, manager, devFlag);
        }
    };

    const createCommand = (packageName, manager, devFlag = false) => {
        switch (manager) {
            case "yarn":
                if (devFlag) return `yarn add ${packageName} -D`;
                return `yarn add ${packageName}`;
            case "pnpm":
                if (devFlag) return `pnpm add ${packageName} -D`;
                return `pnpm add ${packageName}`;
            default:
                return;
        }
    };

    const copy = (string) => {
        navigator.clipboard.writeText(string);
        Toastify({
            text: `Copied: \`${string}\`!`,
            position: "center",
            backgroundColor: "white",
            style: { color: "rgba(0, 0, 0, 0.8)" },
        }).showToast();
    };

    GM_addStyle(`
    .npmsm_container {
        display: flex;
        gap: 14px;
        margin: 14px 0 16px 0;
        color: rgba(0,0,0,.8);
        font-size: .875rem;
    }
    .npmsm_button {
        border-radius: 5px;
        padding: 10px;
        border: 1px #cccccc solid;
        background: white;

        font-feature-settings: none;
        font-variant-ligatures: none;
        font-family: "Fira Mono", "Andale Mono", "Consolas", monospace;
        letter-spacing: 0px;
        line-height: 24px;
        min-width: 46px;

        display: flex;
        align-items: center;
        justify-content: center;
    }
    .npmsm_button:hover {
        cursor: pointer;
        background: hsl(120, 100%, 93%);
    }
    .npmsm_button img {
        width: 1em;
        height: 1em;
    }
    `);

    const hasDT = !!document.querySelector("h2 img[title*='@types/']");
    const packageName = document
        .querySelector(`[title="Copy Command to Clipboard"] span`)
        .innerText.replace("npm i ", "");

    const originalContainer = document
        .querySelector(`code[title="Copy Command to Clipboard"]`)
        .closest("p");

    if (originalContainer === undefined || packageName === undefined) return;

    const container = document.createElement("div");
    container.classList.add("npmsm_container");

    const yarnButton = document
        .createRange()
        .createContextualFragment(
            `<button class="npmsm_button"><img src="https://s2.svgbox.net/files.svg?ic=yarn"></button>`,
        );
    yarnButton.querySelector("button").addEventListener("click", () => {
        copy(createCommandWithTypes(packageName, "yarn", false, hasDT));
    });
    container.appendChild(yarnButton);

    const yarnDevButton = document
        .createRange()
        .createContextualFragment(
            `<button class="npmsm_button"><img src="https://s2.svgbox.net/files.svg?ic=yarn"><img src="https://s2.svgbox.net/hero-solid.svg?ic=cog&color=0088b6"></button>`,
        );
    yarnDevButton.querySelector("button").addEventListener("click", () => {
        copy(createCommandWithTypes(packageName, "yarn", true, hasDT));
    });
    container.appendChild(yarnDevButton);

    const pnpmButton = document
        .createRange()
        .createContextualFragment(
            `<button class="npmsm_button"><img src="https://s2.svgbox.net/files.svg?ic=light-pnpm"></button>`,
        );
    pnpmButton.querySelector("button").addEventListener("click", () => {
        copy(createCommandWithTypes(packageName, "pnpm", false, hasDT));
    });
    container.appendChild(pnpmButton);

    const pnpmDevButton = document
        .createRange()
        .createContextualFragment(
            `<button class="npmsm_button"><img src="https://s2.svgbox.net/files.svg?ic=light-pnpm"><img src="https://s2.svgbox.net/hero-solid.svg?ic=cog&color=f9ad00"></button>`,
        );
    pnpmDevButton.querySelector("button").addEventListener("click", () => {
        copy(createCommandWithTypes(packageName, "pnpm", true, hasDT));
    });
    container.appendChild(pnpmDevButton);

    await timeout(500);
    originalContainer.parentNode.insertBefore(container, originalContainer);
})();
