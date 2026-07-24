const topPanelDesktop = (function () {

function init() {
    if (navigator.maxTouchPoints > 0)
        return;
    const panel = document.getElementById("topPanel");

    // сохраняем всё, что уже построил topPanel.js
    const oldChildren = [...panel.children];
    panel.innerHTML = "";
    const row1 = document.createElement("div");
    row1.className = "tpDesktopRow1";
    const row2 = document.createElement("div");
    row2.className = "tpDesktopRow2";
    panel.appendChild(row1);
    panel.appendChild(row2);
    oldChildren.forEach(el => row1.appendChild(el));
}

    return {
        init
    };

})();
