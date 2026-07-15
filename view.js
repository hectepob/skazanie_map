console.log("view.js 15-07 2015 ");//КОНСОЛЬ

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

console.trace("VIEW APPLY");

container.style.transform =
    `scale(${scale.value})
     translate(${offset.x}px, ${offset.y}px)`;

    }

    return {
        init,
        apply
    };
})();
