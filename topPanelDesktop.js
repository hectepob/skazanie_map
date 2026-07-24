console.log("topPanelDesktop.js  2407 1700 ");
const topPanelDesktop = (function () {
function init(cfg) {

    cfg.topRow.innerHTML = "";
    cfg.bottomRow.innerHTML = "";

    // ---------- первая строка ----------
    cfg.topRow.className = "tpDesktopRow1";
    cfg.topRow.appendChild(cfg.areaLabel);
    cfg.topRow.appendChild(cfg.areaSelect);
    cfg.topRow.appendChild(cfg.subareaLabel);
    cfg.topRow.appendChild(cfg.subareaSelect);
    cfg.topRow.appendChild(document.createElement("span"))
        .textContent = "    ";
    cfg.topRow.appendChild(cfg.locationLabel);
    cfg.topRow.appendChild(cfg.locationInput);
    cfg.topRow.appendChild(cfg.findButton);
    cfg.topRow.appendChild(document.createElement("span"))
        .textContent = "    ";
    cfg.topRow.appendChild(cfg.floorBlock);
    cfg.topRow.appendChild(document.createElement("span"))
        .textContent = "    ";
    cfg.topRow.appendChild(cfg.zoomBlock);

    // ---------- вторая строка ----------
    cfg.bottomRow.className = "tpDesktopRow2";
    const caption = document.createElement("div");
    caption.id = "desktopAreaCaption";
    caption.textContent = "";
    cfg.bottomRow.appendChild(caption);
}

function setCaption(area, subarea) {
    const el = document.getElementById("desktopAreaCaption");
    if (!el)
        return;
    el.textContent = area + " — " + subarea;
}

return {
    init,
    setCaption
};

})();
