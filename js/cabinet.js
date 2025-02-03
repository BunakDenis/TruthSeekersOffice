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
  const itemContent = document.getElementById(`${itemId}-sidebar-content`);
  console.log("itemContent");
  console.log(itemContent);
  //Скрываем текущий активный контент
  if (itemContent) {
    //ID текущего активного контента меню сайдбара
    const activeItemContentId = localStorage.getItem(
      sidebarMenuActiveContentIdKey
    );

    //Проверка на совпадение активного контента с выбранным
    //Если выбрано другое меню, отключаем текущий активный контент и отображаем выбранный
    if (!activeItemContentId.includes(itemContent.id)) {
      const activeItemContent = document.getElementById(activeItemContentId);
      activeItemContent.style.display = "none";
      localStorage.removeItem(sidebarMenuActiveContentIdKey);
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
  }
  $(".cabinet-content").toggleClass("expand-sidebar");
});

//Переменная-ключ для добавления контента активного меню сайдбара
const activeMenuKey = "sidebar-active-menu";

function toggelerVisibilityDropMenu(item) {
  if (isSideBarExpand) {
    //Инициализация родительского <li> элемента
    const parentLi = item.closest("li");
    //Инициализация элемента <ul> выпадающего меню
    const servShowElement = parentLi.querySelector(".serv-show");
    //Инициализация элемента <span> главного меню - каретка отображения открытого/закрытого меню
    const caretSpan = item.querySelector(".fas");

    //Проверка элемента <ul>
    if (servShowElement) {
      //Переключение видимости подменю
      servShowElement.classList.toggle("show");
      //Проверка развёрнуто ли подменю
      if ($(servShowElement).hasClass("show")) {
        parentLi.classList.toggle("active");

        //С localStorage берём предидущее активное меню
        const activeMenuId = localStorage.getItem(activeMenuKey);
        const activeMenu = document.getElementById(activeMenuId).closest("li");

        //Проверка инициализации предидущего активного меню и на совпадение с текущим активированым меню
        if (activeMenu && !item.id.includes(activeMenuId)) {
          //Проверка активно ли сейчас меню
          if ($(activeMenu).hasClass("active")) {
            activeMenu.classList.toggle("active");
            localStorage.removeItem(activeMenuKey);
          }
          localStorage.setItem(activeMenuKey, item.id);
        }
      } else {
        if ($(parentLi).hasClass("active")) {
          parentLi.classList.toggle("active");
        }
      }

      if (caretSpan) {
        //Переключение положения каретки
        caretSpan.classList.toggle("rotate");
      }
    }
  }
}

//Переменная со всеми елементами главного меню сайдбара
const sidebarMenuItems = document.querySelectorAll(".sidebar-menu-item");
const sidebarActiveMenuIdKey = "sidebar-menu-id";
const sidebarActiveSubmenuIdKey = "sidebar-submenu-id";

//Прослушка главного меню сайдбара на клик
sidebarMenuItems.forEach((item) => {
  //ID ссыkки выбранного главного меню сайдбара
  const itemId = item.closest("a").id;
  //Елемент Li выбранного главного меню сайдбара
  const liItem = item.closest("li");
  const liItems = liItem.children;

  //Показываем/скрываем контент при нажатии на меню или подменю
  item.addEventListener("click", (event) => {
    event.preventDefault();

    toggelerVisibilityDropMenu(item);

    showOrHideSidebarContent(item.id);
  });

  let showMenuTimeout; // Таймер для отображения меню
  let hideMenuTimeout; // Таймер для скрытия меню
  const subMenuShowingTimeOut = 300;
  let ulSubMenuItem = null;

  for (let i = 0; i < liItems.length; i++) {
    if (liItems[i].tagName === "UL") {
      // Проверяем, является ли элемент <ul>
      ulSubMenuItem = liItems[i]; // Присваиваем значение
      break; // Выходим из цикла, так как нашли нужный элемент
    }
  }

  if (ulSubMenuItem) {
    //Показываем/скрываем название меню и подбемню при фокусе на елементе меню
    item.addEventListener("mouseenter", () => {
      if (!isSideBarExpand()) {
        //Сравнение текущего меню с активным
        const activeMenuId = localStorage.getItem(sidebarActiveMenuIdKey);

        if (activeMenuId) {
          if (!item.id.includes(activeMenuId)) {
            const activeMenu = document
              .getElementById(activeMenuId)
              .closest("li");
            const activeSubMenu = activeMenu.querySelector(".serv-show");
            if (activeMenu) {
              activeMenu.classList.remove("active");
              activeSubMenu.classList.remove("show-menu");
            }
            localStorage.setItem(sidebarActiveMenuIdKey, item.id);
          }
        }
        // Отменяем таймер скрытия меню, если он активен
        clearTimeout(hideMenuTimeout);

        // Устанавливаем задержку перед отображением меню
        showMenuTimeout = setTimeout(() => {
          setVisibleOrHideSidebarOverflow(true);

          ulSubMenuItem.classList.add("show-menu");
          item.closest("li").classList.add("active");
          localStorage.setItem(sidebarActiveMenuIdKey, item.id);
        }, subMenuShowingTimeOut); // Задержка 300 мс
      }
    });

    item.addEventListener("mouseleave", () => {
      if (!isSideBarExpand()) {
        // Отменяем таймер отображения меню, если он активен
        clearTimeout(showMenuTimeout);

        // Устанавливаем задержку перед скрытием меню
        hideMenuTimeout = setTimeout(() => {
          // Проверяем, находится ли курсор мыши на блоке item
          if (!item.matches(":hover") && !ulSubMenuItem.matches(":hover")) {
            setVisibleOrHideSidebarOverflow(false);
            ulSubMenuItem.classList.remove("show-menu");
          }
        }, subMenuShowingTimeOut); // Задержка 300 мс
      }
    });

    ulSubMenuItem.addEventListener("mouseleave", () => {
      if (!isSideBarExpand()) {
        // Отменяем таймер отображения меню, если он активен
        clearTimeout(showMenuTimeout);

        // Устанавливаем задержку перед скрытием меню
        hideMenuTimeout = setTimeout(() => {
          // Проверяем, находится ли курсор мыши на блоке ulSubMenuItem
          setVisibleOrHideSidebarOverflow(false);
          item.closest("li").classList.remove("active");
          ulSubMenuItem.classList.remove("show-menu");
        }, subMenuShowingTimeOut); // Задержка 300 мс
      }
    });
  }
});

//Функция активации элемента подменю
const subMenuItems = document.querySelectorAll(".sidebar-submenu-item");
//Переменная-ключ активного подменю сайдбара
const activeSubMenuKey = "sb-act-sub-menu";
subMenuItems.forEach((subMenuItem) => {
  subMenuItem.addEventListener("click", () => {
    //Переменная названия подменю
    const selectedMenuIdOfSubMenu = subMenuItem
      .closest("ul")
      .closest("li")
      .querySelector(".sidebar-menu-item").id;
    const selectedSubMenuId = subMenuItem.id;
    const activeMenuId = localStorage.getItem(activeMenuKey);
    const activeSubMenuId = localStorage.getItem(activeSubMenuKey);

    //Проверка на совпадение активного меню и выбраного подменю. Если выбранное подменю относится к другому меню, деактивировать предидущее активное меню
    if (activeMenuId) {
      if (!selectedMenuIdOfSubMenu.includes(activeMenuId)) {
        document.getElementById(activeMenuId).classList.remove("active");
        localStorage.removeItem(activeMenuId);
      }
    }

    //Проверка на совпадение активного подменю. Если выбрано другое подменю деактивировать предидущее
    if (activeSubMenuId) {
      if (!selectedSubMenuId.includes(activeSubMenuId)) {
        document.getElementById(activeSubMenuId).classList.remove("active");
        localStorage.removeItem(activeSubMenuKey);
      }
    }

    if (!$(subMenuItem).hasClass("active")) {
      subMenuItem.classList.add("active");
      localStorage.setItem(activeSubMenuKey, subMenuItem.id);
    }

    showOrHideSidebarContent(selectedSubMenuId);
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
