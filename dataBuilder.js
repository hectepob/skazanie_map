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

        mapData.forEach(cell => {

            cell.parent_id = Number(cell.parent_id || 0);

            byId.set(cell.id, cell);

        });

        // -------------------------
        // BUILD GRID
        // -------------------------

        mapData.forEach(cell => {

            let root = cell;

            while (root.parent_id !== 0) {

                root = byId.get(root.parent_id);

                if (!root)
                    break;

            }

            if (!root)
                return;

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
