import { getInfo } from "./util.js";

export const badgePlugin = (hook, vm) => {
    hook.beforeEach((content) => {
        const { type = "ファイル" } = getInfo(vm.route.file);

        const replaceTable = [
            [
                `{{Deprecated}}`,
                `<span class="badge deprecated" data-tippy-content="この${type}は正常に動作しない、あるいはサイトの仕様変更により意味がなくなったため非推奨です。">Deprecated</span>`,
            ],
            [
                `{{Bad}}`,
                `<span class="badge bad" data-tippy-content="この${type}は「悪い」です。">Bad</span>`,
            ],
            [
                `{{WIP}}`,
                `<span class="badge wip" data-tippy-content="この${type}は作ってる途中なのでたぶん動きません。">WIP</span>`,
            ],
        ];
        const replaced = replaceTable.reduce((accumulator, value) => {
            return accumulator.replaceAll(value[0], value[1]);
        }, content);

        return replaced;
    });
};
