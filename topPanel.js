const topPanel = (function () {

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
        locationInput.addEventListener("keydown", function(e) {

            if (e.key !== "Enter")
                return;

            e.preventDefault();

            findButton.click();

        });

        // ---------- кнопка ----------

        findButton = document.createElement("button");
        findButton.textContent = "Найти";

        // ---------- этаж (UI) ----------

        const floorWrapper = document.createElement("span");
        floorWrapper.className = "floorBlock";

        const floorText = document.createElement("span");
        floorText.textContent = "Этаж:";

        floorUpButton = document.createElement("button");
        floorUpButton.textContent = "▲";

        floorDownButton = document.createElement("button");
        floorDownButton.textContent = "▼";

        floorLabel = document.createElement("span");
        floorLabel.textContent = "0";
        floorLabel.style.minWidth = "24px";
        floorLabel.style.textAlign = "center";
        floorLabel.style.display = "inline-block";

        // собрать блок
        floorWrapper.appendChild(floorText);
        floorWrapper.appendChild(floorUpButton);
        floorWrapper.appendChild(floorLabel);
        floorWrapper.appendChild(floorDownButton);

        // ---------- размещение ----------


        panel.appendChild(areaLabel);
        panel.appendChild(areaSelect);

        panel.appendChild(subareaLabel);
        panel.appendChild(subareaSelect);

        panel.appendChild(locationLabel);
        panel.appendChild(locationInput);

        panel.appendChild(findButton);

        panel.appendChild(document.createTextNode("   "));

        panel.appendChild(floorWrapper);

        buildAreas(areaData);

        // ---------------------------------
        // смена региона
        // ---------------------------------

        areaSelect.onchange = function () {

            buildSubareas(areaData, areaSelect.value);

            locationInput.value = "";

        };

        // ---------------------------------
        // смена области
        // ---------------------------------

        subareaSelect.onchange = function () {

            locationInput.value = "";

        };

        // ---------------------------------
        // Найти
        // ---------------------------------

findButton.onclick = function () {

    locationInput.classList.remove("inputError");

    // Поиск по ID имеет приоритет
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

// ---------------------------------
// Этаж вверх
// ---------------------------------

floorUpButton.onclick = function () {

    navigation.changeFloor(1);

};

// ---------------------------------
// Этаж вниз
// ---------------------------------

floorDownButton.onclick = function () {

    navigation.changeFloor(-1);

};

    // ---------------------------------

    function buildAreas(areaData) {

        areaSelect.innerHTML = "";

        const areas = [];

        areaData.forEach(a => {

            if (!areas.find(x => x.area === a.area)) {

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
            buildSubareas(areaData, areas[0].area);

    }

    // ---------------------------------

    function buildSubareas(areaData, area) {

        subareaSelect.innerHTML = "";

        const empty = document.createElement("option");

        empty.value = "";
        empty.textContent = "Все области";

        subareaSelect.appendChild(empty);

        areaData
            .filter(x => x.area === area)
            .sort((a, b) => a.id_subarea - b.id_subarea)
            .forEach(s => {

                const opt = document.createElement("option");

                opt.value = s.subarea;
                opt.textContent = s.subarea;

                subareaSelect.appendChild(opt);

            });

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

    selectCell(cell) {

        areaSelect.value = cell.area;
        buildSubareas(areaData, cell.area);
        subareaSelect.value = cell.subarea;
        locationInput.value = cell.id;

    }

};

function setHighlight(area, subarea, singleId = null) {

    if (typeof window.setHighlightCells !== "function")
        return;

    // Если поиск по номеру локации — подсветку зон не делаем
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

};

})();
