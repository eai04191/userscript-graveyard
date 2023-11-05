// ==UserScript==
// @name        iwara.tv | Download with aria2
// @namespace   net.mizle
// @match       https://www.iwara.tv/video/*
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     1.0.0
// @author      Eai <eai@mizle.net>
// @license     MIT
// ==/UserScript==

/* global GM_getValue, GM_registerMenuCommand */

const aria2config = {
    port: GM_getValue("aria2port", 16800),
    // RPC secret in Preferences > Advanced > Security > RPC Secret
    token: GM_getValue("aria2token", ""),
};

/**
 * @param {string} url
 * @returns {string}
 */
function getVideoIdFromUrl(url) {
    return url.match(/\/video\/([^/]+)/)[1];
}

/**
 * @returns {Promise<VideoInfo>}
 *
 * @typedef {Object} User
 * @property {string} name
 * @property {string} username
 *
 * @typedef {Object} VideoInfo
 * @property {string} title
 * @property {string} fileUrl
 * @property {User} user
 */
async function fetchInfo() {
    const videoId = getVideoIdFromUrl(document.URL);
    const response = await fetch(`https://api.iwara.tv/video/${videoId}`);
    const data = await response.json();
    return data;
}

/**
 * @param {VideoInfo} videoInfo
 * @returns {Promise<FileInfo[]>}
 *
 * @typedef {Object} FileSrc
 * @property {string} view
 * @property {string} download
 *
 * @typedef {Object} FileInfo
 * @property {string} id
 * @property {string} name
 * @property {FileSrc} src
 * @property {string} type
 */
async function fetchFileInfos(videoInfo) {
    return await fetch(videoInfo.fileUrl, {
        headers: {
            "X-version": await calculateXversion(videoInfo.fileUrl),
        },
    }).then((res) => res.json());
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 *
 * > https://github.com/yt-dlp/yt-dlp/issues/6549#issuecomment-1473771047
 * > - Get the expires query value from the link
 * > - Get the last component of the path (which is an UUID)
 * > - Concatenate these strings in: <last component> + '_' + <expires> + '_5nFp9kmbNnHdAFhaqMvt'
 * > - Calculate the SHA-1 hash of the concatenated string
 */
async function calculateXversion(url) {
    function hashToString(arrayBuffer) {
        const uint8View = new Uint8Array(arrayBuffer);
        return Array.from(uint8View)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    const urlObj = new URL(url);
    const expires = urlObj.searchParams.get("expires");
    const path = urlObj.pathname.split("/").pop();
    return hashToString(
        await crypto.subtle.digest(
            "SHA-1",
            new TextEncoder().encode(`${path}_${expires}_5nFp9kmbNnHdAFhaqMvt`),
        ),
    );
}

/**
 * @param {string} fileType 'video/mp4'
 */
function getExtFromFileType(fileType) {
    return fileType.split("/").pop();
}

function convertSafeFilename(filename) {
    return filename.replace(/[/\\?%*:|"<>]/g, "_");
}

/**
 * @param {VideoInfo} videoInfo
 * @param {FileInfo} fileInfo
 */
function downloadWithAria2(videoInfo, fileInfo) {
    fetch(`http://localhost:${aria2config.port}/jsonrpc`, {
        method: "POST",
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "aria2.addUri",
            id: "1",
            params: [
                `token:${aria2config.token}`,
                [new URL("https:" + fileInfo.src.download).href],
                {
                    out: convertSafeFilename(
                        [videoInfo.id, videoInfo.user.name, videoInfo.title].join("_") +
                            "." +
                            getExtFromFileType(fileInfo.type),
                    ),
                },
            ],
        }),
    });
}

function run() {
    (async () => {
        const videoInfo = await fetchInfo();
        const fileInfo = await fetchFileInfos(videoInfo);
        const sourceFile = fileInfo.find((f) => f.name === "Source");
        if (!sourceFile) {
            alert("Source file not found");
            return;
        }

        downloadWithAria2(videoInfo, sourceFile);
    })();
}

GM_registerMenuCommand("Download", run);
