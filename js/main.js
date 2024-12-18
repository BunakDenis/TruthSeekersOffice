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

//Search box
const searchBox = (searchToggle = document.querySelector(".searchToggle"));

// js code to toggle search box
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

//------------------------------------------
// Toggle sign in menu with user details menu
// Предполагаемое состояние пользователя
const userAuthorization = false; // Замените на реальную проверку авторизации

// Элементы интерфейса
const userServiceToggle = document.querySelector(".userserviceToggle");
const signInContainer = document.querySelector(".sign-in-container");
const notificationContainer = document.querySelector(".notification-container");

// Обработчик клика по SVG-картинке
userServiceToggle.addEventListener("click", () => {
  if (userAuthorization) {
    // Отображаем контейнер уведомлений
    notificationContainer.classList.add("active");
    signInContainer.classList.remove("active"); // Скрываем другую форму
  } else {
    // Отображаем контейнер формы входа
    signInContainer.classList.add("active");
    notificationContainer.classList.remove("active"); // Скрываем другую форму
  }
});

/*
//Toggle sign in menu with user details menu
const userDetailsBox = (userDetailsForm =
  document.querySelector(".userserviceToggle"));

const signInForm = document.querySelector(".signInForm");
const notificationForm = document.querySelector(".notificationForm");

singInCancelSvg = document.querySelector(".sign-in-form-cancel");
notificationCancelSvg = document.querySelector(".notification-form-cancel");

// Toggle sign in form
userDetailsForm.addEventListener("click", () => {
  signInForm.classList.toggle("active");
  //notificationForm.classList.remove("active");
});
singInCancelSvg.addEventListener("click", () => {
  singInForm.classList.toggle("active");
});
notificationCancelSvg.addEventListener("click", () => {
  singInForm.classList.toggle("active");
});
*/
//------------------------------------------
//Изменения видимости пароля
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
