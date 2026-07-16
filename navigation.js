console.log("navigation.js 1607 0715 ");

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

    let getMinFloor;
    let getMaxFloor;

    let offset;
    let scale;

    let clearHighlight;

    let tooltip;

    function init(cfg) {

        data = cfg.data;
        byId = cfg.byId;

        mapContainer = cfg.mapContainer;
        mapViewport = cfg.mapViewport;

        render = cfg.render;
        topPanel = cfg.topPanel;
        scale = cfg.scale;
        tooltip = cfg.tooltip;

        getCurrentFloor = cfg.getCurrentFloor;
        setCurrentFloor = cfg.setCurrentFloor;

        getSelectedCellId = cfg.getSelectedCellId;
        setSelectedCellId = cfg.setSelectedCellId;

        getMinFloor = cfg.getMinFloor;
        getMaxFloor = cfg.getMaxFloor;

        offset = cfg.offset;
        clearHighlight = cfg.clearHighlight;

    }
    
function centerOnCell(cell) {

    setCurrentFloor(cell.floor);

    render();

    const x = (cell.col - 1) * CELL_SIZE;
    const y = (cell.row - 1) * CELL_SIZE;

    console.log(
        "EXPECTED",
        x,
        y
    );

    const el = mapContainer.querySelector(".cell.selected");

    if (el) {
        const r = el.getBoundingClientRect();
        const vr = mapViewport.getBoundingClientRect();

        console.log(
            "REAL CELL",
            r.left - vr.left,
            r.top - vr.top
        );
    }

offset.x = (mapViewport.clientWidth / 2) / scale.value - x - HALF_CELL;
offset.y = (mapViewport.clientHeight / 2) / scale.value - y - HALF_CELL;

view.apply();

requestAnimationFrame(() => {

    const grid = mapContainer.getBoundingClientRect();

    console.log(
        "GRID",
        "left =", grid.left,
        "top =", grid.top,
        "expected =", mapViewport.getBoundingClientRect().left + mapViewport.clientWidth / 2,
        mapViewport.getBoundingClientRect().top + mapViewport.clientHeight / 2
    );

});

    function keepView(id) {

        const cell = byId.get(id);

        if (!cell)
            return;

       const x = offset.x;
       const y = offset.y;

       setCurrentFloor(cell.floor);
       setSelectedCellId(cell.id);

       render();

       offset.x = x;
       offset.y = y;

       view.apply();

       topPanel.selectCell(cell);

    }

    function findCellOnFloor(base, floor) {

    return data.find(cell =>
        cell.col === base.col &&
        cell.row === base.row &&
        cell.floor === floor
    );

    }

function gotoCell(id, center = true) {

    tooltip.hide();

    setSelectedCellId(Number(id));

    const cell = byId.get(Number(id));

    if (!cell)
        return;

    topPanel.selectCell(cell);

    if (center)
        centerOnCell(cell);
    else
        keepView(cell.id);

}

function changeFloor(step) {

    const newFloor = getCurrentFloor() + step;

    if (newFloor < getMinFloor() || newFloor > getMaxFloor())
        return;
    
    tooltip.hide();

    setCurrentFloor(newFloor); 
    setSelectedCellId(0);
    clearHighlight();

    topPanel.clearSelection();

    render();
    console.log("render done");//КОНСОЛЬ 

}

return {

    init,
    gotoCell,
    changeFloor,
    centerOnCell,
    keepView

};

})();
