console.log("tooltip.js 2707 2120 ");

const tooltip = (function () {

    const icons = {
        monster: "⚔️",
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
        // номер клетки для объединённых ячеек
        if (cells.length > 1) {
            html.push(
                `<div class="tooltip-location">${cell.id}</div>`
            );
        }
        objects.forEach(obj => {
            switch (obj.type) {
                case "monster":
                    let monsterTitle = `${icons.monster} ${obj.name}`;
                    if (obj.level)
                        monsterTitle += ` (${obj.level})`;
                    if (obj.group)
                        monsterTitle += " +";
                    // обычный режим
                    if (!monsterMode) {
                        html.push(
                            `<div class="itemsTooltip"><b>${monsterTitle}</b></div>`
                        );
                    }
                    // калькулятор
                    else {
                        html.push(`
                            <div class="monsterTooltip">
                                <div class="monsterTooltipTitle">
                                    <b>${monsterTitle}</b>
                                </div>
                                <table class="monsterTooltipTable">
                                    <tr>
                                        <td class="statName">
                                            Урон:
                                        </td>
                                        <td colspan="3" class="damageValue">
                                            ххх-ххх - ххх-ххх
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="statName">
                                            Здоровье:
                                        </td>
                                         <td class="value">
                                            ххх
                                        </td>
                                        <td class="statName">
                                            Броня:
                                        </td>
                                        <td class="value">
                                            ххх
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="statName">
                                            Атака:
                                        </td>

                                        <td class="value">
                                            ххх
                                        </td>
                                        <td class="statName">
                                            Защита:
                                        </td>
                                        <td class="value">
                                            ххх
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        `);
                        // небольшой отступ только после таблицы
                        html.push(
                            `<div class="monsterSpacer"></div>`
                        );
                    }
                break;
                
                case "building":
                    html.push(
                        `<div class="itemsTooltip">
                            ${icons.building} ${obj.name}
                        </div>`
                    );
                break;
                
                case "npc":
                    html.push(
                        `<div class="itemsTooltip">
                            ${icons.npc} ${obj.name}
                        </div>`
                    );
                break;

                case "item":
                    html.push(
                        `<div class="itemsTooltip">
                            ${icons.item} ${obj.name}
                        </div>`
                    );
                break;

                case "comment":
                    html.push(
                        `<div class="itemsTooltip">
                            <i>${icons.comment} ${obj.name}</i>
                        </div>`
                    );
                break;

                default:
                    html.push(
                        `<div class="itemsTooltip">
                            ${obj.name}
                        </div>`
                    );

            }
        });

        // разделитель только между объединенными клетками
        if (index < cells.length - 1) {
            html.push(
                `<hr class="tooltip-divider">`
            );
        }
    });
    return html.join("");
}

    return {
        show,
        move,
        hide,
        setMonsterMode
    };

})();
