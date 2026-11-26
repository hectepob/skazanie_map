const highlight = (function () {

    let byId;
    let highlightCells;
    let render;

    function init(obj) {
        byId = obj.byId;
        highlightCells = obj.highlightCells;
        render = obj.render;
    }

    function setCells(ids, redraw = true) {
        highlightCells.clear();
        ids.forEach(id => {
            const cell = byId.get(Number(id));
            if (!cell)
                return;
            let root = cell;
            while (root.parent_id !== 0) {
                root = byId.get(root.parent_id);
                if (!root)
                    return;
            }
            highlightCells.add(root.id);
        });
        if (redraw)
            render();
    }

    function clear(redraw = true) {
        highlightCells.clear();
        if (redraw)
            render();
    }

    return {
        init,
        setCells,
        clear
    };

})();
