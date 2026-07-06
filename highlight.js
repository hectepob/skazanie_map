const highlight = (function () {

    let byId;
    let highlightCells;
    let render;

    function init(obj) {

        byId = obj.byId;
        highlightCells = obj.highlightCells;
        render = obj.render;

    }

    function setCells(ids) {

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

        renderMap.draw();

    }

    function clear() {

        highlightCells.clear();
        renderMap.draw();

    }

    return {

        init,
        setCells,
        clear

    };

})();