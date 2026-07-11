const navigation = (function () {

    const CELL_SIZE = 40;
    const HALF_CELL = CELL_SIZE / 2;
    
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

    let clearHighlight;

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
        clearHighlight = cfg.clearHighlight;

    }

function centerOnCell(cell) {

const x = (cell.col - 1) * CELL_SIZE;
const y = (cell.row - 1) * CELL_SIZE;

offset.x = mapViewport.clientWidth / 2 - x - HALF_CELL;
offset.y = mapViewport.clientHeight / 2 - y - HALF_CELL;

    mapContainer.style.transform =
        `translate(${offset.x}px, ${offset.y}px)`;

}

    function findCellOnFloor(base, floor) {

    return data.find(cell =>
        cell.col === base.col &&
        cell.row === base.row &&
        cell.floor === floor
    );

    }

function gotoCell(id, center = true) {

    setSelectedCellId(Number(id));

    const cell = byId.get(Number(id));

    if (!cell)
        return;

    topPanel.selectCell(cell);

    setCurrentFloor(cell.floor);

render();

if (center)
    centerOnCell(cell);

}

function changeFloor(step) {

    const newFloor = getCurrentFloor() + step;

    if (newFloor < minFloor || newFloor > maxFloor)
        return;

    setCurrentFloor(newFloor);

    setSelectedCellId(0);

    clearHighlight();

    topPanel.clearSelection();

    render();

}

    return {

        init,
        gotoCell,
        changeFloor

    };

})();
