const mapContainer = document.getElementById("map");
const tooltip = document.getElementById("tooltip");

let data = [];
let byId = new Map();
let currentFloor = 0;

function toBool(v) {
    return v === true || v === "true";
}

function toId(v) {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
}

fetch("./map.json")
    .then(r => r.json())
    .then(json => {
        data = json || [];

        byId = new Map();
        data.forEach(cell => {
            byId.set(cell.id, cell);
        });

        if (data.length) currentFloor = data[0].floor;

        render();
    });

function render() {

    mapContainer.innerHTML = "";

    const floorData = data.filter(c => c.floor === currentFloor);

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
            tooltip.style.left = (e.pageX + 10) + "px";
            tooltip.style.top = (e.pageY + 10) + "px";
        });

        el.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        mapContainer.appendChild(el);
    });
}

function format(list) {
    return (list || [])
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
