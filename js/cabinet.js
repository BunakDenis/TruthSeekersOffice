$(".btn").click(function () {
  $(this).toggleClass("click");
  $(".sidebar").toggleClass("show");

  if (
    document.querySelector(".fa-circle-arrow-right").style.display == "none"
  ) {
    document.querySelector(".fa-circle-arrow-right").style.display = "block";
    document.querySelector(".fa-circle-arrow-left").style.display = "none";
    document.querySelector(".cabinet-content").style.left = "1%";
    document.querySelector(".cabinet-content").style.width = "98%";
  } else {
    document.querySelector(".fa-circle-arrow-right").style.display = "none";
    document.querySelector(".fa-circle-arrow-left").style.display = "block";
    document.querySelector(".cabinet-content").style.left = "19%";
    document.querySelector(".cabinet-content").style.width = "80%";
  }
});

//Sidebar function showing dropdown menu
const featButtons = document.querySelectorAll(".serv-btn");

featButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action of the link

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
