const routeFinder = (function () {

    let data;
    let byId;

    // Физические клетки карты и их семейства
    let groups = new Map();
    let groupKeyByCellId = new Map();

    // Граф переходов
    let graph = new Map();

    // Начало, конец и найденный маршрут
    let startId = null;
    let endId = null;
    let startGroupKey = null;
    let endGroupKey = null;
    let route = null;

    const DIRECTIONS = [
        { name: "north", row: -1, col: 0, opposite: "south" },
        { name: "east", row: 0, col: 1, opposite: "west" },
        { name: "south", row: 1, col: 0, opposite: "north" },
        { name: "west", row: 0, col: -1, opposite: "east" }
    ];

    function init(config) {
        data = config.data;
        byId = config.byId;

        buildGraph();
    }

    // Получаем родительскую клетку
    function getRoot(cell) {
        let current = cell;

        while (Number(current.parent_id) !== 0) {
            const parent = byId.get(Number(current.parent_id));

            if (!parent)
                break;

            current = parent;
        }

        return current;
    }

    // Ключ физического положения клетки
    function makeGroupKey(map, floor, row, col) {
        return `${map}|${floor}|${row}|${col}`;
    }

    // Проверяем, является ли граница проходом
    function isOpen(value) {
        return value === true ||
            String(value).toLowerCase() === "true" ||
            String(value).toLowerCase() === "door";
    }

    // Преобразуем ID лестницы
    function toId(value) {
        if (value === null || value === undefined || String(value).trim() === "")
            return null;

        const id = Number(value);

        return Number.isInteger(id) ? id : null;
    }

    // Добавляем переход в граф
    function addEdge(fromKey, toKey, edge) {
        const edges = graph.get(fromKey);

        if (!edges)
            return;

        const exists = edges.some(item =>
            item.toKey === toKey &&
            item.type === edge.type &&
            item.direction === edge.direction
        );

        if (exists)
            return;

        edges.push({
            toKey,
            type: edge.type,
            direction: edge.direction
        });
    }

    // Построение графа всех доступных переходов
    function buildGraph() {

        groups.clear();
        groupKeyByCellId.clear();
        graph.clear();

        // Объединяем клетки, занимающие одно физическое положение
        data.forEach(cell => {
            const root = getRoot(cell);

            const key = makeGroupKey(
                root.id_map,
                root.floor,
                root.row,
                root.col
            );

            if (!groups.has(key)) {
                groups.set(key, {
                    key,
                    root,
                    members: []
                });
            }

            groups.get(key).members.push(cell);
            groupKeyByCellId.set(Number(cell.id), key);
        });

        // Создаём пустые списки переходов
        groups.forEach((group, key) => {
            graph.set(key, []);
        });

        // Строим переходы между соседними клетками
        groups.forEach(group => {

            DIRECTIONS.forEach(direction => {

                const neighborKey = makeGroupKey(
                    group.root.id_map,
                    group.root.floor,
                    Number(group.root.row) + direction.row,
                    Number(group.root.col) + direction.col
                );

                const neighbor = groups.get(neighborKey);

                if (!neighbor || neighborKey === group.key)
                    return;

                // Учитываем проходы всех клеток семейства
                const openHere = group.members.some(cell =>
                    isOpen(cell[direction.name])
                );

                const openThere = neighbor.members.some(cell =>
                    isOpen(cell[direction.opposite])
                );

                // Достаточно прохода хотя бы с одной стороны
                if (openHere || openThere) {
                    addEdge(group.key, neighborKey, {
                        type: "passage",
                        direction: direction.name
                    });
                }
            });

            // Учитываем лестницы всех клеток семейства
            group.members.forEach(cell => {

                ["up", "down"].forEach(direction => {

                    const targetId = toId(cell.stairs?.[direction]);

                    if (targetId === null)
                        return;

                    const targetKey = groupKeyByCellId.get(targetId);

                    if (!targetKey || targetKey === group.key)
                        return;

                    // Лестница направленная:
                    // обратный переход автоматически не создаём
                    addEdge(group.key, targetKey, {
                        type: "stairs",
                        direction
                    });
                });
            });
        });
    }

    // Проверка введённого номера клетки
    function parseCellId(value) {
        if (value === null || value === undefined || String(value).trim() === "")
            return null;

        const id = Number(value);

        if (!Number.isInteger(id) || !byId.has(id))
            return null;

        return id;
    }

    // Обновление начальной и конечной клеток
function setEndpoints(startValue, endValue, preserveRoute = false) {
    startId = parseCellId(startValue);
    endId = parseCellId(endValue);
    startGroupKey = startId === null
        ? null
        : groupKeyByCellId.get(startId);
    endGroupKey = endId === null
        ? null
        : groupKeyByCellId.get(endId);
    // Удаляем старый маршрут только по запросу.
    if (!preserveRoute)
        route = null;
}

    // Поиск кратчайшего маршрута с минимальной суммой номеров клеток
    function findRoute(startValue, endValue) {

        setEndpoints(startValue, endValue);

        if (startId === null || !startGroupKey)
            return { success: false, reason: "invalidStart" };

        if (endId === null || !endGroupKey)
            return { success: false, reason: "invalidEnd" };

        // Начало и конец находятся в одной физической клетке
        if (startGroupKey === endGroupKey) {
            route = {
                startId,
                endId,
                groupKeys: [startGroupKey],
                steps: []
            };

            return { success: true, route };
        }

        // Сумма номеров всех клеток физической группы
        function getGroupIdSum(groupKey) {
            const group = groups.get(groupKey);

            return group.members.reduce(
                (sum, cell) => sum + Number(cell.id),
                0
            );
        }

        // ЭТАП 1. Находим минимальное количество переходов
        const queue = [startGroupKey];
        const distances = new Map([[startGroupKey, 0]]);

        let queueIndex = 0;
        let endDistance = null;

        while (queueIndex < queue.length) {

            const currentKey = queue[queueIndex++];
            const currentDistance = distances.get(currentKey);

            // Все вершины предыдущего уровня уже обработаны
            if (
                endDistance !== null &&
                currentDistance >= endDistance
            ) {
                break;
            }

            const edges = graph.get(currentKey) || [];

            edges.forEach(edge => {

                if (distances.has(edge.toKey))
                    return;

                const nextDistance = currentDistance + 1;

                distances.set(edge.toKey, nextDistance);
                queue.push(edge.toKey);

                if (edge.toKey === endGroupKey)
                    endDistance = nextDistance;
            });
        }

        if (endDistance === null)
            return { success: false, reason: "notFound" };

        // ЭТАП 2. Среди кратчайших маршрутов выбираем минимальную сумму ID
        const costs = new Map();
        const previous = new Map();

        costs.set(startGroupKey, getGroupIdSum(startGroupKey));

        queue.forEach(currentKey => {

            const currentDistance = distances.get(currentKey);

            if (currentDistance >= endDistance)
                return;

            const currentCost = costs.get(currentKey);

            if (currentCost === undefined)
                return;

            const edges = graph.get(currentKey) || [];

            edges.forEach(edge => {

                // Рассматриваем только переходы на следующий уровень
                if (
                    distances.get(edge.toKey) !==
                    currentDistance + 1
                ) {
                    return;
                }

                const nextCost =
                    currentCost + getGroupIdSum(edge.toKey);

                const oldCost = costs.get(edge.toKey);

                // При равной сумме сохраняем ранее найденный вариант
                if (oldCost !== undefined && nextCost >= oldCost)
                    return;

                costs.set(edge.toKey, nextCost);

                previous.set(edge.toKey, {
                    fromKey: currentKey,
                    type: edge.type,
                    direction: edge.direction
                });
            });
        });

        if (!costs.has(endGroupKey))
            return { success: false, reason: "notFound" };

        // Восстанавливаем выбранный маршрут
        const groupKeys = [endGroupKey];
        const steps = [];

        let currentKey = endGroupKey;

        while (currentKey !== startGroupKey) {

            const previousStep = previous.get(currentKey);

            if (!previousStep)
                return { success: false, reason: "notFound" };

            steps.unshift({
                fromKey: previousStep.fromKey,
                toKey: currentKey,
                type: previousStep.type,
                direction: previousStep.direction
            });

            currentKey = previousStep.fromKey;
            groupKeys.unshift(currentKey);
        }

        route = {
            startId,
            endId,
            groupKeys,
            steps
        };

        return { success: true, route };
    }

    // Сброс маршрута и точек
    function clearRoute() {
        startId = null;
        endId = null;
        startGroupKey = null;
        endGroupKey = null;
        route = null;
    }

    // Информация для отрисовки конкретной физической клетки
    function getRenderInfo(cells) {

        const firstCell = cells && cells.length ? cells[0] : null;
        const key = firstCell
            ? groupKeyByCellId.get(Number(firstCell.id))
            : null;
        const steps = route
            ? route.steps.filter(step => step.fromKey === key)
            : [];
        const stairs = [];
        const routeIndex = route
            ? route.groupKeys.indexOf(key)
            : -1;
if (route) {
    route.steps.forEach(step => {
        if (step.type !== "stairs")
            return;
        // Зелёный указатель ставим только на лестнице, с которой маршрут действительно начинается.
        if (step.fromKey === key) {
            stairs.push(step.direction);
        }
    });
}

return {
    isStart: key !== null && key === startGroupKey,
    isEnd: key !== null && key === endGroupKey,
    isOnRoute: routeIndex !== -1,
    routeIndex,
    steps,
    stairs
};
    }

    return {
        init,
        setEndpoints,
        findRoute,
        clearRoute,
        getRenderInfo
    };

})();
