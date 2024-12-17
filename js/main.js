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

const signInBox = (singInForm = document.querySelector(".userserviceToggle"));
singInCancelSvg = document.querySelector(".sign-in-form-cancel");

// js code to toggle sign in form
singInForm.addEventListener("click", () => {
  singInForm.classList.toggle("active");
});
singInCancelSvg.addEventListener("click", () => {
  singInForm.classList.toggle("active");
});

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

//Автозаполнение города
const input = document.getElementById("resident-city");
const suggestionsContainer = document.getElementById("suggestions");

const cache = {}; // Кэш для хранения предыдущих запросов
let debounceTimeout;

// Дебаунс для оптимизации количества запросов
function debounce(func, delay) {
  return function (...args) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Функция запроса к Nominatim API с форматом GeocodeJSON
async function fetchCitySuggestions(query) {
  if (!query || query.length < 3) {
    suggestionsContainer.innerHTML = "";
    return;
  }

  if (cache[query]) {
    displaySuggestions(cache[query]); // Используем данные из кэша
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=geocodejson&q=${query}&addressdetails=1&limit=8`
    );
    const data = await response.json();
    const features = data.features || [];

    cache[query] = features; // Кэшируем результаты
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

  suggestions.forEach((suggestion) => {
    const cityName =
      suggestion.properties.geocoding.name || "Неизвестный город";
    const country =
      suggestion.properties.geocoding.country || "Неизвестная страна";
    const displayName = suggestion.properties.geocoding.label || "";

    const suggestionItem = document.createElement("div");
    suggestionItem.textContent = `${cityName}, ${country}`;

    // Обработчик клика по подсказке
    suggestionItem.addEventListener("click", () => {
      input.value = displayName;
      suggestionsContainer.innerHTML = "";
      console.log("Выбранный город:", displayName);
    });

    suggestionsContainer.appendChild(suggestionItem);
  });
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
