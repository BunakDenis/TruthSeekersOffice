//Переключение видимости сайдбара
$(".btn").click(function () {
  $(this).toggleClass("click");
  $(".sidebar").toggleClass("show");
  $(".fa-circle-arrow-right").toggleClass("rotate");

  if ($(".fa-circle-arrow-right").hasClass("rotate")) {
    $(".cabinet-content").removeClass("hide-sidebar");
  } else {
    $(".cabinet-content").addClass("hide-sidebar");
  }
});

//Переменная со всеми елементами главного меню сайдбара
const sidebarMenuItems = document.querySelectorAll(".sidebar-menu-item");
//Переменная-ключ для добавления контента активного меню сайдбара
const sidebarMenuItemIdKey = "sidebar-content-id";

//Прослушка главного меню сайдбара на клик
sidebarMenuItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    //ID выбранного главного меню сайдбара
    const itemId = event.target.id;

    //ID соответствующего контейнера контента меню сайдбара
    const itemContent = document.getElementById(`${itemId}-content`);

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
      } else {
        $(".cabinet-content").addClass("hide-sidebar");
      }
      itemContent.style.display = "block";
      document.querySelector(".cabinet-content").style.display = "block";
      localStorage.setItem(sidebarMenuItemIdKey, itemContent.id);
    }
  });
});

//Sidebar function showing dropdown menu
const featButtons = document.querySelectorAll(".serv-btn");

featButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action of the link
    const elementId = event.target.id;
    //console.log(elementId);
    // Find the parent li element
    const parentLi = button.closest("li");

    // Find the child element with the class "feat-show"
    const featShowElement = parentLi.querySelector(".serv-show");

    if (featShowElement) {
      // Toggle the "show" class
      featShowElement.classList.toggle("show");
    }

    // Find the span element with the class "fas fa-caret-down first"
    const caretSpan = button.querySelector(".fas");

    if (caretSpan) {
      // Toggle the "rotate" class
      caretSpan.classList.toggle("rotate");
    }
  });
});

$("aside ul li").click(function () {
  $(this).addClass("active").siblings().removeClass("active");
});

//Sidebar function show or hide menu
let sidebar = document.querySelector(".sidebar");
let sidebarOpenBtn = document.querySelector(".bxs-chevron-right-circle");
let sidebarCloseBtn = document.querySelector(".bxs-chevron-left-circle");

sidebarOpenBtn.addEventListener("click", () => {
  sidebarOpenBtn.style.display = "none";
  sidebarCloseBtn.style.display = "block";
  sidebar.classList.toggle("close");
});

sidebarCloseBtn.addEventListener("click", () => {
  sidebarOpenBtn.style.display = "block";
  sidebarCloseBtn.style.display = "none";
  sidebar.classList.toggle("close");
});
