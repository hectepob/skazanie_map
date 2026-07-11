const topPanelModule = (function () {

const panel = document.getElementById("topPanel");

let areaSelect;
let subareaSelect;
let locationInput;

let findButton;

let floorUpButton;
let floorDownButton;
let floorLabel;

let areaData = [];
let mapData = [];

function init(areas, map) {

    areaData = areas;
    mapData = map;

    panel.innerHTML = "";

    // ---------- подписи ----------
    const areaLabel = document.createElement("span");
    areaLabel.textContent = "Регион:";

    const subareaLabel = document.createElement("span");
    subareaLabel.textContent = "Область:";

    const locationLabel = document.createElement("span");
    locationLabel.textContent = "Номер локации:";

    // ---------- поля ----------
    areaSelect = document.createElement("select");

    subareaSelect = document.createElement("select");
    subareaSelect.style.width = "260px";

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

    // ---------- размещение ----------
    panel.appendChild(areaLabel);
    panel.appendChild(areaSelect);

    panel.appendChild(subareaLabel);
    panel.appendChild(subareaSelect);

    panel.appendChild(locationLabel);
    panel.appendChild(locationInput);

    panel.appendChild(findButton);

    panel.appendChild(document.createTextNode(" "));

    panel.appendChild(floorUpButton);
    panel.appendChild(floorLabel);
    panel.appendChild(floorDownButton);

    buildAreas();

// ---------- обработчики ----------

areaSelect.onchange = function () {

    buildSubareas(areaSelect.value);

    locationInput.value = "";

};

subareaSelect.onchange = function () {

    locationInput.value = "";

};

findButton.onclick = function () {

    locationInput.classList.remove("inputError");

    // Поиск по ID
    if (locationInput.value.trim() !== "") {

        const id = Number(locationInput.value);

        if (!byId.has(id)) {

            locationInput.classList.add("inputError");
            return;

        }

        setHighlight(areaSelect.value, subareaSelect.value, id);

        navigation.gotoCell(id);

        return;

    }

    let rec;

    if (subareaSelect.value === "") {

        rec = areaData.find(a =>
            a.area === areaSelect.value &&
            a.id_subarea === 1
        );

    }
    else {

        rec = areaData.find(a =>
            a.area === areaSelect.value &&
            a.subarea === subareaSelect.value
        );

    }

    if (!rec)
        return;

    setHighlight(areaSelect.value, subareaSelect.value);

    navigation.gotoCell(rec.central_cell);

};
    
floorUpButton.onclick = function () {

    navigation.changeFloor(1);

};

floorDownButton.onclick = function () {

    navigation.changeFloor(-1);

};

}   
    
    function buildAreas() {

    areaSelect.innerHTML = "";

    const areas = [];

    areaData.forEach(a => {

        if (!areas.find(x => x.id === a.id_area)) {

            areas.push({
                id: a.id_area,
                area: a.area
            });

        }

    });

    areas.sort((a, b) => a.id - b.id);

    areas.forEach(a => {

        const opt = document.createElement("option");

        opt.value = a.area;
        opt.textContent = a.area;

        areaSelect.appendChild(opt);

    });

    if (areas.length)
        buildSubareas(areas[0].area);

}

function buildSubareas(area) {

    subareaSelect.innerHTML = "";

    const empty = document.createElement("option");

    empty.value = "";
    empty.textContent = "Все области";

    subareaSelect.appendChild(empty);

    areaData
        .filter(x => x.area === area)
        .sort((a, b) => a.id_subarea - b.id_subarea)
        .forEach(x => {

            const opt = document.createElement("option");

            opt.value = x.subarea;
            opt.textContent = x.subarea;

            subareaSelect.appendChild(opt);

        });

}

function setHighlight(area, subarea, singleId = null) {

    if (singleId !== null) {

        highlight.clear();
        return;

    }

    const ids = [];

    mapData.forEach(cell => {

        if (cell.area !== area)
            return;

        if (subarea !== "" && cell.subarea !== subarea)
            return;

        ids.push(cell.id);

    });

    highlight.setCells(ids);

}    

     function clearSelection() {

         locationInput.value = "";
         locationInput.classList.remove("inputError");

     }
    
return {

    init,

    getArea() {

        return areaSelect.value;

    },

    getSubarea() {

        return subareaSelect.value;

    },

    getLocationId() {

        return locationInput.value;

    },

    setArea(value) {

        areaSelect.value = value;

    },

    setSubarea(value) {

        subareaSelect.value = value;

    },

    setLocationId(value) {

        locationInput.value = value;

    },

    setFloor(value) {

        floorLabel.textContent = value;

    },

    clearSelection,

    selectCell(cell) {

        if (!cell)
            return;

        areaSelect.value = cell.area;

        buildSubareas(cell.area);

        subareaSelect.value = cell.subarea;

        locationInput.value = cell.id;

    }

};

})();
