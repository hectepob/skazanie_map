const mapContainer = document.getElementById("map");
const tooltip = document.getElementById("tooltip");
const mapViewport = document.getElementById("mapViewport");

let data = [];
let byId = new Map();
let gridIndex = new Map();

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

        data.forEach(c => {
            c.parent_id = Number(c.parent_id);
        });

        byId = new Map();
        gridIndex = new Map();

        data.forEach(cell => {
            byId.set(cell.id, cell);

            const key = `${cell.floor}:${cell.row}:${cell.col}`;

            if (!gridIndex.has(key)) {
                gridIndex.set(key, []);
            }

            gridIndex.get(key).push(cell);
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
	    if (c.parent_id && c.parent_id !== "0") return;

	    if (c.col > maxCol) maxCol = c.col;
	    if (c.row > maxRow) maxRow = c.row;
	});

    mapContainer.style.gridTemplateColumns = `repeat(${maxCol}, 40px)`;

    // -------------------------
    // ВАЖНО: рендерим ВСЮ сетку
    // -------------------------
    for (let r = 1; r <= maxRow; r++) {
        for (let c = 1; c <= maxCol; c++) {

            const key = `${currentFloor}:${r}:${c}`;
            const cellData = gridIndex.get(key);

            const el = document.createElement("div");
            el.className = "cell";

            if (cellData && cellData.text_color) {
                el.style.setProperty("--cell-color", cellData.text_color);
            }
            el.style.gridColumn = c;
            el.style.gridRow = r;

            // -------------------------
            // PASSAGES
            // -------------------------
            if (cellData) {

                const dirs = ["north", "south", "west", "east"];

                dirs.forEach(dir => {
                    if (cellData[dir] === "true") el.classList.add(`open-${dir}`);
                    if (cellData[dir] === "door") el.classList.add(`door-${dir}`);
                });

                // -------------------------
                // DOWN
                // -------------------------
                const downId = toId(cellData.stairs?.down);

                if (downId !== null) {
                    const down = document.createElement("span");
                    down.className = "stairs down";
                    down.textContent = "▼";

                    down.onclick = function (e) {
                        e.stopPropagation();

                        const target = byId.get(downId);
                        if (!target) return;

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
                num.textContent = cellData.id;
                el.appendChild(num);

                // -------------------------
                // UP
                // -------------------------
                const upId = toId(cellData.stairs?.up);

                if (upId !== null) {
                    const up = document.createElement("span");
                    up.className = "stairs up";
                    up.textContent = "▲";

                    up.onclick = function (e) {
                        e.stopPropagation();

                        const target = byId.get(upId);
                        if (!target) return;

                        currentFloor = target.floor;
                        render();
                    };

                    el.appendChild(up);
                }

                // -------------------------
                // TOOLTIP
                // -------------------------
                el.addEventListener("mouseenter", () => {
                    tooltip.innerHTML = format(cellData.objects || []);
                    tooltip.style.display = "block";
                });

            } else {
                // пустая клетка
                el.classList.add("empty");
            }

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
        .sort((a, b) => {
            return (order[a.type] || 99) - (order[b.type] || 99);
        })
        .map(i => {
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
