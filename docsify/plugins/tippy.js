/* global tippy */

export const tippyPlugin = (hook) => {
    hook.doneEach(() => {
        tippy("[data-tippy-content]", { placement: "auto" });
    });
};
