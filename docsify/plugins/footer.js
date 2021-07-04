import { getInfo } from "./util.js";

export const footerPlugin = (hook, vm) => {
    hook.beforeEach((content) => {
        const info = getInfo(vm.route.file);
        // userscriptなどでなければ何もしない
        if (!info) return content;

        // それ以外の場合はソースコードを表示する
        const doc_filename = vm.route.file.split("/").pop();
        const source_filename = doc_filename.replace(".md", "") + info.ext;
        return (
            content +
            `
## Source

[${source_filename}](./${source_filename} ':include')`
        );
    });
};
