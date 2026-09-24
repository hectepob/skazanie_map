const helpWindow = (function () {

    let root;
    let body;

function init(mapData) {
    root = document.createElement("div");
    root.id = "helpWindow";
    root.style.display = "none";

    root.innerHTML = `
        <div class="helpHeader">
            <span>Справка</span>
            <button id="helpClose">✕</button>
        </div>
        <div class="helpBody" id="helpBody">
            Загрузка...
        </div>
    `;

    document.body.appendChild(root);
    body = document.getElementById("helpBody");
    document.getElementById("helpClose").onclick = hide;

    loadHelp(mapData);
}

async function loadHelp(mapData) {
    const html = await fetch("help.html").then(r => r.text());
    const maxId = Math.max(...mapData.map(cell => cell.id));
    const uniqueCount = mapData.length;
    const nonEmptyCount = mapData.filter(
        cell => cell.objects.length > 0
    ).length;

    body.innerHTML = html
        .replace("{{MAX_ID}}", maxId)
        .replace("{{UNIQUE_COUNT}}", uniqueCount)
        .replace("{{NON_EMPTY_COUNT}}", nonEmptyCount);
}

    function show() {
        root.style.display = "flex";
    }

    function hide() {
        root.style.display = "none";
    }

    return {
        init,
        show,
        hide
    };

})();
