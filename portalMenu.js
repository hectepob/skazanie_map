console.log("portalMenu.js 1907 1915");

const portalMenu = (function () {

    let byId;
    let links = [];

    function init(cfg) {

        byId = cfg.byId;
        links = cfg.links;

    }

    function getTargets(portalId) {

        const rec = links.find(x => x.id_portal === portalId);

        if (!rec)
            return [];

        return rec.targets
            .map(id => byId.get(id))
            .filter(Boolean);

    }

    return {

        init,
        getTargets

    };

})();
