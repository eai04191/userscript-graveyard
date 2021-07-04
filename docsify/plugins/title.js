export const titlePlugin = (hook, vm) => {
    hook.doneEach(() => {
        document.title = document.title + " :: " + vm.config.name;
    });
};
