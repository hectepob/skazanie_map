console.log("dragDesktop.js 2007 1155");

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
        moved = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startOffsetX = offset.x;
        startOffsetY = offset.y;
        viewport.setPointerCapture(e.pointerId);
    }

    function onMove(e) {
        if (!dragging)
            return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            moved = true;
        }
        offset.x = startOffsetX + dx;
        offset.y = startOffsetY + dy;
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
            if (!dragging)
                return;
            dragging = false;
            if (viewport.hasPointerCapture(e.pointerId))
                viewport.releasePointerCapture(e.pointerId);
            setTimeout(() => {
                moved = false;
            }, 0);
        }

    return {
        init,
        moved() {
            return moved;
        }
    };

})();
