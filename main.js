const mapContainer = document.getElementById("map");
const tooltip = document.getElementById("tooltip");
const mapViewport = document.getElementById("mapViewport");

let data = [];
let areaData = [];

let byId = new Map();
let gridMap = new Map();
let areaMap = new Map();

let currentFloor = 0;
let currentCol = 1;
let currentRow = 1;

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

let dragging = false;

let dragStartX = 0;
let dragStartY = 0;
let dragMoved = false;

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

topPanel.init(areaData, data);
leftPanel.init(data);

selectedCellId = 1;

gotoCell(1);

});

// -------------------------
// MAP DRAG
// -------------------------

mapViewport.addEventListener("mousedown", e => {

    if (e.button !== 0) return;

    dragging = true;
    dragMoved = false;

    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;

});

window.addEventListener("mousemove", e => {

    if (!dragging) return;

	if (Math.abs(e.clientX - dragStartX - offsetX) > 5 ||
	    Math.abs(e.clientY - dragStartY - offsetY) > 5) {

	    dragMoved = true;
	}

    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;

    mapContainer.style.transform =
        `translate(${offsetX}px, ${offsetY}px)`;

});

window.addEventListener("mouseup", () => {

    dragging = false;

});

// -------------------------
// RENDER MAP
// -------------------------

function render() {

    mapContainer.innerHTML = "";

    let maxCol = 0;
    let maxRow = 0;

// определяем размеры отображаемой карты
gridMap.forEach(group => {

    const cell = group.root;

    if (cell.floor !== currentFloor) return;
    if (currentArea && cell.area !== currentArea) return;
    if (currentSubarea && cell.subarea !== currentSubarea) return;

    if (cell.col > maxCol) maxCol = cell.col;
    if (cell.row > maxRow) maxRow = cell.row;

});

    mapContainer.style.gridTemplateColumns = `repeat(${maxCol}, 40px)`;

    // рисуем всю сетку
    for (let row = 1; row <= maxRow; row++) {

        for (let col = 1; col <= maxCol; col++) {

            const key = `${currentFloor}:${row}:${col}`;

            const group = gridMap.get(key);

            const el = document.createElement("div");

            el.className = "cell";
            el.style.gridColumn = col;
            el.style.gridRow = row;

            // пустая клетка
            if (!group) {

                el.classList.add("empty");
                mapContainer.appendChild(el);
                continue;

            }

const cell = group.root;

// -------------------------
// HIGHLIGHT
// -------------------------

if (highlightCells.has(cell.id)) {
    el.classList.add("highlight");
}

// -------------------------
// SELECTED CELL
// -------------------------

if (group.cells.some(c => c.id === selectedCellId)) {
    el.classList.add("selected");
}

// -------------------------
// AREA COLORS
// -------------------------

const areaStyle = areaMap.get(cell.area);

if (areaStyle) {

    if (areaStyle.bg_color) {
        el.style.backgroundColor = areaStyle.bg_color;
    }

    if (areaStyle.font_color) {
        el.style.color = areaStyle.font_color;
    }

}

// индивидуальный цвет клетки имеет приоритет
if (cell.text_color) {
    el.style.color = cell.text_color;
}

            // -------------------------
            // PASSAGES
            // -------------------------

            ["north", "south", "west", "east"].forEach(dir => {

                if (cell[dir] === "true")
                    el.classList.add(`open-${dir}`);

                if (cell[dir] === "door")
                    el.classList.add(`door-${dir}`);

            });

// -------------------------
// STAIRS DOWN
// -------------------------

const downId = toId(cell.stairs?.down);

if (downId !== null) {

    const down = document.createElement("span");

    down.className = "stairs down";
    down.textContent = "▼";

    down.onclick = e => {

        e.stopPropagation();

        const target = byId.get(downId);

        if (!target) return;

        selectedCellId = downId;

        currentFloor = target.floor;

        render();

    };

    el.appendChild(down);

}
// -------------------------
// ID
// -------------------------

const num = document.createElement("span");

num.className = "cellId";

if (group.cells.length === 2) {
    num.classList.add("multi2");
}
else if (group.cells.length >= 3) {
    num.classList.add("multi3");
}

num.innerHTML = group.displayId;

el.appendChild(num);

// -------------------------
// STAIRS UP
// -------------------------

const upId = toId(cell.stairs?.up);

if (upId !== null) {

    const up = document.createElement("span");

    up.className = "stairs up";
    up.textContent = "▲";

    up.onclick = e => {

        e.stopPropagation();

        const target = byId.get(upId);

        if (!target) return;

        selectedCellId = upId;

        currentFloor = target.floor;

        render();

    };

    el.appendChild(up);

}
            // -------------------------
            // TOOLTIP
            // -------------------------

            el.addEventListener("mouseenter", () => {

                tooltip.innerHTML = format(group.cells);

                tooltip.style.display = "block";

            });

            el.addEventListener("mousemove", e => {

                const rect = mapViewport.getBoundingClientRect();

                tooltip.style.left = (e.clientX - rect.left + 10) + "px";
                tooltip.style.top = (e.clientY - rect.top + 10) + "px";

            });

            el.addEventListener("mouseleave", () => {

                tooltip.style.display = "none";

            });

el.addEventListener("click", () => {

    if (dragMoved)
        return;

    highlightCells.clear();

    selectedCellId = cell.id;

    topPanel.selectCell(cell);

    render();

});

            mapContainer.appendChild(el);

        }

    }

    topPanel.setFloor(currentFloor);

}


function gotoCell(id) {

    selectedCellId = Number(id);

    const cell = byId.get(Number(id));

    if (!cell)
        return;

	topPanel.selectCell(cell);

    currentFloor = cell.floor;
    currentCol = cell.col;
    currentRow = cell.row;

    render();

    const x = (cell.col - 1) * 40;
    const y = (cell.row - 1) * 40;

    const vw = mapViewport.clientWidth;
    const vh = mapViewport.clientHeight;

    offsetX = vw / 2 - x - 20;
    offsetY = vh / 2 - y - 20;

    mapContainer.style.transform =
        `translate(${offsetX}px, ${offsetY}px)`;

}

// -------------------------
// CHANGE FLOOR
// -------------------------

window.changeFloor = function(step) {

    const newFloor = currentFloor + step;

    if (newFloor < minFloor || newFloor > maxFloor)
        return;

    const target = data.find(c =>
        c.col === currentCol &&
        c.row === currentRow &&
        c.floor === newFloor
    );

    if (!target)
        return;

    gotoCell(target.id);

};

// -------------------------
// HIGHLIGHT
// -------------------------

window.setHighlightCells = function (ids) {

    highlightCells.clear();

    ids.forEach(id => {

        const cell = byId.get(Number(id));

        if (!cell)
            return;

        // ищем корневую клетку
        let root = cell;

        while (root.parent_id !== 0) {

            root = byId.get(root.parent_id);

            if (!root)
                return;

        }

        highlightCells.add(root.id);

    });

    render();

};

// -------------------------
// CHANGE FLOOR
// -------------------------

window.changeFloor = function(step) {

    const newFloor = currentFloor + step;

    if (newFloor < minFloor || newFloor > maxFloor)
        return;

    const target = data.find(c =>
        c.col === currentCol &&
        c.row === currentRow &&
        c.floor === newFloor
    );

    if (!target)
        return;

    gotoCell(target.id);

};

// -------------------------
// HELPERS
// -------------------------

function toId(v) {

    if (v === "" || v === null || v === undefined)
        return null;

    const n = Number(v);

    return isNaN(n) ? null : n;

}

function format(cells) {

    const order = {
        monster: 1,
        npc: 2,
        item: 3,
        comment: 4
    };

    let html = [];

    cells.forEach((cell, index) => {

        const objects = (cell.objects || []).slice();

        // если в локации ничего нет — пропускаем
        if (objects.length === 0)
            return;

        objects.sort((a, b) =>
            (order[a.type] || 99) - (order[b.type] || 99)
        );

        // если в клетке несколько ID — выводим заголовок
        if (cells.length > 1) {
            html.push(`<b class="tooltip-location">${cell.id}</b>`);
        }

        // вывод объектов
        objects.forEach(obj => {

            let text = obj.name;

            switch (obj.type) {

                case "monster":

                    if (obj.level)
                        text += ` (${obj.level})`;

                    if (obj.group)
                        text += " +";

                    html.push(`<b>${text}</b>`);

                    break;

                case "comment":

                    html.push(`<i>${text}</i>`);

                    break;

                default:

                    html.push(text);

            }

        });

        // разделитель между локациями
        if (index < cells.length - 1) {
            html.push(`<hr class="tooltip-divider">`);
        }

    });

    return html.join("<br>");

}
