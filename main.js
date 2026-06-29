const mapContainer = document.getElementById("map");
const tooltip = document.getElementById("tooltip");
const mapViewport = document.getElementById("mapViewport");

let data = [];
let byId = new Map();

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

        byId = new Map();
        data.forEach(cell => byId.set(cell.id, cell));

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

    const floorData = data.filter(c => {

        if (c.floor !== currentFloor)
            return false;

        if (currentArea && c.area !== currentArea)
            return false;

        if (currentSubarea && c.subarea !== currentSubarea)
            return false;

        return true;
    });

    if (!floorData.length) return;

    let maxCol = 0;
    let maxRow = 0;

    floorData.forEach(c => {
        if (c.col > maxCol) maxCol = c.col;
        if (c.row > maxRow) maxRow = c.row;
    });

    mapContainer.style.gridTemplateColumns = `repeat(${maxCol}, 40px)`;

    floorData.forEach(cellData => {

        const el = document.createElement("div");
        el.className = "cell";

        el.style.gridColumn = cellData.col;
        el.style.gridRow = cellData.row;


        // -------------------------
        // PASSAGES
        // -------------------------

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

        el.addEventListener("mousemove", e => {

            const rect = mapViewport.getBoundingClientRect();

            tooltip.style.left = (e.clientX - rect.left + 10) + "px";
            tooltip.style.top = (e.clientY - rect.top + 10) + "px";
        });

        el.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        mapContainer.appendChild(el);
    });
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
        item: 3
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
