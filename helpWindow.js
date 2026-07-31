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
        try {
            const html = await fetch("help.html").then(r => r.text());
            body.innerHTML = html;
        } catch (e) {
            body.innerHTML = "Не удалось загрузить справку.";
        }
    }

    function show() {
        root.style.display = "block";
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
