const topPanel = (function () {

    const panel = document.getElementById("topPanel");

    let areaSelect;
    let subareaSelect;

    function init(data) {

        panel.innerHTML = "";

        areaSelect = document.createElement("select");
        subareaSelect = document.createElement("select");

        panel.appendChild(areaSelect);
        panel.appendChild(subareaSelect);

        buildAreas(data);

        areaSelect.onchange = function () {
            buildSubareas(data, areaSelect.value);
        };

        subareaSelect.onchange = function () {

            // позже здесь будет:
            // currentArea = ...
            // currentSubarea = ...
            // render();

        };
    }

    function buildAreas(data) {

        areaSelect.innerHTML = "";

        const areas = [...new Set(data.map(c => c.area))].sort();

        areas.forEach(a => {

            const opt = document.createElement("option");
            opt.value = a;
            opt.textContent = a;

            areaSelect.appendChild(opt);

        });

        if (areas.length)
            buildSubareas(data, areas[0]);
    }

    function buildSubareas(data, area) {

        subareaSelect.innerHTML = "";

        const subs =
            [...new Set(
                data
                    .filter(c => c.area === area)
                    .map(c => c.subarea)
            )].sort();

        subs.forEach(s => {

            const opt = document.createElement("option");
            opt.value = s;
            opt.textContent = s;

            subareaSelect.appendChild(opt);

        });

    }

    return {
        init: init
    };

})();