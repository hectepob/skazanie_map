const renderMap = (function () {

    let cfg;

    function init(config) {

        cfg = config;

    }

    function draw() {

        cfg.mapContainer.innerHTML = "";

        let maxCol = 0;
        let maxRow = 0;

        cfg.gridMap.forEach(group => {

            const cell = group.root;

            if (cell.floor !== cfg.getCurrentFloor()) return;
            if (cfg.getCurrentArea() && cell.area !== cfg.getCurrentArea()) return;
            if (cfg.getCurrentSubarea() && cell.subarea !== cfg.getCurrentSubarea()) return;

            if (cell.col > maxCol) maxCol = cell.col;
            if (cell.row > maxRow) maxRow = cell.row;

        });

        cfg.mapContainer.style.gridTemplateColumns =
            `repeat(${maxCol}, 40px)`;

        for (let row = 1; row <= maxRow; row++) {

            for (let col = 1; col <= maxCol; col++) {

                const key =
                    `${cfg.getCurrentFloor()}:${row}:${col}`;

                const group = cfg.gridMap.get(key);

                const el = document.createElement("div");

                el.className = "cell";
                el.style.gridColumn = col;
                el.style.gridRow = row;

                if (!group) {

                    el.classList.add("empty");
                    cfg.mapContainer.appendChild(el);
                    continue;

                }

                const cell = group.root;

                if (cfg.highlightCells.has(cell.id))
                    el.classList.add("highlight");

                if (group.cells.some(c => c.id === cfg.getSelectedCellId()))
                    el.classList.add("selected");

                const areaStyle = cfg.areaMap.get(cell.area);

                if (areaStyle) {

                    if (areaStyle.bg_color)
                        el.style.backgroundColor = areaStyle.bg_color;

                    if (areaStyle.font_color)
                        el.style.color = areaStyle.font_color;

                }

                if (cell.text_color)
                    el.style.color = cell.text_color;

                ["north", "south", "west", "east"].forEach(dir => {

                    if (cell[dir] === "true")
                        el.classList.add(`open-${dir}`);

                    if (cell[dir] === "door")
                        el.classList.add(`door-${dir}`);

                });

                const downId = cfg.toId(cell.stairs?.down);

                if (downId !== null) {

                    const down = document.createElement("span");

                    down.className = "stairs down";
                    down.textContent = "▼";

                    down.onclick = e => {

                        e.stopPropagation();

                        const target = cfg.byId.get(downId);

                        if (!target)
                            return;

                        navigation.gotoCell(target.id);

                    };

                    el.appendChild(down);

                }

                const num = document.createElement("span");

                num.className = "cellId";

                if (group.cells.length === 2)
                    num.classList.add("multi2");
                else if (group.cells.length >= 3)
                    num.classList.add("multi3");

                num.innerHTML = group.displayId;

                el.appendChild(num);

                const upId = cfg.toId(cell.stairs?.up);

                if (upId !== null) {

                    const up = document.createElement("span");

                    up.className = "stairs up";
                    up.textContent = "▲";

                    up.onclick = e => {

                        e.stopPropagation();

                        const target = cfg.byId.get(upId);

                        if (!target)
                            return;

                        navigation.gotoCell(target.id);

                    };

                    el.appendChild(up);

                }

                // -------------------------
                // TOOLTIP
                // -------------------------

                el.addEventListener("mouseenter", () => {

                    cfg.tooltip.show(group.cells);

                });

                el.addEventListener("mousemove", e => {

                    const rect =
                        cfg.mapViewport.getBoundingClientRect();

                    cfg.tooltip.move(
                        e.clientX - rect.left + 10,
                        e.clientY - rect.top + 10
                    );

                });

                el.addEventListener("mouseleave", () => {

                    cfg.tooltip.hide();

                });

                // -------------------------
                // CLICK
                // -------------------------

                el.addEventListener("click", () => {

                    if (cfg.drag.moved())
                        return;

                    cfg.highlightCells.clear();

                    cfg.setSelectedCellId(cell.id);

                    cfg.topPanel.selectCell(cell);

                    draw();

                });

                cfg.mapContainer.appendChild(el);

            }

        }

        cfg.topPanel.setFloor(
            cfg.getCurrentFloor()
        );

    }

    return {

        init,
        draw

    };

})();
