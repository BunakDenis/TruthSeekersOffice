/*--------------------------------------------------*/

/* Page - User Profile */

function editPersonalInfomation(inputId) {
  const inputField = document.querySelector(inputId);
  inputField.disabled = !inputField.disabled;
}

function cancelEditedProfileInfo(inputId) {
  const inputField = document.querySelector(inputId);
  inputField.value = "";
}
function showSeekerDetailInformation() {
  $(".profile-seeker-detail-information").css("display", "flex");
}
function hideSeekerDetailInformation() {
  $(".profile-seeker-detail-information").css("display", "none");
}

/*--------------------------------------------------*/

// Изменение цвета логотипа Єгрегора и названия Школы при наведении или на логотип или на текст

document.querySelector(".al-vadud").onmouseover = function () {
  document.querySelector(".school-name").style.color = "gold";
  document.querySelector(".al-vadud").style.fill = "gold";
  document.querySelector(".al-vadud").style.stroke = "gold";
};
document.querySelector(".al-vadud").onmouseout = function () {
  document.querySelector(".school-name").style.color = "rgb(230, 98, 98)";
  document.querySelector(".al-vadud").style.fill = "red";
  document.querySelector(".al-vadud").style.border = "none";
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

// Изменение цвета логотипа уведомлений
document.querySelector(".notification-svg").onmouseover = function () {
  document.querySelector(".notification-svg").style.fill = "gold";
};
document.querySelector(".notification-svg").onmouseout = function () {
  document.querySelector(".notification-svg").style.fill = "#4b4c4d";
};

//Контейнер поиска по сайту
const searchBox = (searchToggle = document.querySelector(".searchToggle"));

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

//Функция скрытия формы при нажатии на крестик
signInCancelButton.addEventListener("click", () => {
  signInContainer.style.display = "none";
});

userInformationCancelButton.addEventListener("click", () => {
  userInformationContainer.style.display = "none";
});

/*Переключение форм входа юзера и информации о юзере. При нажатии на кнопку "выйти" и последующем обновлении страницы в информации о юзере будет 
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
const notificationContainer = document.querySelector(".notification-container");
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
$("body").on("click", "#hide-password", function () {
  if ($(this).is(":hover")) {
    $("#pass").attr("type", "text");
    document.querySelector("#hide-password").style.display = "none";
    document.querySelector("#show-password").style.display = "block";
  }
});
$("body").on("click", "#show-password", function () {
  if ($(this).is(":hover")) {
    $("#pass").attr("type", "password");
    document.querySelector("#hide-password").style.display = "block";
    document.querySelector("#show-password").style.display = "none";
  }
});

//------------------------------------------
//Изменения видимости пароля в форме регистрации юзера
$("body").on("click", "#sign-up-hide-password", function () {
  if ($(this).is(":hover")) {
    $("#sign-up-pass").attr("type", "text");
    document.querySelector("#sign-up-hide-password").style.display = "none";
    document.querySelector("#sign-up-show-password").style.display = "block";
  }
});
$("body").on("click", "#sign-up-show-password", function () {
  if ($(this).is(":hover")) {
    $("#sign-up-pass").attr("type", "password");
    document.querySelector("#sign-up-hide-password").style.display = "block";
    document.querySelector("#sign-up-show-password").style.display = "none";
  }
});

//------------------------------------------
//Изменения видимости пароля в профайле юзера
$("body").on("click", "#profile-hide-password", function () {
  if ($(this).is(":hover")) {
    $("#profile-user-password").attr("type", "text");
    document.querySelector("#profile-hide-password").style.display = "none";
    document.querySelector("#profile-show-password").style.display = "block";
  }
});
$("body").on("click", "#profile-show-password", function () {
  if ($(this).is(":hover")) {
    $("#profile-user-password").attr("type", "password");
    document.querySelector("#profile-hide-password").style.display = "block";
    document.querySelector("#profile-show-password").style.display = "none";
  }
});

//------------------------------------------
//АВТОЗАПОЛНЕНИЕ НАЗВАНИЯ ГОРОДА
const input = document.getElementById("resident-city");
const suggestionsContainer = document.getElementById("suggestions");

const cache = new Map(); // Используем Map для лучшей производительности
let debounceTimeout;

// Дебаунс для оптимизации количества запросов
function debounce(func, delay) {
  return function (...args) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Определяем язык ввода на основе запроса
function detectLanguage(query) {
  const cyrillicPattern = /[\u0400-\u04FF]/;
  const ukrainianPattern = /[\u0400-\u045F]/; // Украинские символы входят в диапазон кириллицы

  if (ukrainianPattern.test(query)) {
    return "uk";
  }
  return cyrillicPattern.test(query) ? "ru" : "en";
}

// Функция запроса к Nominatim API с форматом GeocodeJSON
async function fetchCitySuggestions(query) {
  if (!query || query.length < 3) {
    suggestionsContainer.innerHTML = "";
    return;
  }

  const lang = detectLanguage(query); // Определяем язык

  if (cache.has(query)) {
    displaySuggestions(cache.get(query)); // Используем данные из кэша
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=geocodejson&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=8&accept-language=${lang}`
    );
    const data = await response.json();
    const features = data.features || [];

    cache.set(query, features); // Кэшируем результаты
    displaySuggestions(features);
  } catch (error) {
    console.error("Ошибка при получении данных с Nominatim API:", error);
  }
}

// Функция для отображения подсказок
function displaySuggestions(suggestions) {
  suggestionsContainer.innerHTML = ""; // Очистка контейнера

  if (suggestions.length === 0) {
    suggestionsContainer.innerHTML = "<div>Город не найден</div>";
    return;
  }

  const fragment = document.createDocumentFragment();

  suggestions.forEach((suggestion) => {
    const cityName =
      suggestion.properties?.geocoding?.name || "Неизвестный город";
    const country =
      suggestion.properties?.geocoding?.country || "Неизвестная страна";
    const displayName = suggestion.properties?.geocoding?.label || "";

    const suggestionItem = document.createElement("div");
    suggestionItem.textContent = `${cityName}, ${country}`;

    // Обработчик клика по подсказке
    suggestionItem.addEventListener("click", () => {
      input.value = displayName;
      suggestionsContainer.innerHTML = "";
      console.log("Выбранный город:", displayName);
    });

    fragment.appendChild(suggestionItem);
  });

  suggestionsContainer.appendChild(fragment);
}

if (input) {
  // Обработчик ввода с дебаунсом
  input.addEventListener(
    "input",
    debounce(() => {
      const query = input.value.trim();
      fetchCitySuggestions(query);
    }, 300)
  ); // Задержка 300 мс

  // Закрываем подсказки при клике вне контейнера
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete-container")) {
      suggestionsContainer.innerHTML = "";
    }
  });
}
