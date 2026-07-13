const drag = (function () {

    let viewport;
    let container;
    let offset;

    let dragging = false;

    let dragStartX = 0;
    let dragStartY = 0;

    let moved = false;
    
    let scale = 1;

    let pinchStartDistance = 0;
    let pinchStartScale = 1;
    
    let pointers = new Map();

    function init(cfg) {

        viewport = cfg.viewport;
        container = cfg.container;
        offset = cfg.offset;

        viewport.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);

    }

    function distance(p1, p2) {

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return Math.hypot(dx, dy);

    }

    function onDown(e) {

        if (e.button !== undefined && e.button !== 0)
            return;

        dragging = true;
        moved = false;

        pointers.set(e.pointerId, {
            x: e.clientX,
            y: e.clientY
        });

if (pointers.size === 2) {

    const pts = [...pointers.values()];

    pinchStartDistance = distance(pts[0], pts[1]);
    pinchStartScale = scale;

    dragging = false;
    return;

}
        
        dragStartX = e.clientX - offset.x;
        dragStartY = e.clientY - offset.y;

        viewport.setPointerCapture(e.pointerId);

    }

    function onMove(e) {

        if (pointers.has(e.pointerId)) {
           pointers.get(e.pointerId).x = e.clientX;
           pointers.get(e.pointerId).y = e.clientY;
        }

if (pointers.size === 2) {

    const pts = [...pointers.values()];
    const d = distance(pts[0], pts[1]);

    scale = pinchStartScale * (d / pinchStartDistance);
    scale = Math.max(0.5, Math.min(scale, 3));

    container.style.transform =
        `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;

    return;

}
        
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
           `translate(${offset.x}px, ${offset.y}px) scale(${scale})`;

    }

function onUp(e) {

    pointers.delete(e.pointerId);

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
