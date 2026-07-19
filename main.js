console.log("main.js 1707 0740 ");

const mapContainer = document.getElementById("map");
const mapViewport = document.getElementById("mapViewport");

let data = [];
let areaData = [];
let linkData = [];
let byId;
let gridMap;
let areaMap;
let minFloor;
let maxFloor;
let floorsByMap;
let currentFloor = 0;
let currentMap = 1;
let currentArea = "";
let currentSubarea = "";
let selectedCellId = 0;
const highlightCells = new Set();
let offsetX = 0;
let offsetY = 0;
let scale = 1;

// LOAD

Promise.all([
    fetch("./map.json").then(r => r.json()),
    fetch("./areas.json").then(r => r.json()),
    fetch("./links.json").then(r => r.json())
])

.then(([mapJson, areasJson, linksJson]) => {

    data = mapJson || [];
    areaData = areasJson || [];
    linkData = linksJson || [];

const built = dataBuilder.build(data, areaData);

byId = built.byId;
gridMap = built.gridMap;
areaMap = built.areaMap;

minFloor = built.minFloor;
maxFloor = built.maxFloor;
floorsByMap = built.floorsByMap;

    if (data.length) {

        currentFloor = data[0].floor;

    }

highlight.init({

    byId,
    highlightCells,

    render: () => renderMap.draw()

});

navigation.init({

    data,
    byId,
    tooltip,
    mapContainer,
    mapViewport,
    topPanel: topPanelModule,
    render: () => renderMap.draw(),
    clearHighlight: () => highlight.clear(),
    getCurrentFloor: () => currentFloor,
    setCurrentFloor: v => currentFloor = v,
    getCurrentMap: () => currentMap,
    setCurrentMap: v => currentMap = v,
    getSelectedCellId: () => selectedCellId,
    setSelectedCellId: v => selectedCellId = v,
    getMinFloor: () => minFloor,
    getMaxFloor: () => maxFloor,
    offset: {
        get x() { return offsetX; },
        set x(v) { offsetX = v; },

        get y() { return offsetY; },
        set y(v) { offsetY = v; }
    },
    scale: {
    get value() { return scale; },
    set value(v) { scale = v; }
}

});

const drag =
    navigator.maxTouchPoints > 0
        ? dragTouch
        : dragDesktop;

    drag.init({

    viewport: mapViewport,
    container: mapContainer,
    tooltip,

    offset: {
        get x() { return offsetX; },
        set x(v) { offsetX = v; },

        get y() { return offsetY; },
        set y(v) { offsetY = v; }
    },

    scale: {

        get value() { return scale; },
        set value(v) { scale = v; }

    }

});

    view.init({

    container: mapContainer,

    offset: {

        get x() { return offsetX; },
        set x(v) { offsetX = v; },

        get y() { return offsetY; },
        set y(v) { offsetY = v; }

    },

    scale: {

        get value() { return scale; },
        set value(v) { scale = v; }

    }

     });

renderMap.init({

    mapContainer,
    mapViewport,

    gridMap,
    areaMap,
    byId,

    topPanel: topPanelModule,
    tooltip,
    drag: drag,

    highlightCells,

    toId,

    getCurrentMap: () => currentMap,
    getCurrentFloor: () => currentFloor,
    getCurrentArea: () => currentArea,
    getCurrentSubarea: () => currentSubarea,
    getSelectedCellId: () => selectedCellId,
    setSelectedCellId: v => selectedCellId = v

});

topPanelModule.init(areaData, data);
    
leftPanel.init(data);

selectedCellId = 0;

const firstCell = data.find(c => c.id_map === 1);

if (firstCell)
    navigation.centerOnCell(firstCell);

mapViewport.addEventListener("click", e => {

    if (e.target.closest(".cell:not(.empty)"))
        return;

    tooltip.hide();

});

});

// HELPERS

function toId(v) {

    if (v === "" || v === null || v === undefined)
        return null;

    const n = Number(v);

    return isNaN(n) ? null : n;

}
