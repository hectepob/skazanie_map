console.log("dragDesktop.js 2007 1200");

    const dragDesktop = (function () {

    let viewport;
    let container;
    let offset;
    let scale;
    let dragging = false;
    let moved = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;

    function init(cfg) {

        viewport = cfg.viewport;
        container = cfg.container;
        offset = cfg.offset;
        scale = cfg.scale;

        viewport.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        viewport.addEventListener("wheel", onWheel, {
            passive: false
        });

    }

    function updateTransform() {
        view.apply()
    }

function onDown(e) {
    if (e.pointerType !== "mouse")
        return;
    if (e.button !== 0)
        return;
    dragging = true;

    // каждый новый клик начинается как "не drag"
    moved = false;
    dragStartX = e.clientX / scale.value - offset.x;
    dragStartY = e.clientY / scale.value - offset.y;
    //viewport.setPointerCapture(e.pointerId);
}

function onMove(e) {
    if (!dragging)
        return;
    const newX = e.clientX / scale.value - dragStartX;
    const newY = e.clientY / scale.value - dragStartY;
    if (!moved) {
        const dx = newX - offset.x;
        const dy = newY - offset.y;
        if (Math.hypot(dx, dy) > 5)
            moved = true;
    }
    offset.x = newX;
    offset.y = newY;
    updateTransform();
    portalMenu.hide();
}

function onUp(e) {
    if (!dragging)
        return;
    dragging = false;
    if (viewport.hasPointerCapture(e.pointerId))
        //viewport.releasePointerCapture(e.pointerId);
    // после завершения drag снова разрешаем обычный клик
    setTimeout(() => {
        moved = false;
    }, 0);
}

function onWheel(e) {
    e.preventDefault();
    portalMenu.hide();
    tooltip.hide();
    const oldScale = scale.value;
    let newScale =
        oldScale * (e.deltaY < 0 ? 1.1 : 0.9);
    newScale = Math.max(
        0.5,
        Math.min(3, newScale)
    );
    if (newScale === oldScale)
        return;
    const rect = viewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX =
        (mouseX - offset.x) / oldScale;
    const worldY =
        (mouseY - offset.y) / oldScale;
    scale.value = newScale;
    offset.x =
        mouseX - worldX * newScale;
    offset.y =
        mouseY - worldY * newScale;
    updateTransform();
    topPanelModule.setZoom(scale.value);
}

    return {
        init,
        moved() {
            return moved;
        }
    };

})();
