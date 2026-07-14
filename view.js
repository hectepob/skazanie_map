console.log("view.js v1");

const view = (function () {

    let container;
    let offset;
    let scale;

    function init(cfg) {

        container = cfg.container;
        offset = cfg.offset;
        scale = cfg.scale;

    }

    function apply() {

        container.style.transform =
            `translate(${offset.x}px, ${offset.y}px) scale(${scale.value})`;

    }

    return {

        init,
        apply

    };

})();
