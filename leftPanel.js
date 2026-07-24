console.log("leftPanel.js 2307 2300 ");
const leftPanel = (function () {

    const panel = document.getElementById("leftPanel");
    let sections = {};
    let selectedItem = null;
    let followCheckbox;
    let calcCheckbox;
    let currentInfoBlock = null;
    let cfg;
    let foundCells = [];
    let currentFoundIndex = 0;

function init(config) {
    cfg = config;
    const data = cfg.data;
    const highlight = cfg.highlight;
    const renderMap = cfg.renderMap;
    const navigation = cfg.navigation;
    panel.innerHTML = "";
    sections = {};
    const options = document.createElement("div");
    followCheckbox = document.createElement("input");
    followCheckbox.type = "checkbox";
    const followLabel = document.createElement("label");
    followLabel.appendChild(followCheckbox);
    followLabel.append(" Перейти к выбранному объекту");
    options.appendChild(followLabel);
    options.appendChild(document.createElement("br"));
    calcCheckbox = document.createElement("input");
    calcCheckbox.type = "checkbox";
    const calcLabel = document.createElement("label");
    calcLabel.appendChild(calcCheckbox);
    calcLabel.append(" Открыть калькулятор монстров");
    options.appendChild(calcLabel);
    panel.appendChild(options);
    panel.appendChild(document.createElement("hr"));
    createAccordion(
        "Монстры",
        "monster",
        getUnique(data, "monster")
    );
    createAccordion(
        "NPC",
        "npc",
        getUnique(data, "npc")
    );
    createAccordion(
        "Предметы",
        "item",
        getUnique(data, "item")
    );
}

function getUnique(data, type) {
    const map = new Map();
    data.forEach(cell => {
        (cell.objects || []).forEach(obj => {
            if (obj.type !== type)
                return;
            if (!map.has(obj.id)) {
                map.set(obj.id, obj.name);
            }
        });
    });
    return [...map.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], "ru"))
        .map(x => ({
            id: x[0],
            name: x[1]
        }));
}

    function findCellsByObject(item) {

    const result = [];

    cfg.data.forEach(cell => {

        (cell.objects || []).forEach(obj => {

            if (obj.id === item.id) {
                result.push(cell);
            }

        });

    });

    result.sort((a, b) => a.id - b.id);

    return result;

    }

function createAccordion(title, key, list) {
    const wrapper = document.createElement("div");
    wrapper.className = "accordion";
    const header = document.createElement("div");
    header.className = "accordionHeader";
    header.textContent = "▶ " + title;
    const body = document.createElement("div");
    body.className = "accordionBody";
    body.style.display = "none";
    
    // ---------- поиск ----------
    const search = document.createElement("input");
    search.type = "search";
    search.className = "accordionSearch";
    search.placeholder = "Поиск...";
    body.appendChild(search);
    
    const rows = [];
    list.forEach(item => {
        const row = document.createElement("div");
        row.className = "accordionItem";
        row.textContent = item.name;
        item.node = row;
        
row.onclick = function () {

    document
        .querySelectorAll(".accordionItem.selected")
        .forEach(x => x.classList.remove("selected"));

    row.classList.add("selected");

    selectedItem = item;

    foundCells = findCellsByObject(item);
    currentFoundIndex = 0;

    const ids = foundCells.map(c => c.id);

    highlight.setCells(ids);

    renderMap.draw();

    showInfo(item);

    if (followCheckbox.checked && foundCells.length > 0) {

        navigation.gotoCell(
            foundCells[0].id
        );

    }

};

        rows.push({
            node: row,
            text: item.name.toLowerCase()
        });
        body.appendChild(row);
    });

    search.addEventListener("input", function () {
        const value = search.value.trim().toLowerCase();
        rows.forEach(r => {
            if (value === "" || r.text.includes(value))
                r.node.style.display = "";
            else
                r.node.style.display = "none";
        });
    });
    
header.onclick = function () {
    const alreadyOpen = body.style.display === "block";

    Object.keys(sections).forEach(k => {
        sections[k].body.style.display = "none";
        sections[k].header.textContent =
            "▶ " + sections[k].title;
    });

    if (alreadyOpen) {
        search.value = "";
        rows.forEach(r => r.node.style.display = "");

        if (currentInfoBlock) {
            currentInfoBlock.remove();
            currentInfoBlock = null;
        }
    } else {
        body.style.display = "block";
        header.textContent = "▼ " + title;
    }
};
    
    wrapper.appendChild(header);
    wrapper.appendChild(body);
    sections[key] = {
        title,
        header,
        body
    };
    panel.appendChild(wrapper);
}

//function findSelectedItem() {
//    if (!selectedItem)
//        return;
//    const cells = [];
//    mapData.forEach(cell => {
//        (cell.objects || []).forEach(obj => {
//            if (obj.id === selectedItem.id)
//                cells.push(cell);
//        });
//    });
//    if (!cells.length)
//        return;
//    highlight.clear();
//    cells.forEach(c => highlight.add(c.id));
//    renderMap.refreshSelection();
//    if (followCheckbox.checked) {
//        cells.sort((a, b) => a.id - b.id);
//        navigation.gotoCell(cells[0].id);
//    }
//}

function showInfo(item) {

    if (currentInfoBlock)
        currentInfoBlock.remove();


    const info = document.createElement("div");
    info.className = "accordionInfo";


    if (!followCheckbox.checked) {

        info.innerHTML =
            `<div>Найдено: ${foundCells.length}</div>`;

    }
    else {

        info.innerHTML = `
            <button class="findPrev">◀</button>
            <span class="findCounter">
                ${currentFoundIndex + 1} / ${foundCells.length}
            </span>
            <button class="findNext">▶</button>
        `;


        info.querySelector(".findPrev")
            .onclick = function () {

                if (foundCells.length === 0)
                    return;

                currentFoundIndex--;

                if (currentFoundIndex < 0)
                    currentFoundIndex = foundCells.length - 1;

                navigation.gotoCell(
                    foundCells[currentFoundIndex].id
                );

                updateInfoCounter();

            };


        info.querySelector(".findNext")
            .onclick = function () {

                if (foundCells.length === 0)
                    return;

                currentFoundIndex++;

                if (currentFoundIndex >= foundCells.length)
                    currentFoundIndex = 0;

                navigation.gotoCell(
                    foundCells[currentFoundIndex].id
                );

                updateInfoCounter();

            };

    }


    item.node.after(info);

    currentInfoBlock = info;

}

    function updateInfoCounter() {

    if (!currentInfoBlock)
        return;

    const counter =
        currentInfoBlock.querySelector(".findCounter");

    if (!counter)
        return;

    counter.textContent =
        `${currentFoundIndex + 1} / ${foundCells.length}`;

    }
    
    return {
        init: init
    };

})();
