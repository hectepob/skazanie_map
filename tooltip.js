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
    let monsterStats = new Map();

    function setMonsterStats(json) {
        monsterStats.clear();
        json.forEach(m => {
            monsterStats.set(m.object_id, m);
        });
    }

    function calcStat(base, pl, lvl) {
        return Math.round(
            Number(base) + Number(pl) * (Number(lvl) - 1)
        );
    }

    function getMonsterStats(id, level) {
        const s = monsterStats.get(id);
        if (!s)
            return null;
        let lvlMin = level;
        let lvlMax = level;
        if (String(level).includes("-")) {
            const parts = String(level).split("-");
            lvlMin = Number(parts[0]);
            lvlMax = Number(parts[1]);
        }
        function range(base, pl) {
            const a = calcStat(base, pl, lvlMin);
            const b = calcStat(base, pl, lvlMax);
            if (a === b)
                return a;
            return `${a} — ${b}`;
        }

        return {
            hp: range(s.hp_base, s.hp_pl),
            at: range(s.at_base, s.at_pl),
            dod: range(s.dod_base, s.dod_pl),
            arm: range(s.arm_base, s.arm_pl),
            damage:
                range(s.minD_base, s.minD_pl)
                +
                " - "
                +
                range(s.maxD_base, s.maxD_pl)
        };
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
                        if (!monsterMode) {
                            html.push(
                                `<div class="itemsTooltip"><b>${monsterTitle}</b></div>`
                            );
                        }
                        else {
                            const stats = getMonsterStats(
                                obj.id,
                                obj.level
                            );
                            html.push(`
                                <div class="monsterTooltip">
                                <div class="monsterTooltipTitle"><b>${monsterTitle}</b></div>
                                <table class="monsterTooltipTable">
                                <tr>
                                <td class="statName">Урон:</td>
                                <td colspan="3" class="damageValue">${monsterCalculator.calcDamage(obj.id, obj.level)}</td>
                                </tr>
                                <tr>
                                <td class="statName">Здоровье:</td>
                                <td class="value">${monsterCalculator.calcStat(obj.id,"hp",obj.level)}</td>
                                <td class="statName">Броня:</td>
                                <td class="value"> ${monsterCalculator.calcStat(obj.id,"arm",obj.level)}</td>
                                </tr>
                                <tr>
                                <td class="statName">Атака:</td>
                                <td class="value">${monsterCalculator.calcStat(obj.id,"at",obj.level)}</td>
                                <td class="statName">Уворот:</td>
                                <td class="value">${monsterCalculator.calcStat(obj.id,"dod",obj.level)}</td>
                                </tr>
                                </table>
                                </div>
                            `);
                            html.push(`<div class="monsterSpacer"></div>`);
                        }
                    break;
                
                    case "building":
                        html.push(`<div class="itemsTooltip">${icons.building} ${obj.name}</div>`);
                    break;
                
                    case "npc":
                        html.push(`<div class="itemsTooltip">${icons.npc} ${obj.name}</div>`);
                    break;

                    case "item":
                        html.push(`<div class="itemsTooltip">${icons.item} ${obj.name}</div>`);
                    break;

                    case "comment":
                        html.push(`<div class="itemsTooltip"><i>${icons.comment} ${obj.name}</i></div>`);
                    break;

                    default:
                        html.push(`<div class="itemsTooltip">${obj.name}</div>`);
                }
            });

            if (index < cells.length - 1) {
                html.push(`<hr class="tooltip-divider">`);
            }
        });
        return html.join("");
    }

    return {
        show,
        move,
        hide,
        setMonsterMode,
        setMonsterStats
    };

})();
