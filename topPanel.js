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

        const areaLabel = document.createElement("span");
        areaLabel.textContent = "Регион:";

        areaSelect = document.createElement("select");

        subareaSelect = document.createElement("select");

        locationInput = document.createElement("input");
        locationInput.type = "text";

        findButton = document.createElement("button");
        findButton.textContent = "Найти";


        floorUpButton = document.createElement("button");
        floorUpButton.textContent = "▲";

        floorDownButton = document.createElement("button");
        floorDownButton.textContent = "▼";

        floorLabel = document.createElement("span");
        floorLabel.textContent = "0";


        panel.appendChild(areaLabel);
        panel.appendChild(areaSelect);
        panel.appendChild(subareaSelect);
        panel.appendChild(locationInput);
        panel.appendChild(findButton);

        panel.appendChild(floorUpButton);
        panel.appendChild(floorLabel);
        panel.appendChild(floorDownButton);

    }


    return {

        init,

        setFloor(value) {
            floorLabel.textContent = value;
        },

        selectCell(cell) {

            if (!cell)
                return;

            locationInput.value = cell.id;

        }

    };


})();
