const drag = (function () {

    let viewport;
    let container;
    let offset;

    let dragging = false;

    let dragStartX = 0;
    let dragStartY = 0;

    let moved = false;

    function init(cfg) {

        viewport = cfg.viewport;
        container = cfg.container;
        offset = cfg.offset;

        viewport.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);

    }

    function onDown(e) {

        if (e.button !== undefined && e.button !== 0)
            return;

        dragging = true;
        moved = false;

        dragStartX = e.clientX - offset.x;
        dragStartY = e.clientY - offset.y;

        viewport.setPointerCapture(e.pointerId);

    }

    function onMove(e) {

        if (!dragging)
            return;

        if (
            Math.abs(e.clientX - dragStartX - offset.x) > 5 ||
            Math.abs(e.clientY - dragStartY - offset.y) > 5
        ) {

            moved = true;

        }

        offset.x = e.clientX - dragStartX;
        offset.y = e.clientY - dragStartY;

        container.style.transform =
            `translate(${offset.x}px, ${offset.y}px)`;

    }

function onUp(e) {

    dragging = false;

    if (viewport.hasPointerCapture(e.pointerId))
        viewport.releasePointerCapture(e.pointerId);

}

    return {

        init,

        moved() {

            return moved;

        }

    };

})();
