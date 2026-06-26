const mapContainer = document.getElementById("map");
const tooltip = document.getElementById("tooltip");

let data = [];

fetch("./map.json")
.then(r => r.json())
.then(json => {
data = json || [];
render();
});

function render() {
if (!data.length) return;

const index = new Map();
let maxCol = 0;
let maxRow = 0;

data.forEach(c => {
index.set(${c.col}:${c.row}, c);
if (c.col > maxCol) maxCol = c.col;
if (c.row > maxRow) maxRow = c.row;
});

mapContainer.style.gridTemplateColumns = repeat(${maxCol}, 40px);

for (let r = 1; r <= maxRow; r++) {
for (let c = 1; c <= maxCol; c++) {
const key = ${c}:${r};
const cellData = index.get(key);

  const el = document.createElement("div");
  el.className = "cell";

  if (cellData) {
    el.textContent = cellData.id;

    el.addEventListener("mouseenter", () => {
      tooltip.innerHTML = format(cellData.content || []);
      tooltip.style.display = "block";
    });

    el.addEventListener("mousemove", e => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    });

    el.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  } else {
    el.textContent = "";
  }

  mapContainer.appendChild(el);
}

}
}

function format(list) {
return (list || [])
.map(i => {
const name = i.name + (i.group ? " +" : "");
return i.type === "monster" ? <b>${name}</b> : name;
})
.join("<br>");
}