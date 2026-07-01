const topPanel = (function () {

    const panel = document.getElementById("topPanel");

    let areaSelect;
    let subareaSelect;

    let findButton;
    let gotoButton;

    function init(areaData) {

        panel.innerHTML = "";

        areaSelect = document.createElement("select");
        subareaSelect = document.createElement("select");

        findButton = document.createElement("button");
        gotoButton = document.createElement("button");

        findButton.textContent = "Найти";
        gotoButton.textContent = "Перейти";

        panel.appendChild(areaSelect);
        panel.appendChild(subareaSelect);
        panel.appendChild(findButton);
        panel.appendChild(gotoButton);

        buildAreas(areaData);

        areaSelect.onchange = function () {

            buildSubareas(areaData, areaSelect.value);

        };

        findButton.onclick = function () {

            // позже

        };

        gotoButton.onclick = function () {

            // позже

        };

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

    function buildSubareas(areaData, area) {

        subareaSelect.innerHTML = "";

        // пустой пункт

        const empty = document.createElement("option");

        empty.value = "";
        empty.textContent = "Все области";

        subareaSelect.appendChild(empty);

        const subs = areaData
            .filter(x => x.area === area)
            .sort((a, b) => a.id_subarea - b.id_subarea);

        subs.forEach(s => {

            const opt = document.createElement("option");

            opt.value = s.subarea;
            opt.textContent = s.subarea;

            subareaSelect.appendChild(opt);

        });

    }

return {
    init: init,

    getArea() {
        return areaSelect.value;
    },

    getSubarea() {
        return subareaSelect.value;
    },

    setSubarea(value) {
        subareaSelect.value = value;
    }
};

})();
