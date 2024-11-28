// Изменение цвета логотипа Єгрегора и названия Школы при наведении или на логотип или на текст

document.querySelector(".al-vadud").onmouseover = function () {
  document.querySelector(".school-name").style.color = "gold";
  document.querySelector(".al-vadud").style.fill = "gold";
};
document.querySelector(".al-vadud").onmouseout = function () {
  document.querySelector(".school-name").style.color = "rgb(230, 98, 98)";
  document.querySelector(".al-vadud").style.fill = "red";
};

document.querySelector(".school-name").onmouseover = function () {
  document.querySelector(".school-name").style.color = "gold";
  document.querySelector(".al-vadud").style.fill = "gold";
};
document.querySelector(".school-name").onmouseout = function () {
  document.querySelector(".school-name").style.color = "rgb(230, 98, 98)";
  document.querySelector(".al-vadud").style.fill = "red";
};

// Изменение цвета логотипа незарегистрированого юзера
document.querySelector("#user").onmouseover = function () {
  document.querySelector("#user").style.fill = "gold";
};
document.querySelector("#user").onmouseout = function () {
  document.querySelector("#user").style.fill = "#4b4c4d";
};

//Search box
const body = (searchToggle = document.querySelector(".searchToggle"));

// js code to toggle search box
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

function check() {
  var rarr = document.getElementsByName("action");
  const c1 = document.getElementsByClassName("signin-span");
  const c2 = document.getElementsByClassName("signup-span");
  const c3 = document.getElementsByClassName("reset-span");
  if (rarr[0].checked) {
    c1.style.display = "block";
  }
  if (rarr[1].checked) {
    c2.style.display = "block";
  }
  if (rarr[2].checked) {
    c3.style.display = "block";
  }
}
