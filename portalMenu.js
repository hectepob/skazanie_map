console.log("portalMenu.js 2007 1320 ");

const portalMenu = (function () {

    const instanceId = Math.random().toString(36).slice(2); //ПРОВЕРКА
    console.log("PORTAL INSTANCE", instanceId); //ПРОВЕРКА

    let byId;
    let links;
    let map;
    let menu;

    function init(cfg) {

        console.log("INIT", instanceId);
        console.log(cfg);
        console.log(cfg.map);
        
        byId = cfg.byId;
        links = cfg.links;
        map = cfg.map;
        menu = document.createElement("div");
        menu.id = "portalMenu";
        menu.className = "portalMenu";
        menu.style.display = "none";
        map.appendChild(menu);
        
        console.log("MENU CREATED", menu);
        console.log(document.getElementById("portalMenu"));

    }

    function hasPortal(id) {
        return links.some(x => x.id_portal === id);
    }

    function getTargets(id) {
        const rec = links.find(x => x.id_portal === id);
        return rec ? rec.targets : [];
    }

    function show(cell) {
        console.log("SHOW", instanceId, cell.id);
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
            item.onclick = e => {
                e.stopPropagation();
                hide();
                navigation.gotoCell(id);
            };
            menu.appendChild(item);
        });
        menu.style.left = ((cell.col - 1) * 40 + 26) + "px";
        menu.style.top = ((cell.row - 1) * 40 + 4) + "px";
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
