// ==UserScript==
// @name         Pixivで1秒でも早く漫画ビューで見たいときに使うスクリプト
// @namespace    mizle.net
// @version      0.1
// @description  忙しい忙しい
// @author       Eai
// @match        https://www.pixiv.net/member.php?id=*
// @match        https://www.pixiv.net/member_illust.php?id=*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";

  function addExternalLink() {
    console.log("addExternalLink");

    const externalIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 224 224" style=" fill:#000000;background:white;"><g fill="#000000"><path d="M46.66667,28c-10.20192,0 -18.66667,8.46475 -18.66667,18.66667v130.66667c0,10.20192 8.46475,18.66667 18.66667,18.66667h130.66667c10.20192,0 18.66667,-8.46475 18.66667,-18.66667v-65.33333h-18.66667v65.33333h-130.66667v-130.66667h65.33333v-18.66667zM130.66667,28v18.66667h33.46875l-86.73438,86.73438l13.19792,13.19791l86.73438,-86.73437v33.46875h18.66667v-65.33333z"></path></g></svg>`;
    const xpath =
      "//*[name()='svg']/parent::div/parent::div/parent::a/following-sibling::div/div[@class='']";
    const nodesSnapshot = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    const nodes = [];
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
      nodes.push(nodesSnapshot.snapshotItem(i));
    }

    if (nodes[0]) {
      if (!nodes[0].querySelector(".externalLink")) {
        nodes.forEach(function(node) {
          node.style.display = "flex";
          const originalUrl = node.parentNode.previousSibling.getAttribute(
            "href"
          );
          const externalUrl = originalUrl.replace("mode=medium", "mode=manga");

          const externalLink = document.createElement("a");
          externalLink.setAttribute("href", externalUrl);
          externalLink.setAttribute("target", "_blank");
          externalLink.classList.add("externalLink");
          externalLink.style.width = "32px";
          externalLink.style.height = "32px";
          externalLink.style.display = "flex";
          externalLink.style.alignItems = "center";
          externalLink.style.justifyContent = "center";
          externalLink.innerHTML = externalIconSvg;

          node.appendChild(externalLink);
        });
      }
    }
  }

  const config = {
    childList: true,
    subtree: true
  };
  const observer = new MutationObserver(function(record) {
    observer.disconnect();
    addExternalLink();
    observer.observe(document.body, config);
  });

  observer.observe(document.body, config);
})();
