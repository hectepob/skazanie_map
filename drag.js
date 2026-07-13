const drag = (function () {

   // console.log("drag.js VERSION 3");//КОНСОЛЬ

    let viewport;
    let translateContainer;
    let scaleContainer;
    let offset;
   
    let scale;

    let dragging = false;
    let moved = false;

    let dragStartX = 0;
    let dragStartY = 0;

    let pointers = new Map();

    let pinchStartDistance = 0;
    let pinchStartScale = 1;

    function init(cfg) {

        viewport = cfg.viewport;
        translateContainer = cfg.translateContainer;
        scaleContainer = cfg.scaleContainer;
        offset = cfg.offset;
        scale = cfg.scale;

        viewport.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);

    }

    function updateTransform() {

        translateContainer.style.transform =
            `translate(${offset.x}px, ${offset.y}px)`;

        scaleContainer.style.transform =
            `scale(${scale.value})`;

    }

    function distance(p1, p2) {

        return Math.hypot(
            p2.x - p1.x,
            p2.y - p1.y
        );

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

        const rect = viewport.getBoundingClientRect();

        const centerX = (pts[0].x + pts[1].x) / 2 - rect.left;
        const centerY = (pts[0].y + pts[1].y) / 2 - rect.top;

        const d = distance(pts[0], pts[1]);

        const factor = d / pinchStartDistance;

        let newScale = pinchStartScale * factor;
        newScale = Math.max(0.5, Math.min(newScale, 3));

        const k = newScale / scale.value;

        offset.x = centerX - (centerX - offset.x) * k;
        offset.y = centerY - (centerY - offset.y) * k;

        scale.value = newScale;

        updateTransform();

        pinchStartDistance = d;
        pinchStartScale = scale.value;

        return;

    }

    if (!dragging)
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

    if (pointers.size < 2)
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
