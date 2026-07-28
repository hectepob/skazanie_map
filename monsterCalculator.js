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

function calcStat(objectId, statName, lvlString) {
    const s = monsterStats.get(objectId);
    if (!s || !lvlString) return "-";
    lvlString = String(lvlString).trim();
    const base = s[statName + "_base"];
    const pl = s[statName + "_pl"];
    if (lvlString.includes("-")) {
        const [minLvl, maxLvl] = lvlString.split("-").map(Number);
        return stat(base, pl, minLvl) + " — " + stat(base, pl, maxLvl);
    }
    return stat(base, pl, Number(lvlString));
}

function calcDamage(objectId, lvlString) {
    const stat = monsterStats.get(objectId);
    if (!stat)
        return "-";
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
        panel.querySelector(".monsterName").textContent = monster.name;
        panel.querySelector(".monsterLevel").value = monster.level || 1;
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
    panel.querySelector(".monsterHp").textContent = calcStat(currentMonster.id, "hp", lvl);
    panel.querySelector(".monsterDamage").textContent = calcDamage(currentMonster.id, lvl);
    panel.querySelector(".monsterAttack").textContent = calcStat(currentMonster.id, "at", lvl);
    panel.querySelector(".monsterDefense").textContent = calcStat(currentMonster.id, "dod", lvl);
    panel.querySelector(".monsterArmor").textContent = calcStat(currentMonster.id, "arm", lvl);
    }
    
    function hide() {
        panel.style.display = "none";
    }
    
    return {
        init,
        open,
        hide,
        calcDamage,
        calcStat
    };
    
})();
