console.log("navigation.js 2207 1735 ");

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
    let getCurrentMap;
    let setCurrentMap;
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
        getCurrentMap = cfg.getCurrentMap;
        setCurrentMap = cfg.setCurrentMap;
        getSelectedCellId = cfg.getSelectedCellId;
        setSelectedCellId = cfg.setSelectedCellId;
        getMinFloor = cfg.getMinFloor;
        getMaxFloor = cfg.getMaxFloor;
        offset = cfg.offset;
        clearHighlight = cfg.clearHighlight;
    }
    
function centerOnCell(cell) {
    setCurrentFloor(cell.floor);
    setCurrentMap(cell.id_map);
    render();
    const x = (cell.col - 1) * CELL_SIZE;
    const y = (cell.row - 1) * CELL_SIZE;
    offset.x = mapViewport.clientWidth / 2 - (x + HALF_CELL) * scale.value;
    offset.y = mapViewport.clientHeight / 2 - (y + HALF_CELL) * scale.value;
    view.apply();
}
    
    function keepView(id) {
        console.log("KEEPVIEW", id);
        const cell = byId.get(id);
        if (!cell)
            return;
        tooltip.hide();
        const x = offset.x;
        const y = offset.y;
        setCurrentMap(cell.id_map);
        setCurrentFloor(cell.floor);
        setSelectedCellId(cell.id);
       render();
       offset.x = x;
       offset.y = y;
       view.apply();
       topPanel.selectCell(cell);
       tooltip.show([cell]);
        console.log("SEARCH SELECTED");
       const el = mapContainer.querySelector(".cell.selected");
       if (el) {
            const r = el.getBoundingClientRect();
            const vr = mapViewport.getBoundingClientRect();
            tooltip.move(
                r.right - vr.left + 8,
                r.top - vr.top
            );
        }
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
}

//function changeZoom(newScale) {
//    const rect = mapViewport.getBoundingClientRect();
//    const cx = rect.width / 2;
//    const cy = rect.height / 2;
//    const oldScale = scale.value;
//    newScale = Math.max(0.5, Math.min(2, newScale));
//    if (newScale === oldScale)
//        return;
//    const worldX = (cx - offset.x) / oldScale;
//    const worldY = (cy - offset.y) / oldScale;
//    scale.value = newScale;
//    offset.x = cx - worldX * newScale;
//    offset.y = cy - worldY * newScale;
//    view.apply();
//    topPanelModule.setZoom(scale.value);
//}

function setZoom(value) {
    const rect = mapViewport.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const oldScale = scale.value;
    let newScale = Math.max(0.5, Math.min(2, value));
    if (newScale === oldScale)
        return;
    const worldX = (cx - offset.x) / oldScale;
    const worldY = (cy - offset.y) / oldScale;
    scale.value = newScale;
    offset.x = cx - worldX * newScale;
    offset.y = cy - worldY * newScale;
    view.apply();
    topPanelModule.setZoom(scale.value);
}
    
return {
    init,
    gotoCell,
    changeFloor,
    centerOnCell,
    keepView,
    setZoom
};

})();
