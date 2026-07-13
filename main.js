console.log("#2");//КОНСОЛЬ

const mapContainer = document.getElementById("map");
const mapViewport = document.getElementById("mapViewport");
const mapTranslate = document.getElementById("mapTranslate");

let data = [];
let areaData = [];

let byId;
let gridMap;
let areaMap;

let minFloor;
let maxFloor;

let currentFloor = 0;
let currentArea = "";
let currentSubarea = "";

let selectedCellId = 0;

const highlightCells = new Set();

let offsetX = 0;
let offsetY = 0;
let scale = 1;

// -------------------------
// LOAD
// -------------------------

Promise.all([
    fetch("./map.json").then(r => r.json()),
    fetch("./areas.json").then(r => r.json())
])

.then(([mapJson, areasJson]) => {

data = mapJson || [];
areaData = areasJson || [];

const built = dataBuilder.build(data, areaData);

byId = built.byId;
gridMap = built.gridMap;
areaMap = built.areaMap;

minFloor = built.minFloor;
maxFloor = built.maxFloor;

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

    mapContainer,
    mapTranslate,
    mapViewport,

    topPanel: topPanelModule,

    render: () => renderMap.draw(),

    clearHighlight: () => highlight.clear(),

    getCurrentFloor: () => currentFloor,
    setCurrentFloor: v => currentFloor = v,

    getSelectedCellId: () => selectedCellId,
    setSelectedCellId: v => selectedCellId = v,

    getMinFloor: () => minFloor,
    getMaxFloor: () => maxFloor,

    offset: {

        get x() { return offsetX; },
        set x(v) { offsetX = v; },

        get y() { return offsetY; },
        set y(v) { offsetY = v; }

    }

});

drag.init({

    viewport: mapViewport,
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
    drag,

    highlightCells,

    toId,

    getCurrentFloor: () => currentFloor,
    getCurrentArea: () => currentArea,
    getCurrentSubarea: () => currentSubarea,
    getSelectedCellId: () => selectedCellId,

    setSelectedCellId: v => selectedCellId = v

});

topPanelModule.init(areaData, data);
    
leftPanel.init(data);

selectedCellId = 0;

if (data.length)
    navigation.centerOnCell(data[0]);

});

// -------------------------
// HELPERS
// -------------------------

function toId(v) {

    if (v === "" || v === null || v === undefined)
        return null;

    const n = Number(v);

    return isNaN(n) ? null : n;

}
