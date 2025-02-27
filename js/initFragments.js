import { pageTextColorHover } from "./cssVariables.js";
import { alVadudTextColor } from "./cssVariables.js";

//Функция иморта хедера
fetch("/fragments/header.txt")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("page-header").innerHTML = data;
    initHeaderJS(); // Инициализация JavaScript из модуля
  })
  .catch((error) => console.error("Ошибка загрузки header:", error));

//Функция иморта футера
fetch("/fragments/footer.txt")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("page-footer").innerHTML = data;
    initFooterJS(); // Инициализация JavaScript из модуля
  })
  .catch((error) => console.error("Ошибка загрузки footer:", error));

//Хедер
function initHeaderJS() {
  // Изменение цвета логотипа Єгрегора и названия Школы при наведении или на логотип или на текст
  const alVadudIcon = document.querySelector(".al-vadud");
  const shcoolName = document.querySelector(".school-name");
  alVadudIcon.onmouseover = function () {
    changeLogoColor(true);
  };
  alVadudIcon.onmouseout = function () {
    changeLogoColor(false);
  };

  shcoolName.onmouseover = function () {
    changeLogoColor(true);
  };
  shcoolName.onmouseout = function () {
    changeLogoColor(false);
  };

  function changeLogoColor(isFocuse) {
    const alVadudIcon = document.querySelector(".al-vadud");
    const shcoolName = document.querySelector(".school-name");
    if (isFocuse) {
      shcoolName.style.color = pageTextColorHover;
      alVadudIcon.style.fill = pageTextColorHover;
      alVadudIcon.style.stroke = pageTextColorHover;
    } else {
      shcoolName.style.color = alVadudTextColor;
      alVadudIcon.style.fill = alVadudTextColor;
    }
  }

  //Контейнер поиска по сайту
  const searchToggle = document.querySelector(".searchToggle");

  searchToggle.addEventListener("click", () => {
    searchToggle.classList.toggle("active");
  });

  //------------------------------------------

  // Переключатель меню входа юзера и меню уведомлений
  // Переменная для определения авторизации пользователя
  let userAuthorization = true;

  // Элементы HTML
  const userIcon = document.getElementById("user"); // SVG с классом user
  const signInContainer = document.querySelector(".sign-in-container");
  const userInformationContainer = document.getElementById(
    "user-information-container"
  );
  const signInCancelButton = document.querySelector(".sign-in-form-cancel");
  const userInformationCancelButton = document.querySelector(
    ".user-information-form-cancel"
  );
  // Функция для обработки нажатия на SVG
  if (userIcon) {
    userIcon.addEventListener("click", () => {
      if (userAuthorization) {
        // Если пользователь авторизован, показать контейнер уведомлений
        if (userInformationContainer.style.display == "none") {
          signInContainer.style.display = "none";
          userInformationContainer.style.display = "block";
        } else {
          userInformationContainer.style.display = "none";
        }
      } else {
        // Если пользователь не авторизован, показать контейнер входа
        if (signInContainer.style.display == "none") {
          signInContainer.style.display = "block";
          userInformationContainer.style.display = "none";
        } else {
          signInContainer.style.display = "none";
        }
      }
    });
  }
  //Функция скрытия формы при нажатии на крестик
  if (signInCancelButton) {
    signInCancelButton.addEventListener("click", () => {
      signInContainer.style.display = "none";
    });
  }

  if (userInformationCancelButton) {
    userInformationCancelButton.addEventListener("click", () => {
      userInformationContainer.style.display = "none";
    });
  }
  /*
        Переключение форм входа юзера и информации о юзере. При нажатии на кнопку "выйти" и последующем обновлении страницы в информации о юзере будет 
        отображаться форма регистрации юзера.
        При нажатии на кнопку "войти" в форме регистрации юзера, при следующем обновлении страницы будет отображаться форма информации о юзере
    */
  const signOutLink = document.querySelector(".sign-out-link");
  const signInButton = document.querySelector(".sign-in-button");

  signOutLink.addEventListener("click", () => {
    userAuthorization = false;
  });

  signInButton.addEventListener("click", () => {
    userAuthorization = true;
  });

  //------------------------------------------
  // Переключатель меню уведомлений

  // Элементы HTML
  const notificationIcon = document.querySelector(".notification-svg"); // SVG с классом user
  const notificationContainer = document.querySelector(
    ".notification-container"
  );
  const notificationCancelButton = document.querySelector(
    ".notification-form-cancel"
  );

  // Функция для обработки нажатия на SVG
  notificationIcon.addEventListener("click", () => {
    if (notificationContainer.style.display == "none") {
      notificationContainer.style.display = "block";
    } else {
      notificationContainer.style.display = "none";
    }
  });

  notificationCancelButton.addEventListener("click", () => {
    notificationContainer.style.display = "none";
  });

  //------------------------------------------
  //Изменения видимости пароля в форме входа юзера
  const showPasswordIcon = document.querySelector("#show-password");
  const hidePasswordIcon = document.querySelector("#hide-password");
  const passwordInputField = document.querySelector("#pass");

  if (showPasswordIcon) {
    showPasswordIcon.addEventListener("click", () => {
      hidePasswordIcon.style.display = "block";
      showPasswordIcon.style.display = "none";
      passwordInputField.setAttribute("type", "password");
    });
  }

  if (hidePasswordIcon) {
    hidePasswordIcon.addEventListener("click", () => {
      hidePasswordIcon.style.display = "none";
      showPasswordIcon.style.display = "block";
      passwordInputField.setAttribute("type", "text");
    });
  }
}

//Футер
function initFooterJS() {
  document.querySelector(".copyright").textContent +=
    " " + new Date().getFullYear();
}
