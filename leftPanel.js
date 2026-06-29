const leftPanel = (function () {

    const panel = document.getElementById("leftPanel");

    function init(data) {

        panel.innerHTML = "";

        createSection("Монстры", getUnique(data, "monster"));
        createSection("NPC", getUnique(data, "npc"));
        createSection("Предметы", getUnique(data, "item"));

    }

    function getUnique(data, type) {

        const map = new Map();

        data.forEach(cell => {

            (cell.objects || []).forEach(obj => {

                if (obj.type !== type) return;

                if (!map.has(obj.id)) {
                    map.set(obj.id, obj.name);
                }

            });

        });

        return [...map.entries()]
            .sort((a, b) => a[1].localeCompare(b[1], "ru"))
            .map(e => ({
                id: e[0],
                name: e[1]
            }));

    }

    function createSection(title, list) {

        const h = document.createElement("h3");
        h.textContent = title;
        panel.appendChild(h);

        const ul = document.createElement("ul");
        ul.className = "filterList";

        list.forEach(item => {

            const li = document.createElement("li");
            li.dataset.id = item.id;
            li.textContent = item.name;

            // позже здесь будет подсветка карты
            li.onclick = function () {

            };

            ul.appendChild(li);

        });

        panel.appendChild(ul);

    }

    return {
        init: init
    };

})();