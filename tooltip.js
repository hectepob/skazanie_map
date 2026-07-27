console.log("tooltip.js 2607 1250 ");

const tooltip = (function () {

    const icons = {
        monster: "⚔",
        building: "🏠",
        npc: "👤",
        item: "📦",
        comment: "📝"
    };
    const el = document.getElementById("tooltip");
    let monsterMode = false;
    function setMonsterMode(value) {
        monsterMode = value;
    }
    const order = {
        monster: 1,
        building: 2,
        npc: 3,
        item: 4,
        comment: 5
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
switch (obj.type) {
    case "monster":
            let line = `${icons.monster} ${obj.name}`;
            if (obj.level)
                line += ` (${obj.level})`;
            if (obj.group)
                line += " +";        
        if (!monsterMode) {
            let line = `${icons.monster} ${obj.name}`;
            if (obj.level)
                line += ` (${obj.level})`;
            if (obj.group)
                line += " +";        
            html.push(`<b>${line}</b>`);
        } else {
            let title = `${icons.monster} ${obj.name}`;
            if (obj.level)
                line += ` (${obj.level})`;
            if (obj.group)
                line += " +";        
                html.push(`<div class="monsterTooltip">`);
                html.push(`<div class="monsterTooltipTitle"><b>${title}</b></div>`);
                html.push(`
                <table class="monsterTooltipTable">
                    <tr>
                        <td class="statName">Урон:</td>
                        <td colspan="3">ххх-ххх - ххх-ххх</td>
                    </tr>
                    <tr>
                        <td class="statName">Здоровье:</td>
                        <td>ххх</td>
                        <td class="statName">Броня:</td>
                        <td>ххх</td>
                    </tr>
                    <tr>
                        <td class="statName">Атака:</td>
                        <td>ххх</td>
                        <td class="statName">Защита:</td>
                        <td>ххх</td>
                    </tr>
                 </table>
                 `);
    html.push(`</div>`);
        }
        break;
case "building":
    html.push(`<div>${icons.building} ${obj.name}</div>`);
    break;

case "npc":
    html.push(`<div>${icons.npc} ${obj.name}</div>`);
    break;

case "item":
    html.push(`<div>${icons.item} ${obj.name}</div>`);
    break;

case "comment":
    html.push(`<div><i>${icons.comment} ${obj.name}</i></div>`);
    break;

default:
    html.push(`<div>${obj.name}</div>`);

}
            });
if (index < cells.length - 1) {
    html.push(`<hr class="tooltip-divider">`);
}
        });
        if (monsterMode)
            return html.join("");
        else
            return html.join("<br>");
    }

    return {
        show,
        move,
        hide,
        setMonsterMode
    };

})();
