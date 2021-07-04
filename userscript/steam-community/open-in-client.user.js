// ==UserScript==
// @name        Steam Community | Open in Steam client
// @name:ja-JP  Steam Community | Steamクライアントで開く
// @author      Eai <eai@mizle.net>
// @license     MIT
// @version     1.0.1
// @match       https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon        https://steamcommunity.com/favicon.ico
// @grant       none
// ==/UserScript==

const id = new URL(document.URL).searchParams.get("id");
const container = document.querySelector("#ItemControls");

const button = document.createElement("div");
button.classList.add("workshopItemControlCtn");

const inner = document.createElement("a");
inner.classList.add("general_btn");
inner.innerText = "Open in Steam Client";
inner.setAttribute("href", `steam://url/CommunityFilePage/${id}`);

button.appendChild(inner);
container.appendChild(button);
