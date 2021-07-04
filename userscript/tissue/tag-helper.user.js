// ==UserScript==
// @name         Tissue | Tag Helper
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      0.0.0
// @match        https://shikorism.net/checkin
// @match        https://shikorism.net/checkin/*/edit
// @icon         https://shikorism.net/favicon.ico
// @grant GM_getValue
// @grant GM_setValue
// @require      https://unpkg.com/immer
// ==/UserScript==
/*global GM_getValue*/
/*global GM_setValue*/
/*global immer*/

(function () {
    "use strict";
    // const e = document.createElement("span");
    // e.innerText = "insert new tag";
    // e.style.border = "1px solid gray";
    // e.onclick = () => {
    //     const tag = prompt("new tag name?");
    //     tagHelper.addHistory(tag.trim());
    //     submit(tag.trim());
    //     console.log(tagHelper.history);
    // };
    // document.querySelector("h2").appendChild(e);

    const submit = (tag) => {
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

    const addPopup = () => {
        const a = document.createElement("div");
        a.style.position = "absolute";
        a.style.cursor = "move";
        a.style.height = "300px";
        a.style.width = "200px";
        a.style.top = "100px";
        a.style.border = "1px solid";
        a.style.background = "white";
        document.body.appendChild(a);

        // https://www.w3schools.com/howto/howto_js_draggable.asp
        a.onmousedown = (e) => {
            var pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
            dragMouseDown(e);
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                a.style.top = a.offsetTop - pos2 + "px";
                a.style.left = a.offsetLeft - pos1 + "px";
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
        };
        return a;
    };

    const refreshPopup = (popup) => {
        popup.innerHTML = "";
        const fragment = document.createDocumentFragment();
        tagHelper.history.history
            .map((e) => {
                const span = document.createElement("div");
                span.innerText = `${e.name}: x${e.count}`;
                span.onclick = () => {
                    submit(e.name);
                };
                return span;
            })
            .forEach((e) => {
                fragment.appendChild(e);
            });
        popup.appendChild(fragment);
    };

    const tagHelper = {
        history: GM_getValue("history", { history: [], setting: {} }),
        addHistory: (tag) => {
            const nextHistory = immer.produce(tagHelper.history, (newHistory) => {
                const compareWithCount = (a, b) => {
                    const tagA = a.count;
                    const tagB = b.count;

                    if (tagA > tagB) {
                        return -1;
                    } else if (tagA < tagB) {
                        return 1;
                    }
                    return 0;
                };
                const already = newHistory.history.find((e) => e.name === tag);
                if (already) {
                    already.count++;
                } else {
                    newHistory.history.push({ name: tag, count: 1 });
                }
                newHistory.history.sort(compareWithCount);
            });
            tagHelper.history = nextHistory;
            GM_setValue("history", nextHistory);
            refreshPopup(popup);
        },
    };
    console.log(tagHelper);
    const popup = addPopup();
    refreshPopup(popup);

    let tags;

    const observer = new MutationObserver((mutation) => {
        const oldValue = mutation[0].oldValue || "";
        const newValue = mutation[0].target.value;
        const diff = newValue.replace(oldValue, "").trim();
        tagHelper.addHistory(diff);
    });
    setTimeout(
        (() => {
            tags = document.querySelector("[name='tags']");
            observer.observe(tags, {
                attributes: true,
                attributeOldValue: true,
            });
            console.log(tags, "hooked!");
        })(),
        1 * 1000
    );
})();
