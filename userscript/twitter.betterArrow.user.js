// ==UserScript==
// @name         Twitter Better Arrow
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      0.0.1
// @match        https://twitter.com/*
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// ==/UserScript==

/*global VM*/

(function() {
    "use strict";

    const getTweetInstance = () => {
        for (const property in document.querySelector(
            "[aria-expanded='true']"
        )) {
            if (property.startsWith("__reactInternalInstance")) {
                const obj = document.querySelector("[aria-expanded='true']")[
                    property
                ];
                return obj;
            }
        }
    };

    const getTweetElement = () => {
        return getTweetInstance().stateNode.querySelector(
            "section div div div"
        );
    };

    const getTweetObj = () => {
        return getTweetInstance().memoizedProps.children.props.children.props;
    };

    VM.registerShortcut("ArrowLeft", () => {
        const currentPage = parseInt(document.URL.split("/").reverse()[0]);
        const tweetElement = getTweetElement();

        // 今のページが1の時にArrowLeftが押されたら前のツイートに行きたい
        if (currentPage === 1) {
            console.log("前のツイートに行くべき");

            const beforeTweet = tweetElement
                .querySelector(`a[href*="retweets"]`) // retweetsだったりretweets/with_commentsだったりするので*
                .closest(`div:not([class])`).previousSibling;
            beforeTweet.querySelector(`a[href$="/photo/4"]`).click();
        }
    });

    VM.registerShortcut("ArrowRight", () => {
        const currentPage = parseInt(document.URL.split("/").reverse()[0]);
        const tweetElement = getTweetElement();
        const tweet = getTweetObj();
        const mediaCount = tweet.focalTweet.extended_entities.media.length;

        // 今のページがメディアの添付数と同じ時にArrowRightが押されたら次のツイートに行きたい
        if (currentPage === mediaCount) {
            console.log("次のツイートに行くべき");

            const nextTweet = tweetElement
                .querySelector(`a[href*="retweets"]`)
                .closest(`div:not([class])`).nextSibling.nextSibling;
            nextTweet.querySelector(`a[href$="/photo/1"]`).click();
        }
    });
})();
