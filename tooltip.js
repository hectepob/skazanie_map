const tooltip = (function () {

    const el = document.getElementById("tooltip");

    const order = {
        monster: 1,
        npc: 2,
        item: 3,
        comment: 4
    };

    function show(cells) {

        el.innerHTML = format(cells);
        el.style.display = "block";

    }

    function move(x, y) {

        el.style.left = x + "px";
        el.style.top = y + "px";

    }

    function hide() {

        el.style.display = "none";

    }

    function format(cells) {

        let html = [];

        cells.forEach((cell, index) => {

            const objects = (cell.objects || []).slice();

            if (objects.length === 0)
                return;

            objects.sort((a, b) =>
                (order[a.type] || 99) - (order[b.type] || 99)
            );

            if (cells.length > 1) {
                html.push(`<b class="tooltip-location">${cell.id}</b>`);
            }

            objects.forEach(obj => {

                let text = obj.name;

                switch (obj.type) {

                    case "monster":

                        if (obj.level)
                            text += ` (${obj.level})`;

                        if (obj.group)
                            text += " +";

                        html.push(`<b>${text}</b>`);

                        break;

                    case "comment":

                        html.push(`<i>${text}</i>`);

                        break;

                    default:

                        html.push(text);

                }

            });

            if (index < cells.length - 1) {
                html.push(`<hr class="tooltip-divider">`);
            }

        });

        return html.join("<br>");

    }

    return {

        show,
        move,
        hide

    };

})();