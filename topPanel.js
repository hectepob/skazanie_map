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

        // -------------------------
        // LABELS
        // -------------------------

        const areaLabel = document.createElement("span");
        areaLabel.textContent = "Регион:";

        const subareaLabel = document.createElement("span");
        subareaLabel.textContent = "Область:";

        const locationLabel = document.createElement("span");
        locationLabel.textContent = "Номер локации:";

        // -------------------------
        // CONTROLS
        // -------------------------

        areaSelect = document.createElement("select");

        subareaSelect = document.createElement("select");
        subareaSelect.style.width = "260px";

        locationInput = document.createElement("input");
        locationInput.type = "text";
        locationInput.style.width = "80px";

        locationInput.addEventListener("keydown", e => {

            if (e.key !== "Enter")
                return;

            e.preventDefault();
            findButton.click();

        });

        findButton = document.createElement("button");
        findButton.textContent = "Найти";

        // -------------------------
        // FLOOR
        // -------------------------

        const floorWrapper = document.createElement("span");
        floorWrapper.className = "floorBlock";

        const floorText = document.createElement("span");
        floorText.textContent = "Этаж:";

        floorUpButton = document.createElement("button");
        floorUpButton.textContent = "▲";

        floorDownButton = document.createElement("button");
        floorDownButton.textContent = "▼";

        floorLabel = document.createElement("span");
        floorLabel.style.display = "inline-block";
        floorLabel.style.minWidth = "24px";
        floorLabel.style.textAlign = "center";
        floorLabel.textContent = "0";

        floorWrapper.appendChild(floorText);
        floorWrapper.appendChild(floorUpButton);
        floorWrapper.appendChild(floorLabel);
        floorWrapper.appendChild(floorDownButton);

        // -------------------------
        // LAYOUT
        // -------------------------

        panel.appendChild(areaLabel);
        panel.appendChild(areaSelect);

        panel.appendChild(subareaLabel);
        panel.appendChild(subareaSelect);

        panel.appendChild(locationLabel);
        panel.appendChild(locationInput);

        panel.appendChild(findButton);

        panel.appendChild(document.createTextNode("   "));

        panel.appendChild(floorWrapper);

        // -------------------------
        // DATA
        // -------------------------

        buildAreas();

        // -------------------------
        // EVENTS
        // -------------------------

        areaSelect.onchange = function () {

            buildSubareas(areaSelect.value);

            locationInput.value = "";

        };

        subareaSelect.onchange = function () {

            locationInput.value = "";

        };

        findButton.onclick = onFindClick;

        floorUpButton.onclick = function () {

            navigation.changeFloor(1);

        };

        floorDownButton.onclick = function () {

            navigation.changeFloor(-1);

        };

    }

    // -------------------------
    // SEARCH
    // -------------------------

    function onFindClick() {

        locationInput.classList.remove("inputError");

        const text = locationInput.value.trim();

        if (text !== "") {

            const id = Number(text);

            const cell = mapData.find(c => c.id === id);

            if (!cell) {

                locationInput.classList.add("inputError");
                return;

            }

            highlight.clear();

            navigation.gotoCell(id);

            return;

        }

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

    // ---------------------------------

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

    // ---------------------------------

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

})();
