const drag = (function () {

    console.log("drag.js VERSION 2");

    let viewport;
    let container;
    let offset;

    let dragging = false;

    let dragStartX = 0;
    let dragStartY = 0;

    let moved = false;
    
    let scale;

    let pinchStartDistance = 0;
    let pinchStartScale = 1;
    
    let pointers = new Map();

    function init(cfg) {

        viewport = cfg.viewport;
        container = cfg.container;
        offset = cfg.offset;
        scale = cfg.scale;

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

    pointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY
    });

    if (pointers.size === 2) {

        const pts = [...pointers.values()];

        pinchStartDistance = distance(pts[0], pts[1]);
        pinchStartScale = scale.value;

        dragging = false;

        return;

    }

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

    if (pointers.size === 2) {

        const pts = [...pointers.values()];

        const centerX = (pts[0].x + pts[1].x) / 2;
        const centerY = (pts[0].y + pts[1].y) / 2;

        const worldX = (centerX - offset.x) / scale.value;
        const worldY = (centerY - offset.y) / scale.value;

        const d = distance(pts[0], pts[1]);

        let newScale = pinchStartScale * (d / pinchStartDistance);

        newScale = Math.max(0.5, Math.min(newScale, 3));

        offset.x = centerX - worldX * newScale;
        offset.y = centerY - worldY * newScale;

        scale.value = newScale;

        container.style.transform =
            `translate(${offset.x}px, ${offset.y}px) scale(${scale.value})`;

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
        `translate(${offset.x}px, ${offset.y}px) scale(${scale.value})`;

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
