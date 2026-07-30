const helpWindow = (function () {

    let root;

    function init() {
        root = document.createElement("div");
        root.id = "helpWindow";
        root.style.display = "none";

        root.innerHTML = `
            <div class="helpHeader">
                <span>Справка</span>
                <button id="helpClose">✕</button>
            </div>

            <div class="helpBody">
                Здесь позже будет текст справки.
            </div>
        `;

        document.body.appendChild(root);

        document.getElementById("helpClose").onclick = hide;
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
