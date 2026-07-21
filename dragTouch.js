console.log("dragTouch.js 2107 0700 ");
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
    let pinchStartDistance = 0;
    let pinchStartScale = 1;
    let pinchCenterX = 0;
    let pinchCenterY = 0;
    let worldCenterX = 0;
    let worldCenterY = 0;
    let tooltip;

    function init(cfg) {

        viewport = cfg.viewport;
        container = cfg.container;
        offset = cfg.offset;
        scale = cfg.scale;
        tooltip = cfg.tooltip;

        viewport.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

    }

    function updateTransform() {
        view.apply()
    }

    function distance(p1, p2) {
    return Math.hypot(
        p2.x - p1.x,
        p2.y - p1.y
    );
    }

function onDown(e) {

    if (e.pointerType !== "touch")
        return;

    pointers.set(e.pointerId, {
    x: e.clientX,
    y: e.clientY
    });

if (pointers.size === 2) {
    const pts = [...pointers.values()];
    const rect = viewport.getBoundingClientRect();
    pinchCenterX = (pts[0].x + pts[1].x) / 2 - rect.left;
    pinchCenterY = (pts[0].y + pts[1].y) / 2 - rect.top;
    pinchStartDistance = distance(pts[0], pts[1]);
    pinchStartScale = scale.value;
    worldCenterX = (pinchCenterX - offset.x) / scale.value;
    worldCenterY = (pinchCenterY - offset.y) / scale.value;
    dragging = false;
    pointerId = null;
    moved = true;
    return;
}
    
    if (pointerId !== null)
        return;

    pointerId = e.pointerId;
    dragging = true;
    tooltip.hide();
    portalMenu.hide();
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
    const d = distance(pts[0], pts[1]);
    let newScale = pinchStartScale * (d / pinchStartDistance);
    newScale = Math.max(0.5, Math.min(newScale, 2));
    scale.value = newScale;

offset.x = pinchCenterX - worldCenterX * scale.value;
offset.y = pinchCenterY - worldCenterY * scale.value;

updateTransform();
topPanelModule.setZoom(scale.value);
portalMenu.hide();

    return;
}

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
    topPanelModule.setZoom(scale.value);//СЮДА ИЛИ ВЫШЕ - ПОЗЖЕ ГЛЯНУТЬ

}

function onUp(e) {

    pointers.delete(e.pointerId);

    if (pointerId !== null && e.pointerId !== pointerId)
        return;

    dragging = false;
    pointerId = null;

    if (viewport.hasPointerCapture(e.pointerId))
        viewport.releasePointerCapture(e.pointerId);

    if (pointers.size < 2) {
    pinchCenterX = 0;
    pinchCenterY = 0;
    worldCenterX = 0;
    worldCenterY = 0;
}

}

    return {
        init,
        moved() {
            return moved;
        }
    };

})();
