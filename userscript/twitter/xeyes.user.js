// ==UserScript==
// @name         xeyes
// @author       Eai <eai@mizle.net>
// @license      MIT
// @version      1.0.0
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// ==/UserScript==

(function () {
    function addEyes() {
        const eyesHtml = `
        <div class="eyes">
            <div class="eye"><div class="pupil"></div></div>
            <div class="eye"><div class="pupil"></div></div>
        </div>`;

        const style = document.createElement("style");
        style.textContent = `
        .eyes {
            width: 30px;
            height: 30px;
            margin: 10px;
            display: flex;
            flex-direction: row;
        }
        .eye {
            width: 50%;
            height: 100%;
            position: relative;
            background: #fff;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            border: 1.5px solid black;
            overflow: hidden;
        }
        .pupil {
            position: absolute;
            background: #000;
            border-radius: 50%;
            transform-origin: center center;
        }
        .eyes + div {
            display: none;
        }`;
        document.head.appendChild(style);

        const logo = document.querySelector(`a[href="/home"][aria-label="Twitter"] > div`);
        logo.insertAdjacentHTML("beforebegin", eyesHtml);
    }

    function eventAttach() {
        const eyes = document.querySelectorAll(".eye");
        eyes.forEach((eye) => {
            const pupil = eye.firstElementChild;
            const pupilSize = Math.min(eye.clientWidth, eye.clientHeight) / 2;
            pupil.style.width = `${pupilSize}px`;
            pupil.style.height = `${pupilSize}px`;
            pupil.style.left = `${eye.clientWidth / 2 - pupilSize / 2}px`;
            pupil.style.top = `${eye.clientHeight / 2 - pupilSize / 2}px`;
        });
        document.onmousemove = function (event) {
            eyes.forEach((eye) => movePupil(eye, event.clientX, event.clientY));
        };

        function movePupil(eye, mouseX, mouseY) {
            const rect = eye.getBoundingClientRect();
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;
            const dx = mouseX - eyeX;
            const dy = mouseY - eyeY;
            const rad = Math.atan2(dy, dx);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const moveDistX = Math.min(
                dist / 10,
                eye.clientWidth / 2 - eye.firstElementChild.clientWidth / 2
            );
            const moveDistY = Math.min(
                dist / 10,
                eye.clientHeight / 2 - eye.firstElementChild.clientHeight / 2
            );
            const pupilX = moveDistX * Math.cos(rad);
            const pupilY = moveDistY * Math.sin(rad);
            eye.firstElementChild.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!node.querySelector(`a[href="/home"][aria-label="Twitter"] > div`)) {
                    return;
                }
                if (document.querySelector(".eyes")) {
                    return;
                }
                console.log("add eyes");
                addEyes();
                eventAttach();
                observer.disconnect();
            });
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
