console.log("portalMenu.js 1907 1935");

const portalMenu = (function () {

    let byId;
    let portalMap;

    function init(cfg) {

        byId = cfg.byId;
        portalMap = new Map();

        cfg.links.forEach(link => {

            portalMap.set(link.id_portal, link.targets);

        });

    }

    function hasPortal(id) {

        return portalMap.has(id);

    }

    function getTargets(id) {

        return portalMap.get(id) || [];

    }

    return {

        init,
        hasPortal,
        getTargets

    };

})();
