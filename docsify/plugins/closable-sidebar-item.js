export const closableSidebarItemPlugin = (hook) => {
    hook.doneEach(() => {
        const items = document.querySelectorAll(".sidebar-nav > ul > li strong");
        items.forEach((item) =>
            item.addEventListener(
                "click",
                () => {
                    item.classList.toggle("ug-close");
                    item.nextSibling.classList.toggle("ug-hidden");
                },
                false
            )
        );
    });
};
