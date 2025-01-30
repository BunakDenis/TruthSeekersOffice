function hideSideBarItemText() {
  const textMenuItem = document.querySelectorAll(".sidebar-menu-item-text");
  const caretMenuItem = document.querySelectorAll(".fa-caret-down");

  if ($(".serv-show").hasClass("show")) {
    $(".serv-show").removeClass("show");
    $(".fa-caret-down").removeClass("rotate");
  }

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

function showSideBarItemText() {
  const textMenuItem = document.querySelectorAll(".sidebar-menu-item-text");
  const caretMenuItem = document.querySelectorAll(".fa-caret-down");

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
}

//Переключение видимости сайдбара
$(".btn").click(function () {
  $(this).toggleClass("click");
  $(".sidebar").toggleClass("show");
  $(".fa-circle-arrow-right").toggleClass("rotate");

  if ($(".fa-circle-arrow-right").hasClass("rotate")) {
    $(".cabinet-content").removeClass("hide-sidebar");
    showSideBarItemText();
  } else {
    $(".cabinet-content").addClass("hide-sidebar");
    hideSideBarItemText();
  }
});

//Переменная со всеми елементами главного меню сайдбара
const sidebarMenuItems = document.querySelectorAll(".sidebar-menu-item");
//Переменная-ключ для добавления контента активного меню сайдбара
const sidebarMenuItemIdKey = "sidebar-content-id";

//Прослушка главного меню сайдбара на клик
sidebarMenuItems.forEach((item) => {
  //ID ссыдки выбранного главного меню сайдбара
  const itemId = item.closest("a").id;
  //Елемент Li выбранного главного меню сайдбара
  const liItem = item.closest("li");
  const liItems = item.closest("li").children;

  //Показываем/скрываем контент при нажатии на меню или подменю
  item.addEventListener("click", (event) => {
    event.preventDefault();

    //ID соответствующего контейнера контента меню сайдбара
    const itemContent = document.getElementById(`${itemId}-sidebar-content`);

    //Скрываем текущий активный контент
    if (itemContent) {
      if (localStorage.length > 0) {
        const sidebarMenuItemContent = document.getElementById(
          localStorage.getItem(sidebarMenuItemIdKey)
        );

        if (sidebarMenuItemContent) {
          sidebarMenuItemContent.style.display = "none";
          localStorage.removeItem(sidebarMenuItemIdKey);
        }
      }
      //Показываем контент выбраного главного меню сайдбара
      if ($(".fa-circle-arrow-right").hasClass("rotate")) {
        $(".cabinet-content").removeClass("hide-sidebar");
        showSideBarItemText();
      } else {
        $(".cabinet-content").addClass("hide-sidebar");
        hideSideBarItemText();
      }
      itemContent.style.display = "block";
      document.querySelector(".cabinet-content").style.display = "block";
      localStorage.setItem(sidebarMenuItemIdKey, itemContent.id);
    }
  });

  //Показываем/скрываем название меню и подбемню при нажатии на елемент меню
  item.addEventListener("mouseenter", () => {
    if (!$(".sidebar").hasClass("show")) {
      liItem.classList.toggle("show-menu");
      //Перебор елементов выбранного меню li
      for (let i = 0; i < liItems.length; i++) {
        //Если в елементах есть елемент с тего <a> перебераем вложенные в него елементы
        if (liItems[i].tagName == "A") {
          const aChildrens = liItems[i].children;

          for (let j = 0; j < aChildrens.length; j++) {
            //Отключаем все елементы кроме <svg> и <i>
            if (
              !aChildrens[j].tagName.toLocaleLowerCase().includes("svg") &&
              !aChildrens[j].tagName.toLocaleLowerCase().includes("i")
            ) {
              aChildrens[j].style.display = "inline-block";
            }
          }
        } else {
          liItems[i].classList.toggle("show");
        }
      }
    }
  });

  item.addEventListener("mouseleave", () => {
    if (!$(".sidebar").hasClass("show")) {
      liItem.classList.toggle("show-menu");
      //Перебор елементов выбранного меню li
      for (let i = 0; i < liItems.length; i++) {
        //Если в елементах есть елемент с тего <a> перебераем вложенные в него елементы
        if (liItems[i].tagName == "A") {
          const aChildrens = liItems[i].children;

          for (let j = 0; j < aChildrens.length; j++) {
            //Отключаем все елементы кроме <svg> и <i>
            if (
              !aChildrens[j].tagName.toLocaleLowerCase().includes("svg") &&
              !aChildrens[j].tagName.toLocaleLowerCase().includes("i")
            ) {
              console.log(aChildrens[j].tagName);
              console.log("aChildrens[j].tagName.includes(svg)");
              console.log(
                !aChildrens[j].tagName.toLocaleLowerCase().includes("svg")
              );
              aChildrens[j].style.display = "none";
            }
          }
        } else {
          liItems[i].classList.toggle("show");
        }
      }
    }
  });
});

//Sidebar function showing dropdown menu
const featButtons = document.querySelectorAll(".serv-btn");

featButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action of the link

    if ($(".sidebar").hasClass("show")) {
      // Find the parent li element
      const parentLi = button.closest("li");

      // Find the child element with the class "feat-show"
      const featShowElement = parentLi.querySelector(".serv-show");
      const textShowElement = parentLi.querySelector(".sidebar-menu-item-text");

      if (featShowElement) {
        if (textShowElement.style.display != "none") {
          // Toggle the "show" class
          featShowElement.classList.toggle("show");

          // Find the span element with the class "fas fa-caret-down first"
          const caretSpan = button.querySelector(".fas");

          if (caretSpan) {
            // Toggle the "rotate" class
            caretSpan.classList.toggle("rotate");
          }
        }
      }
    }
  });
});

//Переключение иконки сортировки
const tblTitleLinks = document.querySelectorAll(".tbl-title-link");

tblTitleLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action of the link

    // Find the span element with the class "fas fa-caret-down first"
    const caretSpan = link.querySelector(".fas");
    console.log(caretSpan);

    if (caretSpan) {
      // Toggle the "rotate" class
      caretSpan.classList.toggle("rotate");
    }
  });
});

//Редактирование информации про Волю
function showSeekerWillDetailInformation() {
  $(".seeker-will-information").css("display", "flex");
}
function hideSeekerWillDetailInformation() {
  $(".seeker-will-information").css("display", "none");
}
