console.log("view.js 1607 0020 ");//КОНСОЛЬ

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
            `translate(${offset.x}px, ${offset.y}px)
             scale(${scale.value})`;
    }

    return {
        init,
        apply
    };
})();
