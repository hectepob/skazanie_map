const navigation = (function () {

    let data;
    let byId;

    let mapContainer;
    let mapViewport;

    let render;
    let topPanel;

    let getCurrentFloor;
    let setCurrentFloor;

    let getSelectedCellId;
    let setSelectedCellId;

    let minFloor;
    let maxFloor;

    let offset;

    function init(cfg) {

        data = cfg.data;
        byId = cfg.byId;

        mapContainer = cfg.mapContainer;
        mapViewport = cfg.mapViewport;

        render = cfg.render;
        topPanel = cfg.topPanel;

        getCurrentFloor = cfg.getCurrentFloor;
        setCurrentFloor = cfg.setCurrentFloor;

        getSelectedCellId = cfg.getSelectedCellId;
        setSelectedCellId = cfg.setSelectedCellId;

        minFloor = cfg.minFloor;
        maxFloor = cfg.maxFloor;

        offset = cfg.offset;

    }

    function getCurrentCell() {

        return byId.get(getSelectedCellId());

    }

function centerOnCell(cell) {

    const x = (cell.col - 1) * 40;
    const y = (cell.row - 1) * 40;

    offset.x = mapViewport.clientWidth / 2 - x - 20;
    offset.y = mapViewport.clientHeight / 2 - y - 20;

    mapContainer.style.transform =
        `translate(${offset.x}px, ${offset.y}px)`;

}

function gotoCell(id) {

    setSelectedCellId(Number(id));

    const cell = byId.get(Number(id));

    if (!cell)
        return;

    topPanel.selectCell(cell);

    setCurrentFloor(cell.floor);

    render();

    centerOnCell(cell);

}

    function changeFloor(step) {

        const base = getCurrentCell();

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

setCurrentFloor(newFloor);

if (target) {

    gotoCell(target.id);
    return;

}

render();

centerOnCell(base);

    }

    return {

        init,
        gotoCell,
        changeFloor

    };

})();
