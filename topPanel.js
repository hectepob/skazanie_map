console.log("topPanel.js 2907 1010 ");

const topPanelModule = (function () {
const panel = document.getElementById("topPanel");

let locationInput;
let findButton;
let areaMenuButton;
let areaMenu;
let floorBlock;
let floorUpButton;
let floorDownButton;
let floorLabel;
let zoomPlus;
let zoomBlock;
let zoomMinus;
let zoomInput;
let areaData = [];
let mapData = [];

function init(areas, map) {

    areaData = areas;
    mapData = map;
    panel.innerHTML = "";
    const topRow = document.createElement("div");
    topRow.className = "topRow";
    const bottomRow = document.createElement("div");
    bottomRow.className = "bottomRow";
    panel.appendChild(topRow);
    panel.appendChild(bottomRow);
    
    // ---------- подписи ----------
    const locationLabel = document.createElement("span");
    locationLabel.textContent = "Номер локации:";

    // ---------- поля ----------
    locationInput = document.createElement("input");
    locationInput.type = "text";
    locationInput.style.width = "80px";
    locationInput.addEventListener("keydown", function (e) {
        if (e.key !== "Enter")
            return;
        e.preventDefault();
        findButton.click();
    });

    // ---------- кнопки ----------
    areaMenuButton = document.createElement("button");
    areaMenuButton.type = "button";
    areaMenuButton.textContent = "Выбрать область на карте";
    areaMenuButton.className = "areaMenuButton";

    areaMenu = document.createElement("div");
    areaMenu.className = "areaMenu";
    areaMenu.style.display = "none";
    areaMenu.style.position = "absolute";

    findButton = document.createElement("button");
    findButton.textContent = "Найти";

    floorUpButton = document.createElement("button");
    floorUpButton.textContent = "▲";

    floorDownButton = document.createElement("button");
    floorDownButton.textContent = "▼";

    floorLabel = document.createElement("span");
    floorLabel.textContent = "0";
    floorLabel.style.minWidth = "24px";
    floorLabel.style.display = "inline-block";
    floorLabel.style.textAlign = "center";

    floorBlock = document.createElement("div");
    floorBlock.className = "floorBlock";
    const floorText = document.createElement("span");
    floorText.textContent = "Этаж:";
    floorBlock.appendChild(floorText);
    floorBlock.appendChild(floorUpButton);
    floorBlock.appendChild(floorLabel);
    floorBlock.appendChild(floorDownButton);

    // ---------- масштаб ----------
    const zoomLabel = document.createElement("span");
    zoomLabel.textContent = "Масштаб:";
    zoomPlus = document.createElement("button");
    zoomPlus.textContent = "+";    
    zoomInput = document.createElement("input");
    zoomInput.type = "text";
    zoomInput.value = "100";
    zoomInput.style.width = "45px";
    zoomInput.style.textAlign = "center";
    zoomMinus = document.createElement("button");
    zoomMinus.textContent = "-";

    zoomBlock = document.createElement("div");
    zoomBlock.className = "zoomBlock";
    zoomBlock.appendChild(zoomLabel);
    zoomBlock.appendChild(zoomPlus);
    zoomBlock.appendChild(zoomInput);
    zoomBlock.appendChild(zoomMinus);

// ---------- разделители ----------

    const sep1 = document.createElement("span");
    sep1.textContent = "|";
    sep1.style.margin = "0 8px";
    sep1.style.color = "#666";

    // ---------- размещение ----------
// ---------- первая строка ----------
    topRow.appendChild(areaMenuButton);
    topRow.appendChild(areaMenu);
    topRow.appendChild(locationLabel);
    topRow.appendChild(locationInput);
    topRow.appendChild(findButton);

// ---------- вторая строка ----------
    bottomRow.appendChild(floorBlock);
    bottomRow.appendChild(sep1);
    bottomRow.appendChild(zoomBlock);

    buildAreaMenu(areaMenu);

// ---------- обработчики ----------

    areaMenuButton.onclick = function () {
        areaMenu.style.display =
            areaMenu.style.display === "block"
                ? "none"
                : "block";
    };
    
function buildAreaMenu(areaMenu) {
    areaMenu.innerHTML = "";
    const regions = [];
    areaData.forEach(a => {
        let region = regions.find(r => r.id === a.id_area);
        if (!region) {
            region = {
                id: a.id_area,
                name: a.area,
                subareas: []
            };
            regions.push(region);
        }
        region.subareas.push(a);
    });
    regions.sort((a,b)=>a.id-b.id);
    regions.forEach(region=>{
        const regionRow=document.createElement("div");
        regionRow.className="areaMenuRegion";
        regionRow.textContent=region.name;
        const submenu=document.createElement("div");
        submenu.className="areaSubmenu";
        region.subareas
            .sort((a,b)=>a.id_subarea-b.id_subarea)
            .forEach(sub=>{
                const row=document.createElement("div");
                row.className="areaSubmenuItem";
                row.textContent=sub.subarea;
                row.onclick=function(){
                    areaMenu.style.display="none";
                    const ids = mapData
                        .filter(c =>
                            c.area === region.name &&
                            c.subarea === sub.subarea
                        )
                        .map(c => c.id);
                    highlight.setCells(ids);
                    renderMap.draw();
                    navigation.gotoCell(sub.central_cell);
                };
                submenu.appendChild(row);
            });
        regionRow.appendChild(submenu);
        areaMenu.appendChild(regionRow);
    });
}
  
findButton.onclick = function () {
    locationInput.classList.remove("inputError");
    if (locationInput.value.trim() === "")
        return;
    const id = Number(locationInput.value);
    if (!byId.has(id)) {
        locationInput.classList.add("inputError");
        return;
    }
    highlight.clear();
    navigation.gotoCell(id);
};
    
    floorUpButton.onclick = function () {
        navigation.changeFloor(1);
    };

    floorDownButton.onclick = function () {
        navigation.changeFloor(-1);
    };

    zoomPlus.onclick = () => navigation.setZoom(scale.value + 0.25);
    zoomMinus.onclick = () => navigation.setZoom(scale.value - 0.25);

    zoomInput.addEventListener("keydown", function (e) {
        if (e.key !== "Enter")
            return;
        e.preventDefault();
        const value = Number(zoomInput.value);
        if (isNaN(value))
            return;
        navigation.setZoom(value / 100);
});

    requestAnimationFrame(() => {
    document.documentElement.style.setProperty(
        "--topPanelHeight",
        panel.offsetHeight + "px"
    );
});

}   

function clearSelection() {
    locationInput.value = "";
    locationInput.classList.remove("inputError");
}
    
return {
    init,
    setFloor(value) {
        floorLabel.textContent = value;
    },
    setZoom(value) {
        zoomInput.value = Math.round(value * 100);
    },
    onZoomPlus(fn) {
        zoomPlus.onclick = fn;
    },
    onZoomMinus(fn) {
        zoomMinus.onclick = fn;
    },
    onZoomEnter(fn) {
        zoomInput.onkeydown = e => {
            if (e.key === "Enter")
                fn(Number(zoomInput.value));
        };
    },
    clearSelection,
    selectCell(cell) {
        if (!cell)
            return;
        locationInput.value = cell.id;
    }
};

})();
