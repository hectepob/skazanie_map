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

  let minCol = Infinity;
  let minRow = Infinity;

  data.forEach(c => {
    index.set(`${c.col}:${c.row}:${c.floor}`, c);

    if (c.col < minCol) minCol = c.col;
    if (c.row < minRow) minRow = c.row;
  });

  // нормализуем координаты (сдвиг в 0..N)
  const shiftCol = minCol;
  const shiftRow = minRow;

  // контейнер больше не обязан быть grid
  mapContainer.innerHTML = "";
  mapContainer.style.position = "relative";

  data.forEach(cellData => {

    const el = document.createElement("div");
    el.className = "cell";

    // позиционирование вместо grid
    el.style.position = "absolute";
    el.style.left = ((cellData.col - shiftCol) * 40) + "px";
    el.style.top = ((cellData.row - shiftRow) * 40) + "px";
    el.style.width = "40px";
    el.style.height = "40px";

    el.textContent = cellData.id;

    el.addEventListener("mouseenter", () => {
      tooltip.innerHTML = format(cellData.objects || []);
      tooltip.style.display = "block";
    });

    el.addEventListener("mousemove", e => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
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
      const name = i.name + (i.group ? " +" : "");
      return i.type === "monster" ? `<b>${name}</b>` : name;
    })
    .join("<br>");
}
