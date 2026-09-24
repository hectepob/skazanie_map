console.log('Текст для вывода');

const helpWindow = (function () {

    let root;
    let body;

    function init() {
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
        loadHelp();
    }

async function loadHelp() {
    const [html, mapText] = await Promise.all([
        fetch("help.html").then(r => r.text()),
        fetch("map.json").then(r => r.text())
    ]);

    const cells = mapText
        .trim()
        .split(/\r?\n/)
        .filter(Boolean)
        .map(line => JSON.parse(line.replace(/,\s*$/, "")));

    const maxId = Math.max(...cells.map(cell => cell.id));
    const uniqueCount = cells.length;

    const nonEmptyCount = cells.filter(
        cell => cell.objects && cell.objects.length > 0
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
