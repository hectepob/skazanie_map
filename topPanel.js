const topPanelModule = (function () {
const panel = document.getElementById("topPanel");

let locationInput;
let findButton;
let areaMenuButton;
let areaMenu;
let floorBlock;
let floorUpButton;
let floorDownButton;
let floorLabel;
let zoomPlus;
let zoomBlock;
let zoomMinus;
let zoomInput;
let currentAreaLabel;
let areaData = [];
let mapData = [];
let routeSearchButton;
let routeStartInput;
let routeEndInput;
let routeMarkButton;
let routeActiveInput;
let routeMarking = false;
let routeMessage;
let routeSuccessMessage = "";
let routeMessageActive = false;
let tipClicks = 0;
let lastTipChange = 0;

function init(areas, map) {

    areaData = areas;
    mapData = map;
    panel.innerHTML = "";
    const topRow = document.createElement("div");
    topRow.className = "topRow";
    const bottomRow = document.createElement("div");
    bottomRow.className = "bottomRow";
    const routeRow = document.createElement("div");
    routeRow.className = "routeRow";
    routeRow.style.display = "none";
    routeRow.style.alignItems = "center";
    routeRow.style.flexWrap = "nowrap";
    routeRow.style.gap = "8px";
    routeRow.style.width = "100%";
    routeRow.style.padding = "2px 0";
    routeRow.style.overflowX = "auto";
    routeRow.style.boxSizing = "border-box";
    routeRow.style.fontSize = "13px";
    panel.appendChild(topRow);
    panel.appendChild(bottomRow);
    panel.appendChild(routeRow);

// Область для сообщений и уведомлений
routeMessage = document.createElement("div");
routeMessage.className = "routeMessage";
routeMessage.setAttribute("role", "status");
routeMessage.setAttribute("aria-live", "polite");
routeMessage.style.display = "block";
routeMessage.style.visibility = "hidden";
panel.appendChild(routeMessage);

// Показываем первый совет
showNextTip();

// Проверяем, не пора ли сменить совет
setInterval(function () {
    if (
        !routeMessageActive &&
        Date.now() - lastTipChange >= 60000
    ) {
        showNextTip();
    }
}, 5000);

    const centerBlock = document.createElement("div");
    centerBlock.className = "topPanelCenter";
    panel.appendChild(centerBlock);
    
    // ---------- подписи ----------
    const locationLabel = document.createElement("span");
    locationLabel.textContent = "Локация:";

    // ---------- поля ----------
    locationInput = document.createElement("input");
    locationInput.type = "text";
    locationInput.style.width = "80px";
    locationInput.addEventListener("input", function () {
        locationInput.classList.remove("inputError");
        clearRouteMessage();
    });
    locationInput.addEventListener("keydown", function (e) {
        if (e.key !== "Enter")
            return;
        e.preventDefault();
        findButton.click();
    });

    // ---------- кнопки ----------
    areaMenuButton = document.createElement("button");
    areaMenuButton.type = "button";
    areaMenuButton.textContent = "Выбрать область на карте";
    areaMenuButton.className = "areaMenuButton";

    areaMenu = document.createElement("div");
    areaMenu.className = "areaMenu";
    areaMenu.style.display = "none";
    areaMenu.style.position = "absolute";

    findButton = document.createElement("button");
    findButton.className = "findButton";
    findButton.textContent = "Найти";

    const helpButton = document.createElement("button");
    helpButton.textContent = "?";
    helpButton.className = "helpButton";

    floorUpButton = document.createElement("button");
    floorUpButton.textContent = "▲";

    floorDownButton = document.createElement("button");
    floorDownButton.textContent = "▼";

    floorLabel = document.createElement("span");
    floorLabel.textContent = "0";
    floorLabel.style.minWidth = "24px";
    floorLabel.style.display = "inline-block";
    floorLabel.style.textAlign = "center";

    routeSearchButton = document.createElement("button");
    routeSearchButton.type = "button";
    routeSearchButton.textContent = "Поиск пути";
    routeSearchButton.className = "routeSearchButton";
    routeSearchButton.style.padding = "5px 12px";
    
    floorBlock = document.createElement("div");
    floorBlock.className = "floorBlock";
    const floorText = document.createElement("span");
    floorText.textContent = "Этаж:";
    floorBlock.appendChild(floorText);
    floorBlock.appendChild(floorUpButton);
    floorBlock.appendChild(floorLabel);
    floorBlock.appendChild(floorDownButton);

    // ---------- масштаб ----------
    const zoomLabel = document.createElement("span");
    zoomLabel.textContent = "Масштаб:";
    zoomPlus = document.createElement("button");
    zoomPlus.textContent = "+";    
    zoomInput = document.createElement("input");
    zoomInput.type = "text";
    zoomInput.value = "100";
    zoomInput.style.width = "45px";
    zoomInput.style.textAlign = "center";
    zoomMinus = document.createElement("button");
    zoomMinus.textContent = "-";

    zoomBlock = document.createElement("div");
    zoomBlock.className = "zoomBlock";
    zoomBlock.appendChild(zoomLabel);
    zoomBlock.appendChild(zoomPlus);
    zoomBlock.appendChild(zoomInput);
    zoomBlock.appendChild(zoomMinus);

    // ---------- третья строка: поиск маршрута ----------

// Кнопка режима отметки на карте
routeMarkButton = document.createElement("button");
routeMarkButton.type = "button";
routeMarkButton.textContent = "Отметить на карте";
routeMarkButton.style.fontSize = "13px";
routeMarkButton.setAttribute("aria-pressed", "false");

// Начало пути
const routeStartLabel = document.createElement("span");
routeStartLabel.textContent = "Начало пути:";
routeStartInput = document.createElement("input");
routeStartInput.type = "text";
routeStartInput.style.width = "85px";
routeStartInput.addEventListener("keydown", function (e) {
    if (e.key !== "Enter")
        return;
    e.preventDefault();
    routeStartInput.classList.remove("inputError");
    clearRouteMessage();
    const value = routeStartInput.value.trim();
    const id = Number(value);
    // Проверяем существование начальной локации.
    if (
        !value ||
        !Number.isInteger(id) ||
        !byId.has(id)
    ) {
        routeStartInput.classList.add("inputError");
        if (!value) {
            showRouteMessage("Укажите начальную локацию.");
        } else {
            showRouteMessage(`Локации ${value} нет на карте.`);
        }
        routeStartInput.focus();
        return;
    }
    // Если начало корректное, переходим к концу.
    routeEndInput.focus();
});
routeStartInput.addEventListener("input", function () {
    routeStartInput.classList.remove("inputError");
    clearRouteMessage();
});

// Конец пути
const routeEndLabel = document.createElement("span");
routeEndLabel.textContent = "Конец пути:";
routeEndInput = document.createElement("input");
routeEndInput.type = "text";
routeEndInput.style.width = "85px";
routeEndInput.addEventListener("keydown", function (e) {
    if (e.key !== "Enter")
        return;
    e.preventDefault();
    routeFindButton.click();
});

routeEndInput.addEventListener("input", function () {
    routeEndInput.classList.remove("inputError");
    clearRouteMessage();
});

// Запоминаем, в какое поле пользователь поставил курсор
routeStartInput.addEventListener("focus", function () {routeActiveInput = routeStartInput;});
routeEndInput.addEventListener("focus", function () {routeActiveInput = routeEndInput;});
routeStartInput.addEventListener("change", updateRouteEndpoints);
routeEndInput.addEventListener("change", updateRouteEndpoints);

// Кнопки
const routeFindButton = document.createElement("button");
routeFindButton.type = "button";
routeFindButton.textContent = "Найти путь";
routeFindButton.style.fontSize = "13px";

// Иконки сброса и закрытия
const routeResetButton = document.createElement("button");
routeResetButton.type = "button";
routeResetButton.textContent = "↻";
routeResetButton.title = "Сброс";
routeResetButton.setAttribute("aria-label", "Сброс");

const routeCloseButton = document.createElement("button");
routeCloseButton.type = "button";
routeCloseButton.textContent = "×";
routeCloseButton.title = "Закрыть";
routeCloseButton.setAttribute("aria-label", "Закрыть");

// Оформление иконок:
[routeResetButton, routeCloseButton].forEach(button => {
    button.style.width = "28px";
    button.style.height = "28px";
    button.style.padding = "0";
    button.style.fontSize = "20px";
    button.style.lineHeight = "1";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
});

// Разделители
function createRouteSeparator() {
    const separator = document.createElement("span");
    separator.textContent = "|";
    separator.style.color = "#666";
    separator.style.margin = "0 3px";
    return separator;
}

// Размещение элементов
routeRow.appendChild(routeMarkButton);
routeRow.appendChild(createRouteSeparator());

routeRow.appendChild(routeStartLabel);
routeRow.appendChild(routeStartInput);

routeRow.appendChild(routeEndLabel);
routeRow.appendChild(routeEndInput);

routeRow.appendChild(routeFindButton);
routeRow.appendChild(createRouteSeparator());

routeRow.appendChild(routeResetButton);
routeRow.appendChild(routeCloseButton);

// ---------- разделители ----------

    const sep1 = document.createElement("span");
    sep1.textContent = "|";
    sep1.style.margin = "0 8px";
    sep1.style.color = "#666";

    // ---------- размещение ----------
// ---------- первая строка ----------
    topRow.appendChild(areaMenuButton);
    topRow.appendChild(areaMenu);
    topRow.appendChild(locationLabel);
    topRow.appendChild(locationInput);
    topRow.appendChild(findButton);

    // подпись текущей зоны
    currentAreaLabel = document.createElement("div");
    currentAreaLabel.className = "currentAreaLabel";
    centerBlock.appendChild(currentAreaLabel);

    topRow.appendChild(helpButton);
    
// ---------- вторая строка ----------
    bottomRow.appendChild(routeSearchButton);
    bottomRow.appendChild(floorBlock);
    bottomRow.appendChild(sep1);
    bottomRow.appendChild(zoomBlock);

    buildAreaMenu(areaMenu);

// ---------- обработчики ----------

// ---------- поиск маршрута ----------

routeSearchButton.onclick = function () {
    const isOpening = routeRow.style.display === "none";
    routeRow.style.display = isOpening ? "flex" : "none";
    setButtonPressed(routeSearchButton, isOpening);
    if (!isOpening) {
        setRouteMarking(false);
        clearRouteMessage();
    }
    updatePanelHeight();
};

routeCloseButton.onclick = function () {
    routeRow.style.display = "none";
    setButtonPressed(routeSearchButton, false);
    setRouteMarking(false);
    clearRouteMessage();
    updatePanelHeight();
};

// Сброс полей и найденного пути
routeResetButton.onclick = function () {
    routeStartInput.value = "";
    routeEndInput.value = "";
    routeStartInput.classList.remove("inputError");
    routeEndInput.classList.remove("inputError");
    routeSuccessMessage = "";
    routeFinder.clearRoute();
    clearRouteMessage();
    setRouteMarking(false);
    renderMap.draw();
};

// Поиск пути
routeFindButton.onclick = function () {
    setRouteMarking(false);
    routeStartInput.classList.remove("inputError");
    routeEndInput.classList.remove("inputError");
    routeSuccessMessage = "";
    clearRouteMessage();
    const startValue = routeStartInput.value.trim();
    const endValue = routeEndInput.value.trim();
    // Проверяем начальную локацию
    if (!startValue || !Number.isInteger(Number(startValue)) || !byId.has(Number(startValue))) {
        routeFinder.setEndpoints(startValue, endValue);
        renderMap.draw();
        routeStartInput.classList.add("inputError");
        if (!startValue) {
            showRouteMessage("Укажите начальную локацию.");
        } else {
            showRouteMessage(`Локации ${startValue} нет на карте.`);
        }
        routeStartInput.focus();
        return;
    }

    // Проверяем конечную локацию
    if (!endValue || !Number.isInteger(Number(endValue)) || !byId.has(Number(endValue))) {
        routeFinder.setEndpoints(startValue, endValue);
        renderMap.draw();
        routeEndInput.classList.add("inputError");
        if (!endValue) {
            showRouteMessage("Укажите конечную локацию.");
        } else {
            showRouteMessage(`Локации ${endValue} нет на карте.`);
        }
        routeEndInput.focus();
        return;
    }
    const result = routeFinder.findRoute(startValue, endValue);
if (!result.success) {
    renderMap.draw();
    if (result.reason === "notFound") {
        showRouteMessage(
            "Путь не найден. Возможно, он проходит через неизвестное измерение."
        );
    }
    return;
}

// Количество переходов: все клетки маршрута, кроме начальной.
const transitions = result.route.steps.length;

// Правильное окончание слова «переход».
const lastTwo = transitions % 100;
const lastOne = transitions % 10;
let word = "переходов";
if (lastTwo < 11 || lastTwo > 14) {
    if (lastOne === 1)
        word = "переход";
    else if (lastOne >= 2 && lastOne <= 4)
        word = "перехода";
}

showRouteMessage(
    `Кратчайший путь обнаружен и составит ${transitions} ${word}.`,
    "success"
);

// Центрируем карту на начальной локации
navigation.gotoCell(Number(startValue));
};
    
    routeMarkButton.onclick = function () {
        setRouteMarking(!routeMarking);
        if (routeMarking) {
            routeActiveInput = routeStartInput;
            routeStartInput.focus();
        }
    };
    
areaMenuButton.onclick = function () {
    if (areaMenu.style.display === "block") {
        areaMenu.style.display = "none";
        return;
    }
    areaMenu.style.display = "block";
    areaMenu.style.top = "36px";
    requestAnimationFrame(() => {
        fitIntoViewport(areaMenu);
    });
};
    
function buildAreaMenu(areaMenu) {
    areaMenu.innerHTML = "";
    const regions = [];
    areaData.forEach(a => {
        let region = regions.find(r => r.id === a.id_area);
        if (!region) {
            region = {
                id: a.id_area,
                name: a.area,
                subareas: []
            };
            regions.push(region);
        }
        region.subareas.push(a);
    });
    regions.sort((a,b)=>a.id-b.id);
    regions.forEach(region=>{
        const regionRow=document.createElement("div");
        regionRow.className="areaMenuRegion";
        regionRow.textContent=region.name;
        const submenu=document.createElement("div");
        submenu.className="areaSubmenu";
        regionRow.addEventListener("mouseenter", () => {
            submenu.style.display = "block";
            const rowRect = regionRow.getBoundingClientRect();
            const menuRect = areaMenu.getBoundingClientRect();
            let top = rowRect.top - menuRect.top;
            submenu.style.top = top + "px";
            requestAnimationFrame(() => {
                const rect = submenu.getBoundingClientRect();
                if (rect.bottom > window.innerHeight) {
                    top -= (rect.bottom - window.innerHeight + 6);
                    submenu.style.top = top + "px";
                }
                if (submenu.getBoundingClientRect().top < 4) {
                    submenu.style.top = "4px";
                }
            });
        });

regionRow.addEventListener("mouseleave", () => {
    submenu.style.display = "";
});        
        region.subareas
            .sort((a,b)=>a.id_subarea-b.id_subarea)
            .forEach(sub=>{
                const row=document.createElement("div");
                row.className="areaSubmenuItem";
                row.textContent=sub.subarea;
                row.onclick=function(){
                    areaMenu.style.display="none";
                    const ids = mapData
                        .filter(c =>
                            c.area === region.name &&
                            c.subarea === sub.subarea
                        )
                        .map(c => c.id);
                    highlight.setCells(ids, false);
                    navigation.gotoCell(sub.central_cell);
                };
                submenu.appendChild(row);
            });
        regionRow.appendChild(submenu);
        areaMenu.appendChild(regionRow);
    });
}

function fitIntoViewport(menu){
    const rect = menu.getBoundingClientRect();
    let top = parseFloat(menu.style.top) || 0;
    if (rect.bottom > window.innerHeight){
        top -= (rect.bottom - window.innerHeight + 8);
        menu.style.top = top + "px";
    }
    if (top < 0)
        menu.style.top = "0px";
}
  
findButton.onclick = function () {
    locationInput.classList.remove("inputError");
    clearRouteMessage();
    const value = locationInput.value.trim();
    if (value === "")
        return;
    const id = Number(value);
    if (!Number.isInteger(id) || !byId.has(id)) {
        locationInput.classList.add("inputError");
        showRouteMessage(`Локации ${value} нет на карте.`);
        return;
    }
    highlight.clear(false);
    navigation.gotoCell(id);
};
    
    floorUpButton.onclick = function () {
        navigation.changeFloor(1);
    };

    floorDownButton.onclick = function () {
        navigation.changeFloor(-1);
    };

    zoomPlus.onclick = () => navigation.setZoom(scale.value + 0.25);
    zoomMinus.onclick = () => navigation.setZoom(scale.value - 0.25);

    zoomInput.addEventListener("keydown", function (e) {
        if (e.key !== "Enter")
            return;
        e.preventDefault();
        const value = Number(zoomInput.value);
        if (isNaN(value))
            return;
        navigation.setZoom(value / 100);
});

    helpButton.onclick = function () {
        helpWindow.show();
    };

    updatePanelHeight();

}


// Показ сообщения об ошибке или результате поиска
function showRouteMessage(message, type = "error") {
    if (!routeMessage)
        return;

    if (type === "success")
        routeSuccessMessage = message;

    routeMessageActive = true;
    routeMessage.textContent = message;
    routeMessage.title = message;

    routeMessage.className = type === "success"
        ? "routeMessage routeMessageSuccess"
        : "routeMessage";

    routeMessage.style.visibility = "visible";
}

// Очистка сообщения с возвратом к советам
function clearRouteMessage() {
    if (!routeMessage)
        return;

    // Если маршрут всё ещё отображается, сохраняем его сообщение
    if (routeSuccessMessage) {
        showRouteMessage(routeSuccessMessage, "success");
        return;
    }

    if (!routeMessageActive)
        return;

    routeMessageActive = false;
    routeMessage.textContent = "";
    routeMessage.title = "";
    routeMessage.style.visibility = "hidden";

    showNextTip();
}

// Показ следующего совета
function showNextTip() {
    if (!routeMessage || routeMessageActive)
        return;

    const tip = tipsModule.getNextTip();

    if (!tip)
        return;

    routeMessage.textContent = tip;
    routeMessage.title = tip;
    routeMessage.className = "routeMessage routeMessageTip";
    routeMessage.style.visibility = "visible";

    lastTipChange = Date.now();
    tipClicks = 0;
}

// Учитываем клики по клеткам карты
function registerTipActivity() {
    if (routeMessageActive)
        return;

    tipClicks++;

    if (
        tipClicks >= 10 &&
        Date.now() - lastTipChange >= 15000
    ) {
        showNextTip();
    }
}
    
// Обновление точек после ручного ввода
function updateRouteEndpoints() {
    routeFinder.setEndpoints(
        routeStartInput.value,
        routeEndInput.value,
        true
    );
    routeStartInput.classList.remove("inputError");
    routeEndInput.classList.remove("inputError");
    clearRouteMessage();
    renderMap.draw();
}
    
// Визуальное состояние нажатой кнопки
function setButtonPressed(button, pressed) {
    button.setAttribute("aria-pressed", String(pressed));

    if (pressed) {
        button.style.background =
            "linear-gradient(180deg, #c8aa6b, #a8894e)";
        button.style.boxShadow =
            "inset 0 2px 5px rgba(0,0,0,.35)";
    } else {
        button.style.background = "";
        button.style.boxShadow = "";
    }
}

// Включение и выключение режима выбора клеток
function setRouteMarking(enabled) {
    routeMarking = enabled;
    setButtonPressed(routeMarkButton, enabled);

    if (!enabled)
        routeActiveInput = null;
}

// Обработка клика по клетке карты для полей маршрута
function handleMapCellClick(cell) {
    if (!cell)
        return;
    registerTipActivity();
    // Ошибку можно убрать кликом по карте.
    // Сообщение об успешном маршруте при этом сохраняется.
    if (routeMessageActive && !routeSuccessMessage)
        clearRouteMessage();
    if (!routeMarking)
        return;
    // Если поле ещё не выбрано, определяем его по заполненности.
    if (
        routeActiveInput !== routeStartInput &&
        routeActiveInput !== routeEndInput
    ) {
        if (!routeStartInput.value.trim()) {
            routeActiveInput = routeStartInput;
        } else {
            routeActiveInput = routeEndInput;
        }
    }

    // Запоминаем, какое именно поле заполняем.
    const targetInput = routeActiveInput;
    targetInput.value = cell.id;
    targetInput.classList.remove("inputError");

    // После выбора начала переходим к концу.
    if (targetInput === routeStartInput) {
        routeActiveInput = routeEndInput;
    } else {
        routeActiveInput = routeEndInput;
    }
    routeEndInput.focus();

    // Обновляем точки, но сохраняем ранее найденный маршрут.
    routeFinder.setEndpoints(
        routeStartInput.value,
        routeEndInput.value,
        true
    );
    renderMap.draw();
}
    
function updatePanelHeight() {
    requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
            "--topPanelHeight",
            panel.offsetHeight + "px"
        );
    });
}    

function clearSelection() {
    locationInput.value = "";
    locationInput.classList.remove("inputError");
}

function setCurrentArea(area, subarea) {
    if (!currentAreaLabel)
        return;
    currentAreaLabel.innerHTML =
        area && subarea
            ? `<div class="currentRegion">${area}</div>
               <div class="currentSubarea">${subarea}</div>`
            : "";
}
    
return {
    init,
    handleMapCellClick,
    setFloor(value) {
        floorLabel.textContent = value;
    },
    setZoom(value) {
        zoomInput.value = Math.round(value * 100);
    },
    onZoomPlus(fn) {
        zoomPlus.onclick = fn;
    },
    onZoomMinus(fn) {
        zoomMinus.onclick = fn;
    },
    onZoomEnter(fn) {
        zoomInput.onkeydown = e => {
            if (e.key === "Enter")
                fn(Number(zoomInput.value));
        };
    },
    clearSelection,
    setCurrentArea,
    selectCell(cell) {
        if (!cell)
            return;
        locationInput.value = cell.id;
    }
};
})();
