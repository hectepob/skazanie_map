console.log("portalMenu.js 2107 1045 ");

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

        menu.addEventListener("click", function (e) {
            const item = e.target.closest(".portalItem");
            if (!item)
                 return;
            e.stopPropagation();
            const id = Number(item.dataset.targetId);
            hide();
            navigation.gotoCell(id);
        });

        document.addEventListener("click", function (e) {
        if (menu.style.display === "none")
            return;

        // если кликнули по самому меню — ничего не делаем
        if (menu.contains(e.target))
            return;

        // если кликнули по значку портала — тоже ничего
        if (e.target.closest(".portal"))
            return;

        hide();
        });

    }

    function hasPortal(id) {
        return links.some(x => x.id_portal === id);
    }

    function getTargets(id) {
        const rec = links.find(x => x.id_portal === id);
        return rec ? rec.targets : [];
    }

    function show(cell, anchor) {
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
            item.textContent = `${target.area} — ${target.subarea}`;
            item.dataset.targetId = id;
            menu.appendChild(item);
        });
        const mapRect = map.getBoundingClientRect();
        const anchorRect = anchor.getBoundingClientRect();
        menu.style.display = "block";
        const h = menu.offsetHeight;

// координата значка внутри карты
        const anchorY = anchorRect.top - mapRect.top + anchorRect.height / 2;

// центрируем меню относительно значка
        let top = anchorY - h / 2;

// не даём уйти выше карты
        top = Math.max(4, top);

// не даём уйти ниже карты
        top = Math.min(
            top,
            map.clientHeight - h - 4
        );

        menu.style.left = (anchorRect.right - mapRect.left + 6) + "px";
        menu.style.top = top + "px";
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
