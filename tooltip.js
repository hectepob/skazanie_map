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
                //let text = obj.name;
switch (obj.type) {
    case "monster":
        if (!monsterMode) {
            let line = `${icons.monster} ${obj.name}`;
            if (obj.level)
                line += ` (${obj.level})`;
            if (obj.group)
                line += " +";
            html.push(`<b>${line}</b>`);
        } else {
            html.push(`<b>${icons.monster} ${obj.name}</b>`);
            html.push(`Уровень: ${obj.level || "-"}`);
            html.push(`HP: -`);
            html.push(`Damage: -`);
            html.push(`Attack: -`);
            html.push(`Defense: -`);
            html.push(`Armor: -`);
        }
        break;
    case "building":
        html.push(`${icons.building} ${obj.name}`);
        break;
    case "npc":
        html.push(`${icons.npc} ${obj.name}`);
        break;
    case "item":
        html.push(`${icons.item} ${obj.name}`);
        break;
    case "comment":
        html.push(`<i>${icons.comment} ${obj.name}</i>`);
        break;
    default:
        html.push(obj.name);

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
        hide,
        setMonsterMode
    };

})();
