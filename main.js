window.changeFloor = function(step) {

    const base = byId.get(selectedCellId);

    if (!base)
        return;

    const newFloor = base.floor + step;

    if (newFloor < minFloor || newFloor > maxFloor)
        return;

    const target = data.find(c =>
        c.col === base.col &&
        c.row === base.row &&
        c.floor === newFloor
    );

    // всегда обновляем текущий этаж
    currentFloor = newFloor;

    // если есть клетка — переходим через gotoCell (единая логика)
    if (target) {
        gotoCell(target.id);
        return;
    }

    // если клетки нет — просто показать пустую позицию
    render();

    const x = (base.col - 1) * 40;
    const y = (base.row - 1) * 40;

    offsetX = mapViewport.clientWidth / 2 - x - 20;
    offsetY = mapViewport.clientHeight / 2 - y - 20;

    mapContainer.style.transform =
        `translate(${offsetX}px, ${offsetY}px)`;
};
