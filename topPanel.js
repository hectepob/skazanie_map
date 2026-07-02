const topPanel = (function () {

    const panel = document.getElementById("topPanel");

    let areaSelect;
    let subareaSelect;
    let locationInput;

    let findButton;
    let areaData = [];

	function init(data) {

    	areaData = data;

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

        // ---------- кнопка ----------

        findButton = document.createElement("button");
        findButton.textContent = "Найти";

        // ---------- размещение ----------

        panel.appendChild(areaLabel);
        panel.appendChild(areaSelect);

        panel.appendChild(subareaLabel);
        panel.appendChild(subareaSelect);

        panel.appendChild(locationLabel);
        panel.appendChild(locationInput);

        panel.appendChild(findButton);

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

            // поиск по ID клетки имеет приоритет

            if (locationInput.value.trim() !== "") {

                gotoCell(Number(locationInput.value));

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

            gotoCell(rec.central_cell);

        };

    }

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

    selectCell(cell) {

        areaSelect.value = cell.area;

        buildSubareas(areaData, cell.area);

        subareaSelect.value = cell.subarea;

        locationInput.value = cell.id;

    }

};

})();
