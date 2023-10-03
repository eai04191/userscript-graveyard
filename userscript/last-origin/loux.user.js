// ==UserScript==
// @name         last-origin.com | Better User Experience
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @match        https://www.last-origin.com/news.html
// @icon         https://www.last-origin.com/img/apple-touch-icon.png
// ==/UserScript==

// TODO: 読み込みの排他的ロク
// スタイルの追加

const config = {
    totalPage: undefined,
    itemsPerPage: undefined,
    currentPage: undefined,
    perBlock: undefined,
    loading: false,
    lastPageReached: false,
    loadMoreButtonClass: "loux-loadmore",
};

const getUI = () => {
    return {
        loadMoreButton: document.querySelector(`.${config.loadMoreButtonClass}`),
    };
};

const setup = () => {
    document.querySelectorAll("script").forEach((tag) => {
        const script = tag.innerText;
        if (!script.includes("setPaging();")) {
            return;
        }

        const configValues = [...script.matchAll(/parseInt\('(\d+)'\);/g)];
        if (configValues.length !== 4) {
            throw new Error("Unexpected script format");
        }

        config.totalPage = parseInt(configValues[0][1]);
        config.itemsPerPage = parseInt(configValues[1][1]);
        config.currentPage = parseInt(configValues[2][1]);
        config.perBlock = parseInt(configValues[3][1]);
    });

    document.querySelectorAll(".paging_wrap a").forEach((node) => (node.style.display = "none"));

    const button = document.createElement("button");
    button.classList.add(config.loadMoreButtonClass);
    button.innerText = "次のページを読み込む";
    button.onclick = (e) => {
        e.preventDefault();
        callback();
    };
    document.querySelector(".paging_wrap").appendChild(button);

    const ButtonObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type !== "attributes") {
                return;
            }
            if (mutation.attributeName !== "data-state") {
                return;
            }

            const button = mutation.target;

            if (button.dataset.noMoreContent) {
                button.disabled = true;
                button.innerText = "すべてのニュースを読み込みました";
                return;
            }

            if (button.dataset.state === "loading") {
                button.disabled = true;
                button.innerText = "読み込み中……";
            } else {
                button.disabled = false;
                button.innerText = "次のページを読み込む";
            }
        });
    });

    ButtonObserver.observe(button, {
        attributes: true,
    });
};

const createPageUrl = (page) => {
    return `https://www.last-origin.com/news.html?pg=${page}`;
};

const appendNews = (newsHtml) => {
    const newsSection = document.querySelector(".news_section");
    newsSection.innerHTML += newsHtml;
};

const extractHtml = (html) => {
    console.log({ html });
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const hasNext = (() => {
        const maxPage = Math.ceil(config.totalPage / config.itemsPerPage);
        return config.currentPage < maxPage;
    })();

    if (!hasNext) {
        config.lastPageReached = true;
    }

    const newsHtml = doc.querySelector(".news_section").innerHTML;
    return newsHtml;
};

const fetchNextPage = async () => {
    if (config.lastPageReached) {
        return;
    }

    console.log(`fetch: ${config.currentPage + 1}`);
    const response = await fetch(createPageUrl(config.currentPage + 1));
    const html = await response.text();
    return html;
};

const callback = async (entries, observer) => {
    try {
        console.log("observer fired");

        const { loadMoreButton } = getUI();
        loadMoreButton.dataset.state = "loading";
        config.loading = true;

        const html = await fetchNextPage();

        if (!html) {
            loadMoreButton.dataset.state = "waiting";
            return;
        }

        const nextNewsHtml = extractHtml(html);
        appendNews(nextNewsHtml);
        config.currentPage += 1;
    } catch (error) {
        console.error(error);
        observer.unobserve(entries[0].target);
        console.log("observer stopped");
    } finally {
        const { loadMoreButton } = getUI();
        if (config.lastPageReached) {
            loadMoreButton.dataset.state = "noMoreContent";
        } else {
            loadMoreButton.dataset.state = "waiting";
        }
        config.loading = true;
    }
};

setup();
const observer = new IntersectionObserver(callback, {
    threshold: [1],
});
observer.observe(document.querySelector(".paging_wrap"));
