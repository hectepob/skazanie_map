console.log("view.js 15-07 2130 ");//КОНСОЛЬ

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
    "scale =", scale.value,
    "transform =",
    `scale(${scale.value}) translate(${offset.x}px, ${offset.y}px)`
);

container.style.transform =
    `scale(${scale.value})
     translate(${offset.x}px, ${offset.y}px)`;

    }

    return {
        init,
        apply
    };
})();
