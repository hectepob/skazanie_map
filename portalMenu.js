console.log("portalMenu.js 2007 0010");

const portalMenu = (function () {

    let byId;
    let links;
    let menu;

    function init(cfg) {
        byId = cfg.byId;
        links = cfg.links;
        menu = document.getElementById("portalMenu");
    }

    function hasPortal(id) {
        return links.some(x => x.id_portal === id);
    }

    function getTargets(id) {

        const rec = links.find(x => x.id_portal === id);

        return rec ? rec.targets : [];

    }

    function show(idPortal, x, y) {

        hide();

        const targets = getTargets(idPortal);

        if (!targets.length)
            return;

        const menu = document.createElement("div");

        menu.id = "portalMenu";
        menu.className = "portalMenu";

        targets.forEach(id => {

            const cell = byId.get(id);

            if (!cell)
                return;

            const item = document.createElement("div");

            item.className = "portalItem";
            item.textContent = `${cell.area} — ${cell.subarea}`;

            item.onclick = function (e) {

                e.stopPropagation();

                hide();

                navigation.gotoCell(id);

            };

            menu.appendChild(item);

        });

        menu.style.left = x + "px";
        menu.style.top = y + "px";

        document.body.appendChild(menu);

    }

    function hide() {

        const old = document.getElementById("portalMenu");

        if (old)
            old.remove();

    }

    return {
        init,
        hasPortal,
        getTargets,
        show,
        hide
    };

})();
