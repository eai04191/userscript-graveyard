/** ページパスから拡張子などを返す */
export const getInfo = (filename) => {
    if (filename.includes("README.md")) return false;
    switch (true) {
        case /^\/adblockfilter\//.test(filename):
            return { type: "adblockfilter", title: "Open this Filter", ext: ".txt" };
        case /^\/userscript\//.test(filename):
            return { type: "userscript", title: "Install this Script", ext: ".user.js" };
        case /^\/userstyle\//.test(filename):
            return { type: "userstyle", title: "Install this Style", ext: ".user.styl" };
        default:
            return false;
    }
};
