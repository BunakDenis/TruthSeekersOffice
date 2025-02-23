// Получаем значение CSS глобальных перменных
const rootStyles = getComputedStyle(document.documentElement);
const pageTextColorHover = rootStyles
  .getPropertyValue("--page-text-color-hover")
  .trim();
const sidebarMenuBackgroundColorHover = rootStyles
  .getPropertyValue("--cabinet-page-menu-item-hover-background-color")
  .trim();
const sidebarBackdropFilterBlur = rootStyles
  .getPropertyValue("--sidebar-content-backdrop-filter-blur")
  .trim();

document.addEventListener(
  "DOMContentLoaded",
  changeModalEditInformationHeight()
);

//Проверка развернут ли сайдабр. Если развёрнут вернёт true в обратном случае false
function isSideBarExpand() {
  if ($(".sidebar").hasClass("expand")) {
    return true;
  } else {
    return false;
  }
}
//Показ/скрытие текста и каретки главного меню сайдбара. Если setShowSideBar = true, елементы станут видимыми, в противном случае будут скрыты
function showOrHideSideBarItemText(setShowSideBar) {
  const textMenuItem = document.querySelectorAll(".sidebar-menu-item-text");
  const caretMenuItem = document.querySelectorAll(".fa-caret-down");

  if (setShowSideBar) {
    if (textMenuItem) {
      textMenuItem.forEach((text) => {
        text.style.display = "inline-block";
      });
    }

    if (caretMenuItem) {
      caretMenuItem.forEach((caret) => {
        caret.style.display = "inline-block";
      });
    }
  } else {
    if (textMenuItem) {
      textMenuItem.forEach((text) => {
        text.style.display = "none";
      });
    }

    if (caretMenuItem) {
      caretMenuItem.forEach((caret) => {
        caret.style.display = "none";
      });
    }
  }
}
//Показ/скрытие подменю сайдбара в свёрнутом виде. Если setVisible = true, елементы станут видимыми, в противном случае будут скрыты
function setVisibleOrHideSidebarOverflow(setVisible) {
  if (setVisible) {
    $(".sidebar").css("overflow-y", "visible");
    $(".sidebar").css("overflow-x", "visible");
  } else {
    $(".sidebar").css("overflow-y", "auto");
    $(".sidebar").css("overflow-x", "hidden");
  }
}
//Переменная-ключ для добавления контента активного меню сайдбара
const sidebarMenuActiveContentIdKey = "sidebar-content-id";
//Показ/скрытие контента соответсвующего меню или подменю сайдбара
function showOrHideSidebarContent(itemId) {
  //ID соответствующего контейнера контента меню сайдбара
  const itemContent = document.getElementById(`${itemId}-sb-cnt`);
  //Скрываем текущий активный контент
  if (itemContent) {
    //ID текущего активного контента меню сайдбара
    const activeItemContentId = localStorage.getItem(
      sidebarMenuActiveContentIdKey
    );

    //Проверка на совпадение активного контента с выбранным
    //Если выбрано другое меню, отключаем текущий активный контент и отображаем выбранный
    if (activeItemContentId) {
      if (!activeItemContentId.includes(itemContent.id)) {
        const activeItemContent = document.getElementById(activeItemContentId);

        if (activeItemContent) {
          activeItemContent.style.display = "none";
        }
      }
    }
    if (isSideBarExpand()) {
      document
        .querySelector(".cabinet-content")
        .classList.add("expand-sidebar");
    } else {
      document
        .querySelector(".cabinet-content")
        .classList.remove("expand-sidebar");
    }

    //Включаем отображение контента
    itemContent.style.display = "block";
    document.querySelector(".cabinet-content").style.display = "block";
    //Записываем в localStorage текущий активный блок с контентом
    localStorage.setItem(sidebarMenuActiveContentIdKey, itemContent.id);
  }
}

//Переключение видимости сайдбара
$(".btn").click(function () {
  $(this).toggleClass("click");
  $(".sidebar").toggleClass("expand");
  $(".fa-circle-arrow-right").toggleClass("rotate");

  if ($(".fa-circle-arrow-right").hasClass("rotate")) {
    showOrHideSideBarItemText(true);
  } else {
    showOrHideSideBarItemText(false);
    hideVisibleDropMenuInExpandSidebar();
  }
  $(".cabinet-content").toggleClass("expand-sidebar");
});

function toggelerVisibilityDropMenu(item) {
  if (isSideBarExpand) {
    //Инициализация родительского <li> элемента
    const parentLi = item.closest("li");
    //Инициализация элемента <ul> выпадающего меню
    const servShowElement = parentLi.querySelector(".serv-show");

    //Проверка элемента <ul>
    if (servShowElement) {
      //Переключение видимости подменю
      servShowElement.classList.toggle("show");
      changeVisibilityOfSubMenuItems(servShowElement);
    }
  }
}

function hideVisibleDropMenuInExpandSidebar() {
  const menuItems = document.querySelectorAll(".serv-show");

  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].classList.contains("show")) {
      changeVisibilityOfSubMenuItems(menuItems[i]);
      menuItems[i]
        .closest("li")
        .querySelector(".fas")
        .classList.remove("rotate");
      menuItems[i].classList.remove("show");
    }
  }
}

//Переменная со всеми елементами главного меню сайдбара
const sidebarMenuItems = document.querySelectorAll(".sidebar-menu-item");
const sidebarActiveMenuIdKey = "sidebar-menu-id";
const expandSidebarActiveMenuIdKey = "sidebar-expand-menu-id";
const sidebarActiveSubmenuIdKey = "sidebar-submenu-id";

//Прослушка главного меню сайдбара на клик
sidebarMenuItems.forEach((item) => {
  //Елемент Li выбранного главного меню сайдбара
  const liItem = item.closest("li");
  const liItems = liItem.children;

  //Показываем/скрываем контент при нажатии на меню или подменю
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const activeMenuId = localStorage.getItem(sidebarActiveMenuIdKey);
    const activeSubMenu = document.getElementById(
      localStorage.getItem(sidebarActiveSubmenuIdKey)
    );

    //Снимаем класс active с активного подменю
    if (activeSubMenu) {
      activeSubMenu.classList.remove("active");
      localStorage.removeItem(sidebarActiveSubmenuIdKey);
    }

    //Если выбрано уже активное меню просто добавляем класс active, если выбрано другое меню снимаем класс active с активного и активируем текущее
    if (!activeMenuId.includes(item.id)) {
      localStorage.setItem(sidebarActiveMenuIdKey, item.id);

      //Снимаем класс active с активного меню
      document
        .getElementById(activeMenuId)
        .closest("li")
        .classList.remove("active");

      //Добавляем класс active к выбранному меню
      item.closest("li").classList.add("active");

      //Если сайдбар свёрнут, делаем ту же операцию для названия меню в выпадающем списке
      if (isSideBarExpand) {
        const activeSidebarMenuTitle =
          findActiveSidebarMenuTitleById(activeMenuId);
        activeSidebarMenuTitle.classList.remove("active");

        const selectedSidebarMenu = findActiveSidebarMenuTitleById(item.id);

        selectedSidebarMenu.classList.add("active");
      }
    } else {
      localStorage.setItem(sidebarActiveMenuIdKey, item.id);
      item.closest("li").classList.add("active");

      if (isSideBarExpand) {
        const selectedSidebarMenu = findActiveSidebarMenuTitleById(item.id);
        selectedSidebarMenu.classList.add("active");
      }
    }

    showOrHideSidebarContent(item.id);
  });

  let ulSubMenuItem;

  //Инициализация подменю
  for (let i = 0; i < liItems.length; i++) {
    if (liItems[i].tagName === "UL") {
      // Проверяем, является ли элемент <ul>
      ulSubMenuItem = liItems[i]; // Присваиваем значение
      break; // Выходим из цикла, так как нашли нужный элемент
    }
  }

  if (ulSubMenuItem) {
    //Показываем название меню и подбемню при фокусе на елементе меню
    item.addEventListener("mouseenter", () => {
      if (!isSideBarExpand()) {
        //Сравнение текущего меню с активным
        const activeMenuId = localStorage.getItem(expandSidebarActiveMenuIdKey);

        if (activeMenuId) {
          if (!item.id.includes(activeMenuId)) {
            const activeMenu = document
              .getElementById(activeMenuId)
              .closest("li");
            const activeSubMenu = activeMenu.querySelector(".serv-show");
            if (activeMenu) {
              activeSubMenu.classList.remove("show-menu");
            }
          }
        }
        setVisibleOrHideSidebarOverflow(true);

        ulSubMenuItem.classList.add("show-menu");
        localStorage.setItem(expandSidebarActiveMenuIdKey, item.id);
        changeVisibilityOfSubMenuItems(ulSubMenuItem);
      }
    });
    //Скрываем название меню и подбемню при отсутсвии фокуса на елементе меню
    item.addEventListener("mouseleave", () => {
      if (!isSideBarExpand()) {
        // Проверяем, находится ли курсор мыши на блоке item
        if (!item.matches(":hover") && !ulSubMenuItem.matches(":hover")) {
          setVisibleOrHideSidebarOverflow(false);
          ulSubMenuItem.classList.remove("show-menu");
          changeVisibilityOfSubMenuItems(ulSubMenuItem);
        }
      }
    });
    //Скрываем название меню и подбемню при отсутсвии фокуса на елементе подменю
    ulSubMenuItem.addEventListener("mouseleave", () => {
      if (!isSideBarExpand()) {
        setVisibleOrHideSidebarOverflow(false);
        ulSubMenuItem.classList.remove("show-menu");
        changeVisibilityOfSubMenuItems(ulSubMenuItem);
      }
    });
  }
});

//Функции для работы с кареткой выпадающего меню
const caretImage = document.querySelectorAll(".caret-dp-mn");

caretImage.forEach((caret) => {
  //Соседний элемент <a>
  let menuLink;
  let menuIcon;
  if (caret) {
    //Показ подменю при нажатии на каретку
    caret.addEventListener("click", () => {
      menuLink = caret.closest("li").querySelector(".serv-btn");
      menuIcon = caret.closest("li").querySelector(".sidebar-menu-icon");

      caret.classList.toggle("rotate");

      toggelerVisibilityDropMenu(menuLink);
    });

    caret.addEventListener("mouseenter", () => {
      menuLink = caret.closest("li").querySelector(".serv-btn");
      menuIcon = caret.closest("li").querySelector(".sidebar-menu-icon");

      menuLink.style.color = pageTextColorHover;
      menuLink.style.backgroundColor = sidebarMenuBackgroundColorHover;

      if (menuIcon.classList.contains("side-bar-god-svg")) {
        menuIcon.style.stroke = pageTextColorHover;
      } else {
        menuIcon.style.fill = pageTextColorHover;
      }
    });

    caret.addEventListener("mouseout", () => {
      menuLink = caret.closest("li").querySelector(".serv-btn");
      menuIcon = caret.closest("li").querySelector(".sidebar-menu-icon");

      menuLink.style.color = "";
      menuLink.style.backgroundColor = "";

      if (menuIcon.classList.contains("side-bar-god-svg")) {
        menuIcon.style.stroke = "";
      } else {
        menuIcon.style.fill = "";
      }
    });
  }
});

//Функция активации элемента подменю
const subMenuItems = document.querySelectorAll(".sidebar-submenu-item");
subMenuItems.forEach((subMenuItem) => {
  subMenuItem.addEventListener("click", () => {
    //Переменная названия подменю
    const selectedMenuOfSubMenu = subMenuItem
      .closest("ul")
      .closest("li")
      .querySelector(".sidebar-menu-item");
    const activeMenuId = localStorage.getItem(sidebarActiveMenuIdKey);
    const activeSubMenuId = localStorage.getItem(sidebarActiveSubmenuIdKey);

    //Проверка на совпадение активного меню и выбраного подменю. Если выбранное подменю относится к другому меню, деактивировать предидущее активное меню
    if (activeMenuId) {
      if (!selectedMenuOfSubMenu.id.includes(activeMenuId)) {
        findActiveSidebarMenuByTitleId(activeMenuId).classList.remove("active");
        findActiveSidebarMenuTitleById(activeMenuId).classList.remove("active");
        localStorage.setItem(sidebarActiveMenuIdKey, selectedMenuOfSubMenu.id);
      }
    }

    //Проверка на совпадение активного подменю. Если выбрано другое подменю деактивировать предидущее
    if (activeSubMenuId) {
      if (!subMenuItem.id.includes(activeSubMenuId)) {
        document.getElementById(activeSubMenuId).classList.remove("active");
      }
    }
    if (!subMenuItem.classList.contains("active")) {
      subMenuItem.classList.add("active");

      if (!subMenuItem.classList.contains("title")) {
        findActiveSidebarMenuTitleById(selectedMenuOfSubMenu.id).classList.add(
          "active"
        );
      }

      selectedMenuOfSubMenu.closest("li").classList.add("active");

      localStorage.setItem(sidebarActiveMenuIdKey, selectedMenuOfSubMenu.id);
      localStorage.setItem(sidebarActiveSubmenuIdKey, subMenuItem.id);
    }

    showOrHideSidebarContent(subMenuItem.id);
  });
});

//Функция возвращает при свёрнутом сайдбаре елемент <a> с названием меню
function findActiveSidebarMenuTitleById(activeMenuId) {
  let result;
  const activeSideBarMenuLinks = document.querySelectorAll("#" + activeMenuId);

  for (let i = 0; i < activeSideBarMenuLinks.length; i++) {
    if (activeSideBarMenuLinks[i].classList.contains("title")) {
      result = activeSideBarMenuLinks[i];
    }
  }
  return result;
}

//Функция возвращает при свёрнутом сайдбаре елемент <a> пункта меню
function findActiveSidebarMenuByTitleId(activeMenuId) {
  let result;
  const activeSideBarMenuLinks = document.querySelectorAll("#" + activeMenuId);

  for (let i = 0; i < activeSideBarMenuLinks.length; i++) {
    if (activeSideBarMenuLinks[i].classList.contains("sidebar-menu-item")) {
      result = activeSideBarMenuLinks[i].closest("li");
    }
  }
  return result;
}

//Функция включения/отключения видимости елементов подменю
function changeVisibilityOfSubMenuItems(item) {
  const links = item.querySelectorAll(".sidebar-submenu-item");
  const styleTransitionDelay = 100;
  const styleTransformIfMenuHide = "translateX(0)";
  const styleTransformIfMenuShow = "translateX(-50%)";

  for (let i = 0; i < links.length; i++) {
    if (item.classList.contains("show")) {
      if (!links[i].classList.contains("title")) {
        links[i].style.opacity = "1";
        links[i].style.visibility = "visible";
        links[i].style.transform = styleTransformIfMenuHide;
        links[i].style.transitionDelay = i * styleTransitionDelay + "ms";
      } else {
        links[i].parentElement.style.visibility = "hidden";
        links[i].parentElement.style.opacity = "0";
        links[i].parentElement.style.lineHeight = "0";
      }
    } else if (item.classList.contains("show-menu")) {
      if (!links[i].classList.contains("title")) {
        links[i].style.opacity = "1";
        links[i].style.visibility = "visible";
        links[i].style.transform = styleTransformIfMenuHide;
        links[i].style.transitionDelay = i * styleTransitionDelay + "ms";
      } else {
        links[i].parentElement.style.visibility = "visible";
        links[i].parentElement.style.opacity = "1";
        links[i].parentElement.style.lineHeight = "4vh";

        links[i].style.opacity = "1";
        links[i].style.visibility = "visible";
        links[i].style.transform = styleTransformIfMenuHide;
        links[i].style.transitionDelay = i * styleTransitionDelay + "ms";
      }
    } else {
      links[i].style.opacity = "0";
      links[i].style.visibility = "hidden";
      links[i].style.transform = styleTransformIfMenuShow;
    }
  }
}

/*
--------------------------------------------------------------------------------------------------------------------
Секция для работы с таблицами контента сайдбара
*/
const cntContainer = document.querySelector(".cabinet-content");
const ctnTables = Array.from(document.getElementsByTagName("table"));
const tblRows = document.querySelectorAll(".tbl-body-row");

//Подключение сервисов и функций для работы с таблицами контента сайдбара
ctnTables.forEach((tbl) => {
  initTableSort(tbl.id);
  tblMultiSlctCaptionService(tbl.id);
  tblMultiSlctTblService(tbl.id);
  addNewRow(tbl.id);
  searchTable(tbl.id);
});

//Подключение функции сортировки к таблице из библиотеки tablesort
function initTableSort(tblId) {
  var tbl = document.getElementById(tblId);
  var sort = new Tablesort(tbl);

  //Включение функции сортировки данных после добавление новой записи в таблицу
  sort.refresh();
}

//Переключение иконки сортировки
const tblHeaderCell = cntContainer.getElementsByTagName("th");
for (let i = 0; i < tblHeaderCell.length; i++) {
  tblHeaderCell[i].addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action of the link

    //Поиск элемента <span> класса "fas fa-caret-down first"
    const caretSpan = tblHeaderCell[i].querySelector(".fas");

    if (
      caretSpan &&
      tblHeaderCell[i].getAttribute("aria-sort").includes("ascending")
    ) {
      //Переключение класса у элемента <span> на "rotate"
      caretSpan.classList.add("rotate");
    } else if (
      caretSpan &&
      tblHeaderCell[i].getAttribute("aria-sort").includes("descending")
    ) {
      caretSpan.classList.remove("rotate");
    }
  });
}

/*
  Функция работы с чекбокса в заголовке таблице
    - При клике на чекбокс в заголовке таблицы включаем видимость чекбоксов в таблице
    - При клике на чекбокс в заголовке таблицы делаем все чекбоксы в таблице checked и наоборот
*/
function tblMultiSlctCaptionService(tblId) {
  //Чекбокс в заголовке таблицы
  const tbl = document.getElementById(tblId);
  const tblGlLbCheckboxes = tbl.querySelectorAll(".tbl-gl-lb-checkbox");

  //Убираем с чекбокса свойство disabled при клике и отображаем чекбоксы в таблице
  tblGlLbCheckboxes.forEach((checkbox) => {
    const glCheckbox = checkbox.querySelector(".tbl-gl-checkbox");
    const tbl = checkbox.closest("table");
    const tblLbCheckBoxes = tbl.querySelectorAll(".tbl-lb-checkbox");
    const glCheckboxSpan = checkbox.querySelector(".tbl-gl-checkmark");

    /*
    Прослушка клика на lable чекбокса
    - Если чекбокс в заголовке таблицы не активирован, то активируем.
    - Включаем отображение всех чекбоксов в данной таблице
    - Если чекбокс в заголовке отмечен (checked), то делаем все чекбоксы в таблице checked и наоборот
    */
    checkbox.addEventListener("click", () => {
      //Если чекбоксы не активированы, то активируем. И включаем отображение кнопки "Удалить записи"
      if (!glCheckboxSpan.classList.contains("active")) {
        glCheckboxSpan.classList.add("active");

        //Включаем видимость чекбоксов в таблице
        for (let i = 0; i < tblLbCheckBoxes.length; i++) {
          tblLbCheckBoxes[i].style.display = "block";
        }
      } else if (glCheckbox.checked) {
        //Делаем все чекбоксы в таблице checked
        for (let i = 0; i < tblLbCheckBoxes.length; i++) {
          const tblCheckBox = tblLbCheckBoxes[i].querySelector(".tbl-checkbox");
          tblCheckBox.checked = true;
        }
        showOrHideTblDeleteAllBtn(tbl.id, true);
      } else if (!glCheckbox.checked) {
        //Убираем checked со всех чекбоксов в таблице
        for (let i = 0; i < tblLbCheckBoxes.length; i++) {
          const tblCheckBox = tblLbCheckBoxes[i].querySelector(".tbl-checkbox");
          tblCheckBox.checked = false;
        }
        showOrHideTblDeleteAllBtn(tbl.id, false);
      }
    });
  });
}

/*
  Функция работы с чекбоксами в таблице
    - Отслеживание количества отмеченных чекбоксов, если больше одного, то отображаем кнопку "Удалить записи", 
      если нет, то скрываем
*/
function tblMultiSlctTblService(tblId) {
  const tbl = document.getElementById(tblId);
  const tblCheckboxes = tbl.querySelectorAll(".tbl-checkbox");
  const countCheckedboxes = {};
  countCheckedboxes[tblId] = 0;

  //Посчёт количества отмеченых чекбоксов
  tblCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      countCheckedboxes[tblId]++;
    }

    //Меняем значение переменной countCheckedboxes при изменении состояния чекбокса
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        countCheckedboxes[tblId]++;
      } else {
        countCheckedboxes[tblId]--;
      }

      //Если больше одного чекбокса отмечен, то отображаем кнопку "Удалить записи", иначе скрываем
      if (countCheckedboxes[tblId] > 1) {
        showOrHideTblDeleteAllBtn(tbl.id, true);
      } else {
        showOrHideTblDeleteAllBtn(tbl.id, false);
      }
    });
  });
}

/*
  Переключаем отображение кнопки "Удалить записи".
  Аргументы:
    tblId - идентификатор таблицы
    isShow - true - отображать, false - скрыть
*/
function showOrHideTblDeleteAllBtn(tblId, isShow) {
  const tbl = document.getElementById(tblId);
  const btn = tbl.querySelector(".tbl-btn-dlt-all");

  if (isShow) {
    btn.style.visibility = "visible";
    btn.style.opacity = 1;
    btn.style.cursor = "pointer";
  } else {
    btn.style.visibility = "hidden";
    btn.style.opacity = 0;
    btn.style.cursor = "none";
  }
}

//Кнопкаы удалить все записи
const tblBtnDltAll = document.querySelectorAll(".tbl-btn-dlt-all");

tblBtnDltAll.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tbl = btn.closest("table");
    const tblGlCheckbox = tbl.querySelector(".tbl-gl-checkbox");
    const tblData = tbl.querySelectorAll(".tbl-body-row");

    //Удаляем только те записи где чекбокс checked
    tblData.forEach((row) => {
      if (row.querySelector(".tbl-checkbox").checked) {
        row.remove();
      }
    });

    //Если чекбокс в заголовке checked убрать флажёк
    if (tblGlCheckbox.checked) {
      tblGlCheckbox.checked = false;
    }
  });
});

//Получение названия меню сайдбара с table.id
function getTblNameById(tableId) {
  return tableId.substring(0, tableId.indexOf("-"));
}

//Функция создания новой строки в таблице
function addNewRow(tblId) {
  const tbl = document.getElementById(tblId);
  //Кнопка добавления новой записи
  const btn = tbl.querySelector(".tbl-btn-add");

  btn.addEventListener("click", () => {
    const modal = getModalWillEditInformationByTblId(tblId);

    modal.querySelector("form").removeAttribute("obj-id");

    const inputFields = modal.querySelectorAll(".edit-modal-input-flield");

    inputFields.forEach((field) => {
      console.log(field);
      field.value = "";
    });

    modal.style.display = "block";
  });
}

//Создание элемента tr переданного id таблицы c новым id
function getRowFromTable(tblId) {
  const tbl = document.getElementById(tblId);
  const tblRows = tbl.querySelectorAll(".tbl-body-row");
  const tblBtnAdd = document.querySelector(".tbl-btn-add");
  const maxId = {};
  maxId[tblId] = 0;

  tblRows.forEach((row) => {
    if (row.getAttribute("data-id") > maxId[tblId]) {
      maxId[tblId] = row.getAttribute("data-id");
    }
  });
  maxId[tblId]++;
  const newRow = tbl.querySelector(".tbl-body-row").cloneNode(true);
  const rowcells = newRow.getElementsByTagName("td");
  newRow.setAttribute("data-id", maxId[tblId]);

  //Убираем текст в элементе tr
  for (let i = 1; i < rowcells.length; i++) {
    if (rowcells[i].classList.contains("tbl-row-data")) {
      rowcells[i].textContent = "";
    }
  }
  return newRow;
}

//Функция поиска по таблице
function searchTable(tblId) {
  const tbl = document.getElementById(tblId);
  const searchTblBtn = tbl.querySelector(".tbl-btn-search");

  searchTblBtn.addEventListener("click", () => {
    const query = tbl.querySelector(".tbl-search-input").value;
    console.log(`query: ${query}`);
    searchQueryInTbl(query, tblId);
  });
}

let matches = [];
function searchQueryInTbl(query, tblId) {
  const tbl = document.getElementById(tblId);
  const row = tbl.querySelector("tbody");
  matches = [];

  const cells = row.querySelectorAll("td");
  let isMatch = false;
  cells.forEach((cell) => {
    const regex = new RegExp(query, "gi");
    console.log(`cell: ${cell}`);
    console.log(`regex: ${regex}`);
    if (regex.test(cell.textContent)) {
      cell.innerHTML = cell.textContent.replace(
        regex,
        '<span class="highlight">$&</span>'
      );
      matches.push(cell);
      isMatch = true;
    }
  });
  row.style.display = isMatch ? "" : "none";
}

//Иконка редактирования записи таблицы
const editIcon = document.querySelectorAll(".tbl-edit-icon");

//Функция отображения модальных окон при клике на иконку редактирования
editIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    showModalWillEditInformation(icon.closest(".tbl-body-row"));
  });
});

//Функция вкл/выкл модального окна редактирования информации записей таблиц контента сидбара
function showModalWillEditInformation(tblRow) {
  const tblId = tblRow.closest("table").id;
  const modal = getModalWillEditInformationByTblId(tblId);
  const form = modal.querySelector("form");

  form.setAttribute("obj-id", tblRow.getAttribute("obj-id"));
  form.setAttribute("tbl-name", getTblNameById(tblId));

  modal.style.display = "block";

  // Установка значений полей в модальном окне из текущей записи
  const willIncomingDate = convertDateForEditForm(
    tblRow.querySelector(".will-incoming-date").textContent.trim()
  );

  const willDescription = tblRow
    .querySelector(".will-brief-description")
    .textContent.trim();
  const willComment = tblRow.querySelector(".will-comment").textContent.trim();

  document.getElementById("edit-will-incoming-date").value = willIncomingDate;
  document.getElementById("edit-will-brief-description").value =
    willDescription;
  document.getElementById("edit-will-comment").value = willComment;
}

//Функция получения элемента модального окна создания/редактирования записи таблицы "Воля"
function getModalWillEditInformationByTblId(tblId) {
  const modalId = tblId.substring(0, tblId.indexOf("-")) + "-edit-information";
  return document.getElementById(modalId);
}

//Функция конвертации даты с формата дд.мм.гггг в формат гггг-мм-дд
function convertDateForEditForm(date) {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
}

//Функция конвертации даты с формата гггг-мм-дд в формат дд.мм.гггг
function convertDateForTbl(date) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

//Функция отслеживания высоты модального окна редактирования информации записей таблиц контента сайдбара
function changeModalEditInformationHeight() {
  const modalDialog = document.querySelector(".edit-modal-dialog");
  const observer = new ResizeObserver(() => {
    let modalBody = document.querySelector(".edit-modal-body");
    modalDialog.style.height = modalBody.scrollHeight + 200 + "px";
  });

  observer.observe(document.querySelector(".edit-modal-body"));
}

//Закрытие модального окна
const closeIcon = document.querySelectorAll(".edit-modal-close-icon");
closeIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    const modal = icon.closest("section");

    modal.style.display = "none";
  });
});

//Функция сохранения отредактированных данных таблицы
const editModalSaveBtn = document.querySelectorAll(".edit-modal-save-btn");

editModalSaveBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const form = btn.closest("form");
    const objectId = form.getAttribute("obj-id");
    const inputFields = form.querySelectorAll(".edit-modal-input-flield");
    const tblId = form.getAttribute("tbl-name") + "-tbl";
    const tbl = document.getElementById(tblId);
    const rows = tbl.querySelectorAll(".tbl-body-row");
    let row;
    let isNewRow = true;

    rows.forEach((tblRow) => {
      if (tblRow.getAttribute("obj-id") == objectId) {
        isNewRow = false;
        row = tblRow;
      }
    });

    if (isNewRow) {
      const row = getRowFromTable(tblId);
      row.setAttribute("obj-id", objectId);
      setTblRowValuesFromInputFields(row, inputFields);
      tbl.querySelector("tbody").appendChild(row);
    } else {
      setTblRowValuesFromInputFields(row, inputFields);
    }
    btn.closest(".edit-modal-container").style.display = "none";
  });
});

//Функция записи введённых данных в строку таблицы
function setTblRowValuesFromInputFields(row, inputFields) {
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].type == "date") {
      row.children[i + 1].textContent = convertDateForTbl(inputFields[i].value);
    } else {
      row.children[i + 1].textContent = inputFields[i].value;
    }
  }
}

//Функция удаления записи с таблицы
const deleteTblIcon = document.querySelectorAll(".tbl-dlt-icon");

deleteTblIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    const cell = icon.closest("tr");
    if (cell) {
      cell.remove();
      console.log("Cell removed");
    } else {
      console.log("Cell not found");
    }
  });
});
