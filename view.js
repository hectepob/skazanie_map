console.log("view.js 15-07 1328");//КОНСОЛЬ

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

        console.log(
    "VIEW",
    "offset =", offset.x, offset.y,
    "scale =", scale.value
        );

container.style.transform =
    `translate(${offset.x}px, ${offset.y}px)
     scale(${scale.value})`;

    }

    return {
        init,
        apply
    };
})();
