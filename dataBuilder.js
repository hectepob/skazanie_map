console.log("dataBuilder.js 1807 2255");

const dataBuilder = (function () {

    function build(mapData, areaData) {

        const byId = new Map();
        const gridMap = new Map();
        const groupsByMap = new Map();
        const areaMap = new Map();

        let minFloor = Infinity;
        let maxFloor = -Infinity;

        // ---------- AREA COLORS ----------

        areaData.forEach(a => {

            if (!areaMap.has(a.area)) {

                areaMap.set(a.area, {
                    bg_color: a.bg_color,
                    font_color: a.font_color
                });

            }

        });

        // ---------- byId ----------

        mapData.forEach(cell => {

            cell.parent_id = Number(cell.parent_id || 0);

            byId.set(cell.id, cell);

        });

        // ---------- GRID ----------

        mapData.forEach(cell => {

            let root = cell;

            while (root.parent_id !== 0) {

                root = byId.get(root.parent_id);

                if (!root)
                    break;

            }

            if (!root)
                return;

            if (!gridMap.has(root.id_map)) {

                gridMap.set(root.id_map, new Map());

            }

            const mapGrid = gridMap.get(root.id_map);

            const key = `${root.floor}:${root.row}:${root.col}`;

if (!mapGrid.has(key)) {

    const group = {
        root,
        cells: []
    };

    mapGrid.set(key, group);

    if (!groupsByMap.has(root.id_map)) {
        groupsByMap.set(root.id_map, []);
    }

    groupsByMap.get(root.id_map).push(group);
}

            mapGrid.get(key).cells.push(cell);

            if (root.floor < minFloor)
                minFloor = root.floor;

            if (root.floor > maxFloor)
                maxFloor = root.floor;

        });

        // ---------- GROUPS ----------

        gridMap.forEach(mapGrid => {

            mapGrid.forEach(group => {

                group.cells.sort((a, b) => a.id - b.id);

                group.displayId =
                    group.cells
                        .map(c => c.id)
                        .join("<br>");

            });

        });

        // ---------- LOG ----------

        console.log("GRIDMAP");

        gridMap.forEach((mapGrid, mapId) => {

            console.log(
                "map_id =", mapId,
                "groups =", mapGrid.size
            );

        });

        if (minFloor === Infinity)
            minFloor = 0;

        if (maxFloor === -Infinity)
            maxFloor = 0;

return {
    byId,
    gridMap,
    groupsByMap,
    areaMap,
    minFloor,
    maxFloor
};

console.log("GROUP LIST");

groupsByMap.forEach((arr, id) => {
    console.log(
        "map",
        id,
        "groups array =",
        arr.length
    );
});
        
    }

    return {

        build

    };

})();
