console.log("monsterCalculator.js 2807 0930 ");

const monsterCalculator = (function () {
    let panel;
    let currentMonster = null;
    let monsterStats = new Map();
    
    function init(json) {
        panel = document.createElement("div");
        panel.id = "monsterCalculator";
        panel.style.display = "none";
        panel.innerHTML = `
            <div class="monsterCalcHeader">
                <span>Калькулятор монстра</span>
                <button class="monsterCalcClose">✖</button>
            </div>
            <div class="monsterCalcBody">
                <h3 class="monsterName"></h3>
                <label>
                    Уровень:
                    <input class="monsterLevel" type="number" value="1" min="1">
                </label>
                <hr>
                <div>
                    Здоровье:
                    <span class="monsterHp">-</span>
                </div>
                <div>
                    Урон:
                    <span class="monsterDamage">-</span>
                </div>
                <div>
                    Атака:
                    <span class="monsterAttack">-</span>
                </div>
                <div>
                    Защита:
                    <span class="monsterDefense">-</span>
                </div>
                <div>
                    Броня:
                    <span class="monsterArmor">-</span>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        panel
            .querySelector(".monsterCalcClose")
            .onclick = hide;
        panel
            .querySelector(".monsterLevel")
            .oninput = update;
        json.forEach(m => {
            monsterStats.set(m.object_id, m);
        });
    }

function stat(base, pl, lvl) {
    return Math.round(base + pl * (lvl - 1));
}

function calcStat(base, pl, lvlString) {
    if (!lvlString)
        return "-";
    lvlString = String(lvlString).trim();
    if (lvlString.includes("-")) {
        const parts = lvlString.split("-");
        const minLvl = Number(parts[0]);
        const maxLvl = Number(parts[1]);
        return (
            stat(base, pl, minLvl) +
            "-" +
            stat(base, pl, maxLvl)
        );
    }
    return stat(base, pl, Number(lvlString));
}

function calcDamage(stat, lvlString) {
    if (!lvlString)
        return "-";
    lvlString = String(lvlString).trim();

    // диапазон уровней
    if (lvlString.includes("-")) {
        const parts = lvlString.split("-");
        const lvlMin = Number(parts[0]);
        const lvlMax = Number(parts[1]);
        const min1 = stat.minD_base + stat.minD_pl * (lvlMin - 1);
        const max1 = stat.maxD_base + stat.maxD_pl * (lvlMin - 1);
        const min2 = stat.minD_base + stat.minD_pl * (lvlMax - 1);
        const max2 = stat.maxD_base + stat.maxD_pl * (lvlMax - 1);
        return (
            Math.round(min1) + "-" + Math.round(max1) +
            " — " +
            Math.round(min2) + "-" + Math.round(max2)
        );
    }

    // один уровень
    const lvl = Number(lvlString);
    const min = stat.minD_base + stat.minD_pl * (lvl - 1);
    const max = stat.maxD_base + stat.maxD_pl * (lvl - 1);
    return (
        Math.round(min) +
        "-" +
        Math.round(max)
    );

}
    
    function open(monster) {
        currentMonster = monster;
        panel.querySelector(".monsterName").textContent =
            monster.name;
        panel.querySelector(".monsterLevel").value =
            monster.level || 1;
        update();
        panel.style.display = "block";
        const left = document.getElementById("leftPanel");
        const rect = left.getBoundingClientRect();
        panel.style.left = (rect.right + 10) + "px";
        panel.style.top = rect.top + "px";
        panel.style.right = "auto";
    }
    
function update() {
    if (!currentMonster)
        return;
    const lvl = Number(
        panel.querySelector(".monsterLevel").value
    );
    const s = monsterStats.get(currentMonster.id);
    if (!s)
        return;
    panel.querySelector(".monsterHp").textContent =
        stat(s.hp_base,s.hp_pl,lvl);
    panel.querySelector(".monsterDamage").textContent =
        stat(s.minD_base,s.minD_pl,lvl) +
        " - " +
        stat(s.maxD_base,s.maxD_pl,lvl);
    panel.querySelector(".monsterAttack").textContent =
        stat(s.at_base,s.at_pl,lvl);
    panel.querySelector(".monsterDefense").textContent =
        stat(s.dod_base,s.dod_pl,lvl);
    panel.querySelector(".monsterArmor").textContent =
        stat(s.arm_base,s.arm_pl,lvl);
}
    
    function hide() {
        panel.style.display = "none";
    }
    
    return {
        init,
        open,
        hide,
    calcDamage
    };
    
})();
