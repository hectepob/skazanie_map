console.log("monsterCalculator.js 2507 2050 ");

const monsterCalculator = (function () {
    let currentMonster = null;
    let windowEl;
    let levelInput;

    function init() {
        windowEl = document.createElement("div");
        windowEl.className = "monsterCalculator";
        windowEl.style.display = "none";
        document.body.appendChild(windowEl);
    }

    function open(monster) {
        currentMonster = monster;
        if (!windowEl)
            init();
        windowEl.innerHTML = `
            <div class="monsterHeader">
                ${monster.name}
            </div>
            <div>
                Уровень:
                <input 
                    class="monsterLevel"
                    type="number"
                    value="1"
                    min="1"
                >
            </div>
            <hr>
            <div>
                Здоровье:
                <span class="hp"></span>
            </div>
            <div>
                Урон:
                <span class="damage"></span>
            </div>
            <div>
                Атака:
                <span class="attack"></span>
            </div>
            <div>
                Защита:
                <span class="defense"></span>
            </div>
            <div>
                Броня:
                <span class="armor"></span>
            </div>
            <button class="closeMonster">
                Закрыть
            </button>
        `;
      
        levelInput = windowEl.querySelector(".monsterLevel");
        levelInput.oninput = update;
        windowEl.querySelector(".closeMonster")
            .onclick = close;
        windowEl.style.display = "block";
        update();
    }

    function update() {
        if (!currentMonster)
            return;
        const lvl = Number(levelInput.value) || 1;


        /*
            ВРЕМЕННЫЕ ФОРМУЛЫ

            Пока просто заглушки.
            Потом заменим на JSON.
        */

        const hp =
            lvl * 10;
        const damage =
            lvl * 2;
        const attack =
            lvl;
        const defense =
            lvl;
        const armor =
            lvl / 2;

        windowEl.querySelector(".hp")
            .textContent = hp;
        windowEl.querySelector(".damage")
            .textContent = damage;
        windowEl.querySelector(".attack")
            .textContent = attack;
        windowEl.querySelector(".defense")
            .textContent = defense;
        windowEl.querySelector(".armor")
            .textContent = armor;
    }

    function close() {
        if (windowEl)
            windowEl.style.display = "none";
        currentMonster = null;
    }

    return {
        init,
        open,
        close
    };

})();
