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
      $(".cabinet-content").addClass("expand-sidebar");
    } else {
      $(".cabinet-content").removeClass("expand-sidebar");
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
const caretImage = document.querySelectorAll(".fa-caret-down");

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

//Модальные окна редактирования информации записей таблиц контента сайдбара
const editIcon = document.querySelectorAll(".cnt-edit-icon");
const closeIcon = document.querySelectorAll(".edit-information-close-icon");

//Функция отображения модальных окон при клике на иконку редактирования
editIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    const iconId = icon.id;
    const modalId = iconId.substring(0, iconId.indexOf("-icon"));
    const modal = document.querySelector("." + modalId + "-information");

    modal.style.display = "block";

    // Установка значений полей в модальном окне из текущей записи
    const willIncomingDate = icon
      .closest("tr")
      .querySelector(".will-incoming-date")
      .textContent.trim();
    const willDescription = icon
      .closest("tr")
      .querySelector(".will-brief-description")
      .textContent.trim();
    const willComment = icon
      .closest("tr")
      .querySelector(".will-comment")
      .textContent.trim();

    document.getElementById("edit-will-incoming-date").value = willIncomingDate;
    document.getElementById("edit-will-brief-description").value =
      willDescription;
    document.getElementById("edit-will-comment").value = willComment;
  });
});

//Закрытие модального окна
closeIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    const modal = icon.closest("section");

    modal.style.display = "none";
  });
});

//Переключение иконки сортировки
const tblTitleLinks = document.querySelectorAll(".tbl-title-link");

tblTitleLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action of the link

    //Поиск элемента <span> класса "fas fa-caret-down first"
    const caretSpan = link.querySelector(".fas");

    if (caretSpan) {
      //Переключение класса у элемента <span> на "rotate"
      caretSpan.classList.toggle("rotate");
    }
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

//Функция отображения модального окна
function showEditModalForm(row) {
  const modal = document.querySelector(".edit-modal-container");
  const inputFields = modal.querySelectorAll(".edit-modal-input-flield");

  const table = row.getTable();
  const rowData = row.getData(); // получаем данные строки
  const columns = table.getColumns(); // получаем все колонки таблицы

  for (let i = 0; i < columns.length; i++) {
    const columnName = columns[i].getField(); // получаем название колонки
    const columnValue = rowData[columnName]; // получаем значение колонки
    console.log(
      `Название колонки : ${columnName}, Значение колонки : ${columnValue}`
    );
    if (i == 0) {
      modal.getElementsByTagName("form")[0].setAttribute("obj-id", columnValue);
    } else {
      inputFields[i - 1].value = columnValue;
    }
  }

  modal.style.display = "block";
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
/*
--------------------------------------------------------------------------------------------------------------------
Секция для работы с таблицами контента сайдбара
*/
//Константы
const TABLE_NAME_PREFIX = "tbl";
const LOCALSTORAGE_TABLE_NAME_KEY = "sb-cnt-act-tbl-name";

//Переменные
var generalResltTbl;
var generalResltTblData;

//Функция загрузки данных для таблицы "Общие результаты" из JSON файла
async function loadData() {
  try {
    const response = await fetch("../examples/json/news.json");
    const jsonData = await response.json(); // Парсим JSON
    const newsData = jsonData.news; // Извлекаем только поле "news"
    return JSON.stringify(newsData); // Возвращаем как текст
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
}

//Инициализация таблицы "Общие результаты" с данными
async function initializeTable() {
  const generalResltTblData = await loadData();

  if (generalResltTblData) {
    //create Tabulator on DOM element with id "general-results-tbl"
    generalResltTbl = new Tabulator("#general-results-tbl", {
      height: "auto", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
      placeholder: "Доступных новостей ещё нет...",
      data: generalResltTblData, //assign data to table
      layout: "fitColumns", //fit columns to width of table (optional)
      columns: [
        //Define Table Columns
        { title: "Название статьи", field: "title" },
        {
          title: "Краткое описание",
          field: "summary",
          hozAlign: "left",
        },
        {
          title: "Дата публикации",
          field: "publish_date",
          hozAlign: "center",
          sorter: "datetime",
          sorterParams: {
            format: "yyyy-MM-dd HH:mm:ss",
            alignEmptyValues: "top",
          },
        },
        {
          title: "Автор",
          field: "author",
          hozAlign: "left",
        },
      ],
    });
  } else {
    console.error("Не удалось загрузить данные для таблицы");
  }
}

// Вызываем функцию инициализации таблицы "Общие результаты"
initializeTable();

//Инициализация данных таблицы "Воля"
var willTabledata = [
  {
    id: 1,
    dateOfReceipt: "2025-01-10",
    briefDescription: "Сайт - Кабинет Искателя",
    comment: "По ощущениям нужно сделать до конца весны 2025 года",
  },
];

//Инициализация таблицы Воля
var willTbl = new Tabulator("#will-tbl", {
  height: "auto", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
  placeholder: "Данных про Волю пока ещё нет...",
  data: willTabledata, //assign data to table
  layout: "fitColumns", //fit columns to width of table (optional)
  columns: [
    //Define Table Columns
    { title: "ID", field: "id", visible: false },
    {
      title: "Дата получения",
      field: "dateOfReceipt",
      formatter: "datetime",
      formatterParams: {
        inputFormat: "yyyy-MM-dd",
        outputFormat: "dd/MM/yyyy",
      },
    },
    {
      title: "Краткое описание",
      field: "briefDescription",
      hozAlign: "left",
    },
    { title: "Коментарий", field: "comment", hozAlign: "left" },
  ],
});

//Вызов модальной формы редактирования записи при клике на строку таблицы
willTbl.on("rowClick", function (e, row) {
  localStorage.setItem(LOCALSTORAGE_TABLE_NAME_KEY, willTbl);
  showEditModalForm(row);
});

//Функция сохранения отредактированных данных таблицы
const editSbCntBtn = document.querySelectorAll(".edit-sb-ctn-save-btn");

editSbCntBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const form = btn.closest("form");
    const inputFields = form.querySelectorAll(".edit-modal-input-flield");
    const tblId = "#" + form.getAttribute("tbl-name") + "-tbl";
    const table = Tabulator.findTable(tblId)[0];
    const columns = table.getColumns();

    //Объект для обновления данных в таблице
    const cell = new Object();

    //Записываем id объекта, который храниться в атрибуте формы "obj-id"
    cell.id = form.getAttribute("obj-id");

    for (let i = 0; i < inputFields.length; i++) {
      const columnName = columns[i + 1].getField(); // получаем название колонки
      const inputValue = inputFields[i].value; // получаем значение колонки

      cell[columnName] = inputValue;
    }

    table.updateData("[" + JSON.stringify(cell) + "]");

    btn.closest(".edit-modal-container").style.display = "none";
  });
});
