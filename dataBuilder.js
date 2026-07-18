console.log("dataBuilder.js 1807 1720 ");
const dataBuilder = (function () {

    function build(mapData, areaData) {

        const byId = new Map();
        const gridMap = new Map();
        const areaMap = new Map();

        let minFloor = 0;
        let maxFloor = 0;

        if (mapData.length) {
            minFloor = Math.min(...mapData.map(c => c.floor));
            maxFloor = Math.max(...mapData.map(c => c.floor));
        }

        // AREA COLORS
        areaData.forEach(a => {

            if (!areaMap.has(a.area)) {
                areaMap.set(a.area, {
                    bg_color: a.bg_color,
                    font_color: a.font_color
                });
            }
        });

        // MAP DATA

        mapData.forEach(cell => {
            cell.parent_id = Number(cell.parent_id || 0);
            byId.set(cell.id, cell);
        });

        // BUILD GRID

        mapData.forEach(cell => {

            let root = cell;

            while (root.parent_id !== 0) {
                root = byId.get(root.parent_id);
                if (!root)
                    break;
            }

            if (!root)
                return;
            
 // создаём карту для данного map_id

if (!gridMap.has(root.id_map)) {
    gridMap.set(root.id_map, new Map());
}

const mapGrid = gridMap.get(root.id_map);
const key = `${root.floor}:${root.row}:${root.col}`;

if (!mapGrid.has(key)) {
    mapGrid.set(key, {
        root,
        cells: []
    });
}

mapGrid.get(key).cells.push(cell);

        // GROUPS

gridMap.forEach((mapGrid, mapId) => {
    mapGrid.forEach(group => {
        group.cells.sort((a, b) => a.id - b.id);
        group.displayId = group.cells
            .map(c => c.id)
            .join("<br>");
    });
});

console.log("GRIDMAP TEST");
gridMap.forEach((mapGrid, mapId) => {
    console.log(
        "map_id =", mapId,
        "groups =", mapGrid.size
    );
});

        return {
            byId,
            gridMap,
            areaMap,
            minFloor,
            maxFloor
        };

    }

    return {
        build
    };

})();
