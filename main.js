const mapContainer = document.getElementById("map");
const tooltip = document.getElementById("tooltip");
const mapViewport = document.getElementById("mapViewport");

let data = [];

let byId = new Map();
let gridIndex = new Map();   // 1 клетка = 1 "основной" объект
let cellStack = new Map();    // 1 клетка = массив объектов

let currentFloor = 0;
let currentArea = "";
let currentSubarea = "";

// -------------------------
// LOAD
// -------------------------
fetch("./map.json")
    .then(r => r.json())
    .then(json => {

        data = json || [];

        // нормализация parent_id
        data.forEach(c => {
            c.parent_id = Number(c.parent_id || 0);
        });

        byId = new Map();
        gridIndex = new Map();
        cellStack = new Map();

        data.forEach(cell => {

            byId.set(cell.id, cell);

            const key = `${cell.floor}:${cell.row}:${cell.col}`;

            // основной объект (первый попавшийся)
            if (!gridIndex.has(key)) {
                gridIndex.set(key, cell);
            }

            // стек объектов
            if (!cellStack.has(key)) {
                cellStack.set(key, []);
            }

            cellStack.get(key).push(cell);
        });

        if (data.length) {
            currentFloor = data[0].floor;
        }

        topPanel.init(data);
        leftPanel.init(data);

        render();
    });

// -------------------------
// RENDER MAP
// -------------------------
function render() {

    mapContainer.innerHTML = "";

    let maxCol = 0;
    let maxRow = 0;

    // считаем размеры ТЕКУЩЕГО этажа
    data.forEach(c => {

        if (c.floor !== currentFloor) return;
        if (currentArea && c.area !== currentArea) return;
        if (currentSubarea && c.subarea !== currentSubarea) return;

        if (c.col > maxCol) maxCol = c.col;
        if (c.row > maxRow) maxRow = c.row;
    });

    mapContainer.style.gridTemplateColumns = `repeat(${maxCol}, 40px)`;

    // -------------------------
    // GRID RENDER
    // -------------------------
    for (let r = 1; r <= maxRow; r++) {
        for (let c = 1; c <= maxCol; c++) {

            const key = `${currentFloor}:${r}:${c}`;

            const baseCell = gridIndex.get(key);
            const stack = cellStack.get(key) || [];

            const el = document.createElement("div");
            el.className = "cell";

            el.style.gridColumn = c;
            el.style.gridRow = r;

            // пустая клетка
            if (!baseCell) {
                el.classList.add("empty");
                mapContainer.appendChild(el);
                continue;
            }

            // цвет текста
            if (baseCell.text_color) {
                el.style.setProperty("--cell-color", baseCell.text_color);
                el.style.color = baseCell.text_color;
            }

            // -------------------------
            // PASSAGES
            // -------------------------
            const dirs = ["north", "south", "west", "east"];

            dirs.forEach(dir => {
                if (baseCell[dir] === "true") el.classList.add(`open-${dir}`);
                if (baseCell[dir] === "door") el.classList.add(`door-${dir}`);
            });

            // -------------------------
            // STAIRS
            // -------------------------
            const downId = toId(baseCell.stairs?.down);

            if (downId !== null) {
                const down = document.createElement("span");
                down.className = "stairs down";
                down.textContent = "▼";

                down.onclick = (e) => {
                    e.stopPropagation();
                    const target = byId.get(downId);
                    if (!target) return;

                    currentFloor = target.floor;
                    render();
                };

                el.appendChild(down);
            }

            const upId = toId(baseCell.stairs?.up);

            if (upId !== null) {
                const up = document.createElement("span");
                up.className = "stairs up";
                up.textContent = "▲";

                up.onclick = (e) => {
                    e.stopPropagation();
                    const target = byId.get(upId);
                    if (!target) return;

                    currentFloor = target.floor;
                    render();
                };

                el.appendChild(up);
            }

            // -------------------------
            // ID
            // -------------------------
            const num = document.createElement("span");
            num.className = "cellId";
            num.textContent = baseCell.id;
            el.appendChild(num);

            // -------------------------
            // TOOLTIP
            // -------------------------
console.log("TOOLTIP KEY:", key, stack);
            el.addEventListener("mouseenter", () => {
                tooltip.innerHTML = format(stack);
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

            mapContainer.appendChild(el);
        }
    }
}

// -------------------------
// HELPERS
// -------------------------
function toId(v) {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
}

function format(list) {

    const order = {
        monster: 1,
        npc: 2,
        item: 3,
        comment: 4
    };

    return (list || [])
        .slice()
        .sort((a, b) => (order[a.type] || 99) - (order[b.type] || 99))
        .map(i => {

            if (i.type === "comment") {
                return `<i>${i.name}</i>`;
            }

            let text = i.name;

            if (i.type === "monster") {
                if (i.level) text += " (" + i.level + ")";
                if (i.group) text += " +";
                return "<b>" + text + "</b>";
            }

            return text;
        })
        .join("<br>");
}
