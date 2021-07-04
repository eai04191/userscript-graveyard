// ==UserScript==
// @name            Hatena | Remove Hatena Keyword
// @namespace       mizle.net
// @author          Eai <eai@mizle.net>
// @include         *://d.hatena.ne.jp/*
// @include         *://*.hatenablog.com/*
// @include         *://*.hatenablog.jp/*
// @include         *://*.hateblo.jp/*
// @include         *://*.hatenadiary.com/*
// @include         *://*.hatenadiary.jp/*
// @include         *://anond.hatelabo.jp/*
// @description     Remove Hatena Keyword link
// @version         1.0.0
// ==/UserScript==

document
    .querySelectorAll(
        ".keyword[href^='/keyword'], .keyword[href^='http://d.hatena.ne.jp/keyword'], .keyword[href^='https://d.hatena.ne.jp/keyword']"
    )
    .forEach((link) => {
        link.replaceWith(document.createTextNode(link.innerText));
    });
