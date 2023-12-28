// ==UserScript==
// @name        misskey.resonite.love | Public Sessions Widget
// @namespace   net.mizle
// @author      Eai <eai@mizle.net>
// @license     MIT
// @match       https://misskey.resonite.love/*
// @grant       none
// @version     1.0.0
// @description カレンダーウィジェットをPublic Sessionsに置き換える
// ==/UserScript==

"use strict";

// warning:
// セッション取得APIにCORSを設定していないので、何かしらのブラウザ拡張で上書きしてください (CORS Unblockで動作確認済)

/**
 * @typedef {Object} Session
 *
 * @property {string} sessionId
 * @property {boolean} headlessHost
 * @property {string} hostUsername
 * @property {string} name
 * @property {number} joinedUsers
 * @property {number} maxUsers
 * @property {SessionUser[]} sessionUsers
 */

/**
 * @typedef {Object} SessionUser
 *
 * @property {string} username
 * @property {string} userID
 */

/**
 * Fetches sessions from the API and returns an array of Session objects.
 * @returns {Promise<Session[]>} - Array of Session objects.
 */
async function fetchSessions() {
    const apiUrl = `https://resonite-alternative-api.eai.sh/sessions?includeEmptyHeadless=false&minActiveUsers=1`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const sessions = data.map((session) => ({
        ...session,
        name: session.name || "(Unnamed session)",
    }));
    sessions.sort((a, b) => b.joinedUsers - a.joinedUsers);

    return sessions;
}

/**
 * @param {string} text
 */
function sanitizeText(text) {
    const nameNode = document.createElement("span");
    nameNode.innerHTML = text;
    return nameNode.textContent;
}

function createHtmlHeader(sessions) {
    const totalJoinedUsers = sessions.reduce((acc, session) => acc + session.joinedUsers, 0);

    return `
    <header class="xeHoU">
        <div class="xyAgf">
            <span class="xzZPu"><i class="ti ti-apps"></i></span>
            <a href="https://resonite-explorer.eai.sh/sessions" target="_blank">
            Public Sessions (${totalJoinedUsers} users)
            </a>
        </div>
        <div class="xx67a">
            <!-- ここにボタンを追加する -->
        </div>
    </header>
    `;
}

/**
 * @param {Session[]} sessions
 */
function createHtmlBody(sessions) {
    const body = sessions
        .map((session) => {
            const thumbnailHref = session.thumbnailUrl || "#";
            const thumbnailTarget = session.thumbnailUrl ? "_blank" : "";
            const thumbnailStyle = `width: 1.7em; height: 1.7em; border-radius: 6px; background: no-repeat center/cover url('${session.thumbnailUrl}') rgb(0 0 0 / 20%)`;
            const thumbnail = `<a href="${thumbnailHref}" target="${thumbnailTarget}" style="${thumbnailStyle}"></a>`;

            const linkHref = `https://api.resonite.com/sessions/${session.sessionId}`;
            const linkStyle = `flex: 1;`;
            const linkTitle = session.sessionUsers
                .map((user) => {
                    const isHeadless =
                        session.headlessHost && user.username === session.hostUsername;
                    return isHeadless ? `🤖 ${user.username}` : user.username;
                })
                .join("\n");
            const link = `<a href="${linkHref}" target="_blank" style="${linkStyle}" title="${linkTitle}">
                ${sanitizeText(session.name)}
            </a>`;

            const userStatusStyle = `flex-shrink: 0; opacity: 0.8; font-family: monospace;`;
            const userStatusMaxUsersText = session.maxUsers.toString().padStart(2, " ");
            const userStatus = `<span style="${userStatusStyle}">${session.joinedUsers}&thinsp;/&thinsp;${userStatusMaxUsersText}</span>`;

            const sessionStyle = `display: flex; align-items: center; gap: 0.25rem;`;

            return `<div style="${sessionStyle}">
                    ${thumbnail}
                    ${link}
                    ${userStatus}
                </div>
            `;
        })
        .join("");

    const bodyStyle = `display: flex; flex-direction: column; gap: 0.25rem; padding: 0.5rem;`;
    return `<div style="${bodyStyle}">${body}</div>`;
}

/**
 * @param {Element} element
 */
async function update(element) {
    const updateButton = document.createElement("button");
    updateButton.classList.add("_button", "xzeEb");
    updateButton.innerHTML = '<i class="ti ti-refresh"></i>';
    updateButton.addEventListener("click", () => {
        update(element);
    });

    const sessions = await fetchSessions();

    element.innerHTML = createHtmlHeader(sessions) + createHtmlBody(sessions);
    element.querySelector(".xx67a").append(updateButton);
}

async function init() {
    const overrideElement = document.querySelector("#misskey_app [data-cy-mkw-calendar]");
    overrideElement.style.padding = "unset";
    await update(overrideElement);
    // 10秒ごとに自動更新
    setInterval(() => {
        update(overrideElement);
    }, 10 * 1000);
}

(() => {
    setTimeout(init, 8 * 1000);
})();
