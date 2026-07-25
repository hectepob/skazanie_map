console.log("monsterCalculator.js 2507 2215 ");

const monsterCalculator = (function () {

    let panel;
    let currentMonster = null;


    function init() {

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


    }


    function open(monster) {

        currentMonster = monster;

        panel.querySelector(".monsterName").textContent =
            monster.name;


        panel.querySelector(".monsterLevel").value =
            monster.level || 1;


        update();


        panel.style.display = "block";

    }


    function update() {

        if (!currentMonster)
            return;


        /*
            Пока заглушки.
            Здесь позже будут формулы из json.
        */

        panel.querySelector(".monsterHp").textContent =
            "-";

        panel.querySelector(".monsterDamage").textContent =
            "-";

        panel.querySelector(".monsterAttack").textContent =
            "-";

        panel.querySelector(".monsterDefense").textContent =
            "-";

        panel.querySelector(".monsterArmor").textContent =
            "-";

    }


    function hide() {

        panel.style.display = "none";

    }


    return {
        init,
        open,
        hide
    };


})();
