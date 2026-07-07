const mapContainer = document.getElementById("map");
const mapViewport = document.getElementById("mapViewport");

let data = [];
let areaData = [];

let byId = new Map();
let gridMap = new Map();
let areaMap = new Map();

let currentFloor = 0;

let minFloor = 0;
let maxFloor = 0;

let currentArea = "";
let currentSubarea = "";

let selectedCellId = 0;
let highlightCells = new Set();

// -------------------------
// MAP DRAG
// -------------------------

let offsetX = 0;
let offsetY = 0;

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

if (data.length) {

    minFloor = Math.min(...data.map(c => c.floor));
    maxFloor = Math.max(...data.map(c => c.floor));

}

    byId.clear();
    gridMap.clear();
    areaMap.clear();

    // -------------------------
    // AREA COLORS
    // -------------------------

    areaData.forEach(a => {

        if (!areaMap.has(a.area)) {

            areaMap.set(a.area, {
                bg_color: a.bg_color,
                font_color: a.font_color
            });

        }

    });

    // -------------------------
    // MAP DATA
    // -------------------------

    data.forEach(cell => {

        cell.parent_id = Number(cell.parent_id || 0);

        byId.set(cell.id, cell);

    });

    // -------------------------
    // BUILD GRID
    // -------------------------

    data.forEach(cell => {

        let root = cell;

        while (root.parent_id !== 0) {

            root = byId.get(root.parent_id);

            if (!root) break;

        }

        if (!root) return;

        const key = `${root.floor}:${root.row}:${root.col}`;

        if (!gridMap.has(key)) {

            gridMap.set(key, {

                root: root,
                cells: []

            });

        }

        gridMap.get(key).cells.push(cell);

    });

    // -------------------------
    // GROUPS
    // -------------------------

    gridMap.forEach(group => {

        group.cells.sort((a, b) => a.id - b.id);

        group.displayId = group.cells
            .map(c => c.id)
            .join("<br>");

    });

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
    mapViewport,

    topPanel: topPanelModule,

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
    navigation.gotoCell(data[0].id);

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
