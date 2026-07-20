console.log("portalMenu.js 2007 0630 ");

const portalMenu = (function () {

    let byId;
    let links;
    let map;
    let menu;

    function init(cfg) {

        byId = cfg.byId;
        links = cfg.links;
        map = cfg.map;

        menu = document.createElement("div");
        menu.id = "portalMenu";
        menu.className = "portalMenu";

        menu.style.display = "none";

        map.appendChild(menu);

    }

    function hasPortal(id) {

        return links.some(x => x.id_portal === id);

    }

    function getTargets(id) {

        const rec = links.find(x => x.id_portal === id);

        return rec ? rec.targets : [];

    }

    function show(cell) {

        hide();

        const targets = getTargets(cell.id);

        if (!targets.length)
            return;

        menu.innerHTML = "";

        targets.forEach(id => {

            const target = byId.get(id);

            if (!target)
                return;

            const item = document.createElement("div");

            item.className = "portalItem";

            item.textContent =
                `${target.area} — ${target.subarea}`;

            item.onclick = e => {

                e.stopPropagation();

                hide();

                navigation.gotoCell(id);

            };

            menu.appendChild(item);

        });

        menu.style.left =
            ((cell.col - 1) * 40 + 26) + "px";

        menu.style.top =
            ((cell.row - 1) * 40 + 4) + "px";

        menu.style.display = "block";

    }

    function hide() {

        menu.style.display = "none";

        menu.innerHTML = "";

    }

    return {

        init,
        hasPortal,
        getTargets,
        show,
        hide

    };

})();
