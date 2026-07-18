console.log("render 1807 2315");
const renderMap = (function () {

    let cfg;

    function init(config) {

        cfg = config;

    }

function applyCellStyle(el, group) {

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

}

function drawPassages(el, cell) {

    ["north", "south", "west", "east"].forEach(dir => {

        if (cell[dir] === "true")
            el.classList.add(`open-${dir}`);

        if (cell[dir] === "door")
            el.classList.add(`door-${dir}`);

    });

}

function drawStairs(el, cell) {

    const stairs = [
        {
            id: cfg.toId(cell.stairs?.down),
            className: "stairs down",
            symbol: "▼"
        },
        {
            id: cfg.toId(cell.stairs?.up),
            className: "stairs up",
            symbol: "▲"
        }
    ];

    stairs.forEach(stair => {

        if (stair.id === null)
            return;

        const span = document.createElement("span");

        span.className = stair.className;
        span.textContent = stair.symbol;

        span.onclick = e => {

            e.stopPropagation();

            const target = cfg.byId.get(stair.id);

            if (!target)
                return;

            navigation.keepView(target.id);

        };

        el.appendChild(span);

    });

}    

function drawCellId(el, group) {

    const num = document.createElement("span");

    num.className = "cellId";

    if (group.cells.length === 2)
        num.classList.add("multi2");
    else if (group.cells.length >= 3)
        num.classList.add("multi3");

    num.innerHTML = group.displayId;

    el.appendChild(num);

}

function attachTooltip(el, group) {

    el.addEventListener("mouseenter", () => {

        cfg.tooltip.show(group.cells);

    });

    el.addEventListener("mousemove", e => {

        const rect = cfg.mapViewport.getBoundingClientRect();

        cfg.tooltip.move(
            e.clientX - rect.left + 10,
            e.clientY - rect.top + 10
        );

    });

    el.addEventListener("mouseleave", () => {

        cfg.tooltip.hide();

    });

}
    
function attachClick(el, cell) {

    el.addEventListener("click", e => {

        if (cfg.drag.moved())
            return;

        cfg.tooltip.hide();
        cfg.highlightCells.clear();
        cfg.setSelectedCellId(cell.id);
        cfg.topPanel.selectCell(cell);
        cfg.tooltip.show([cell]);

        const rect = cfg.mapViewport.getBoundingClientRect();

const r = el.getBoundingClientRect();
const vr = cfg.mapViewport.getBoundingClientRect();

        cfg.tooltip.move(
            r.right - vr.left + 8,
            r.top - vr.top
        );

        draw();

    });

}
    
function drawCell(group) {

    const el = document.createElement("div");

    el.className = "cell";
    el.style.position = "absolute";
    el.style.left = ((col - 1) * 40) + "px";
    el.style.top  = ((row - 1) * 40) + "px";

    if (group && group.root.id === 1111) {
    requestAnimationFrame(() => {
        console.log(
            "GRID",
            "left =", el.offsetLeft,
            "top =", el.offsetTop,
            "col =", group.root.col,
            "row =", group.root.row
        );
    });
    }

    if (!group) {

        el.classList.add("empty");
        return el;

    }

    const cell = group.root;

applyCellStyle(el, group);
drawPassages(el, cell);
drawStairs(el, cell);
drawCellId(el, group);
attachTooltip(el, group);
attachClick(el, cell);

    return el;

}    
    
function draw() {

    cfg.mapContainer.innerHTML = "";
    let maxCol = 0;
    let maxRow = 0;
    const currentGrid = cfg.gridMap.get(cfg.getCurrentMap());

    if (!currentGrid)
        return;

    currentGrid.forEach(group => {

        const cell = group.root;

    if (cell.floor !== cfg.getCurrentFloor()) return;
    if (cfg.getCurrentArea() && cell.area !== cfg.getCurrentArea()) return;
    if (cfg.getCurrentSubarea() && cell.subarea !== cfg.getCurrentSubarea()) return;
    if (cell.col > maxCol) maxCol = cell.col;
    if (cell.row > maxRow) maxRow = cell.row;

});

    cfg.mapContainer.style.gridTemplateColumns = `repeat(${maxCol}, 40px)`;
    cfg.mapContainer.style.position = "absolute";
    cfg.mapContainer.style.width  = (maxCol * 40) + "px";
    cfg.mapContainer.style.height = (maxRow * 40) + "px";
    
currentGrid.forEach(group => {

    const cell = group.root;

    if (cell.floor !== cfg.getCurrentFloor()) return;
    if (cfg.getCurrentArea() && cell.area !== cfg.getCurrentArea()) return;
    if (cfg.getCurrentSubarea() && cell.subarea !== cfg.getCurrentSubarea()) return;

    const el = drawCell(group);

    cfg.mapContainer.appendChild(el);

});

    cfg.topPanel.setFloor(
        cfg.getCurrentFloor()
    );

    const el = cfg.mapContainer.querySelector(".cell.selected");

    if (el) {

        const rect = el.getBoundingClientRect();
        const vp = cfg.mapViewport.getBoundingClientRect();

        console.log(
            "REAL",
            rect.left - vp.left + rect.width / 2,
            rect.top - vp.top + rect.height / 2
        );

    }

}

    return {
        init,
        draw
    };

})();
