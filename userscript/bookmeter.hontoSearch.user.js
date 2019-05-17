// ==UserScript==
// @name         Bookmeter honto search
// @name:ja-JP   読書メーターにhontoのリンクを追加する
// @namespace    mizle.net
// @version      1.0
// @description  Add honto book search link into bookmeter.
// @icon         https://honto.jp/favicon.ico
// @author       Eai <eai@mizle.net>
// @match        https://bookmeter.com/books/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    function addHonto() {
        try {
            const shopList = document.querySelector(
                ".sidebar__group .group__shop-list"
            );
            if (!shopList.querySelector(".shop-list__item--honto")) {
                const hontoLogo = "https://i.imgur.com/JHnb8iJ.png";

                let title = document
                    .querySelector("meta[name='keywords']")
                    .content.split(",")[0];
                title = title.replace(/巻$/, "");

                const hontoShop = document.createElement("li");
                hontoShop.classList.add(
                    "shop-list__item",
                    "shop-list__item--honto"
                );

                const hontoLink = document.createElement("a");
                hontoLink.setAttribute("target", "_blank");
                hontoLink.href = `https://honto.jp/ebook/search_10${title}.html`;

                const hontoImage = document.createElement("img");
                hontoImage.src = hontoLogo;

                hontoLink.appendChild(hontoImage);
                hontoShop.appendChild(hontoLink);
                shopList.appendChild(hontoShop);

                const style = document.createElement("style");
                style.innerHTML = `
                <style>
                    .books.sidebar .sidebar__group .group__shop-list .shop-list__item--honto>a{
                      padding-bottom: 10px;
                    }
                    .books.sidebar .sidebar__group .group__shop-list .shop-list__item--honto>a>img {
                      width: 30%;
                      height: auto;
                    }
                </style>`;
                document
                    .querySelector("head")
                    .insertAdjacentElement("beforeend", style);
            }
        } catch (error) {
            // console.log(error);
        }
    }

    const config = {
        childList: true,
        subtree: true,
    };
    const observer = new MutationObserver(function(record) {
        observer.disconnect();
        addHonto();
        observer.observe(document.body, config);
    });

    observer.observe(document.body, config);
})();
