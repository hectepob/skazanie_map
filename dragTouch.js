const dragTouch = (function () {

    let viewport;
    let container;
    let offset;
    let scale;

    let dragging = false;
    let moved = false;

    let dragStartX = 0;
    let dragStartY = 0;

    function init(cfg) {

        viewport = cfg.viewport;
        container = cfg.container;
        offset = cfg.offset;
        scale = cfg.scale;

        viewport.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

    }

    function updateTransform() {

        container.style.transform =
            `translate(${offset.x}px, ${offset.y}px) scale(${scale.value})`;

    }

    function onDown(e) {

    }

    function onMove(e) {

    }

    function onUp(e) {

    }

    return {

        init,

        moved() {

            return moved;

        }

    };

})();
