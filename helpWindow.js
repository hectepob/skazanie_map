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
        `;

        document.body.appendChild(root);
        body = document.getElementById("helpBody");
        document.getElementById("helpClose").onclick = hide;
        loadHelp();
    }

    async function loadHelp() {
        const html = await fetch("help.html").then(r => r.text());
        body.innerHTML = html;
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
