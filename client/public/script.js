let autoCompleteArray = [];
let currentCity = null;
let addedFavorites = [];

let rootElement = document.getElementById("root");
rootElement.insertAdjacentHTML(
  "beforeend",
  `<input id="search" type"text" autocomplete="off" placeholder="Type in your city"></input>`
);
rootElement.insertAdjacentHTML("beforeend", `<ul id="autoList"></ul>`);
rootElement.insertAdjacentHTML("beforeend", `<ul id="favoriteList"></ul>`);

let autocomplete = document.getElementById("autoList");
autocomplete.style.display = "none";

let favoriteList = document.getElementById("favoriteList");
favoriteList.style.display = "none";

let inputElement = document.getElementById("search");

rootElement.insertAdjacentHTML("beforeend", `<div id="weatherDisplay"></div>`);
let weatherElement = document.getElementById("weatherDisplay");

weatherElement.insertAdjacentHTML(
  "beforeend",
  `<button id="favorite">Add to favorites</button>`
);
let favoriteButton = document.getElementById("favorite");
favoriteButton.remove();

inputElement.addEventListener("input", function (event) {
  searchCity(event.target.value);
});
autocomplete.addEventListener("click", function (event) {
  let cityToPass = event.target.id;
  fetchWeather(cityToPass);
});
inputElement.addEventListener("keypress", function (event) {
  event.key === `Enter` ? fetchWeather(event.target.value) : null;
});
favoriteButton.addEventListener("click", function () {
  favoriteButton.innerText = "added";
  addedFavorites.push(currentCity);
});

inputElement.addEventListener("click", function (event) {
  displayFavorites(addedFavorites);
});

favoriteList.addEventListener("click", function (event) {
  let favoriteToPass = event.target.id;
  fetchWeather(favoriteToPass);
});

const searchCity = (input) => {
  favoriteList.style.display = "none";

  fetch(
    `https://api.weatherapi.com/v1/search.json?key=a9814986e60545f5b0a105839232704&q=${input}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let autoCompleteArray = data;

      autoCompleteArray.length >= 1
        ? (autocomplete.style.display = "block")
        : (autocomplete.style.display = "none");
      autocomplete.innerHTML = "";

      data.forEach((input) => {
        autocomplete.insertAdjacentHTML(
          "beforeend",
          `<li id="${input.name}" name="${input.name}"class="citysearch">${input.name} - ${input.country}</li>`
        );
      });
    });
};

const fetchWeather = (city) => {
  inputElement.value = "";
  autocomplete.style.display = "none";
  favoriteList.style.display = "none";

  fetch(
    `https://api.weatherapi.com/v1/current.json?key=a9814986e60545f5b0a105839232704&q=${city}&aqi=no`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    });
};

const displayWeather = (weatherData) => {
  currentCity = weatherData.location;

  weatherElement.innerHTML = "";
  weatherElement.insertAdjacentHTML(
    "beforeend",
    `<h1>${weatherData.location.name}</h1>`
  );
  weatherElement.append(favoriteButton);
  checkFavorite(weatherData);
  weatherElement.insertAdjacentHTML(
    "beforeend",
    `<h4>${weatherData.location.country}</h4>`
  );
  weatherElement.insertAdjacentHTML(
    "beforeend",
    `<h4>Weather condition: ${weatherData.current.condition.text}</h4>
    <img src="${weatherData.current.condition.icon}"></img>`
  );
  weatherElement.insertAdjacentHTML(
    "beforeend",
    `<h4>Celsius: ${weatherData.current.temp_c}</h4>`
  );
  weatherElement.insertAdjacentHTML(
    "beforeend",
    `<h4>Fahrenheit: ${weatherData.current.temp_f}</h4>`
  );
};

const displayFavorites = (favorites) => {
  favoriteList.innerHTML = "";

  for (let city of favorites) {
    favoriteList.insertAdjacentHTML(
      "beforeend",
      `<li id="${city.name}" name="${city.name}"class="citysearch">${city.name} - ${city.country}</li>`
    );
  }

  addedFavorites.length > 0
    ? (favoriteList.style.display = "block")
    : (favoriteList.style.display = "none");
};

const checkFavorite = (displayedCity) => {
  for (let favorite of addedFavorites) {
    if (
      favorite.name === displayedCity.location.name &&
      favorite.country === displayedCity.location.country
    ) {
      favoriteButton.remove();
      return weatherElement.insertAdjacentHTML(
        "beforeend",
        `<h4>Added to favorites</h4>`
      );
    } else {
      favoriteButton.innerText = "add to favorites";
    }
  }
};
