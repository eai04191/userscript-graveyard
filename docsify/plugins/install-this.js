import { getInfo } from "./util.js";

export const installThisPlugin = (hook, vm) => {
    hook.afterEach((html, next) => {
        const file = vm.route.file;
        const fileInfo = getInfo(file);

        if (fileInfo === false) {
            next(html);
            return;
        }

        const url =
            "https://raw.githubusercontent.com/eai04191/userscript-graveyard/master" +
            file.replace(/\.md$/, fileInfo.ext);

        // TODO: depバッジがある場合は警告を出す
        const buttonHtml = `
            <a class="install-this" href="${url}" target="_blank" rel="noopener">
                <p>
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="currentColor"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                    <span>${fileInfo.title}</span>
                </p>
            </a>`;

        next(buttonHtml + html);
    });
};
