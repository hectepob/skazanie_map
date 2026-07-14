const dragTouch = (function () {

    let viewport;
    let container;
    let offset;
    let scale;

    let dragging = false;
    let moved = false;

    let dragStartX = 0;
    let dragStartY = 0;

    let pointerId = null;
    let pointers = new Map();

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

    if (e.pointerType !== "touch")
        return;

    pointers.set(e.pointerId, {
    x: e.clientX,
    y: e.clientY
    });

    if (pointers.size === 2) {

    dragging = false;
    moved = true;
    return;

    }

    if (pointerId !== null)
        return;

    pointerId = e.pointerId;

    dragging = true;
    moved = false;

    dragStartX = e.clientX - offset.x;
    dragStartY = e.clientY - offset.y;

    viewport.setPointerCapture(e.pointerId);

}

function onMove(e) {

    if (pointers.has(e.pointerId)) {
    pointers.get(e.pointerId).x = e.clientX;
    pointers.get(e.pointerId).y = e.clientY;
    }

    if (pointers.size === 2)
    return;

    if (!dragging)
        return;

    if (e.pointerId !== pointerId)
        return;

    const newX = e.clientX - dragStartX;
    const newY = e.clientY - dragStartY;

    if (
        Math.abs(newX - offset.x) > 5 ||
        Math.abs(newY - offset.y) > 5
    ) {

        moved = true;

    }

    offset.x = newX;
    offset.y = newY;

    updateTransform();

}

function onUp(e) {

    pointers.delete(e.pointerId);

    if (e.pointerId !== pointerId)
        return;

    dragging = false;
    pointerId = null;

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
