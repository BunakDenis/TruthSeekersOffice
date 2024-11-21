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

//Search box
const body = (searchToggle = document.querySelector(".searchToggle"));

// js code to toggle search box
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});
