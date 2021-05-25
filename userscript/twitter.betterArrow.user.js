// ==UserScript==
// @name         Twitter Better Arrow
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.1
// @match        https://twitter.com/*
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// ==/UserScript==

/*global VM*/

(function () {
    "use strict";

    const getTweetInstance = () => {
        for (const property in document.querySelector("[aria-expanded='true']")) {
            if (property.startsWith("__reactInternalInstance")) {
                const obj = document.querySelector("[aria-expanded='true']")[property];
                return obj;
            }
        }
    };

    const getTweetElement = () => {
        return getTweetInstance().stateNode.querySelector("section div div div");
    };

    const getTweetObj = () => {
        return getTweetInstance().memoizedProps.children.props.children.props;
    };

    VM.registerShortcut("ArrowUp", () => {
        const currentPage = parseInt(document.URL.split("/").reverse()[0]);
        const tweetElement = getTweetElement();

        // 今のページが1の時にArrowUpが押されたら前のツイートに行きたい
        if (currentPage === 1) {
            console.log("前のツイートに行くべき");

            const beforeTweet = tweetElement
                .querySelector(`a[href*="retweets"]`) // retweetsだったりretweets/with_commentsだったりするので*
                .closest(`div:not([class])`).previousSibling;
            beforeTweet.querySelector(`a[href$="/photo/4"]`).click();
        } else {
            document.querySelectorAll(`[role="button"] [style*="9999px"]`)[0].click();
        }
    });

    VM.registerShortcut("ArrowDown", () => {
        const currentPage = parseInt(document.URL.split("/").reverse()[0]);
        const tweetElement = getTweetElement();
        const tweet = getTweetObj();
        const mediaCount = tweet.focalTweet.extended_entities.media.length;

        // 今のページがメディアの添付数と同じ時にArrowDownが押されたら次のツイートに行きたい
        if (currentPage === mediaCount) {
            console.log("次のツイートに行くべき");

            const nextTweet = tweetElement
                .querySelector(`a[href*="retweets"]`)
                .closest(`div:not([class])`).nextSibling.nextSibling;
            nextTweet.querySelector(`a[href$="/photo/1"]`).click();
        } else {
            const arrows = document.querySelectorAll(`[role="button"] [style*="9999px"]`);
            arrows[1] ? arrows[1].click() : arrows[0].click();
        }
    });
})();
