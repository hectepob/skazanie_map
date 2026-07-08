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

    console.log("topPanel init start"); // КОНСОЛЬ

    areaData = areas;
    mapData = map;

    panel.innerHTML = "";

    console.log("panel found"); // КОНСОЛЬ

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

    console.log("areas built"); // КОНСОЛЬ

    console.log("topPanel init end"); // КОНСОЛЬ

}
    
    function buildSubareas(area) {

        subareaSelect.innerHTML = "";


        const empty = document.createElement("option");

        empty.value = "";
        empty.textContent = "Все области";

        subareaSelect.appendChild(empty);



        areaData
            .filter(x => x.area === area)
            .forEach(x => {

                const opt = document.createElement("option");

                opt.value = x.subarea;
                opt.textContent = x.subarea;

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

        if (!cell)
            return;

        areaSelect.value = cell.area;

        buildSubareas(cell.area);

        subareaSelect.value = cell.subarea;

        locationInput.value = cell.id;

    }

};

})();
