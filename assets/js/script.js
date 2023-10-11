$(function () {
  // Add timezone plugins to day.js
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);

  // global variables
  var searchHistory = [];
  var cityName;
  var inputText;
  var today = dayjs();

  // API key
  var apiKey = "93c5997f1683b54331b6cb9a90e8dbca";

  // DOM Elements
  var cityForm = $("#city-form");
  var cityInput = $("#city-input");
  var submitBtn = $("#submit-btn");
  var cityList = $("#city-list");

  searchHistory = JSON.parse(localStorage.getItem("cities")) || [];
  for (let i = 0; i < searchHistory.length; i++) {
    createButton(searchHistory[i]);
  }

  function createButton(city) {
    var button = $("<button>", {
      type: "button",
      class: "btn btn-secondary w-100 mt-3",
      id: city,
      text: city,
    });
    cityList.prepend(button);
  }

  // Display search history to page and push to searchHistory array
  function displayCity(event) {
    event.preventDefault();
    inputText = cityInput.val().trim();
    // if the input text is not blank and is not already in the searchHistory array
    if (inputText != "" && searchHistory.indexOf(inputText) === -1) {
      searchHistory = JSON.parse(localStorage.getItem("cities")) || [];
      // Creates new button
      createButton(inputText);
      searchHistory.push(inputText);
      // save to local storage
      localStorage.setItem("cities", JSON.stringify(searchHistory));
      fetchCurrentWeather(inputText);
    }
    cityInput.val("");
  }

  function fetchCurrentWeather(cityName) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(currentWeatherUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayWeather(data);
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        fetchForecast(lat, lon);
      });
  }

  function fetchForecast(lat, lon) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + apiKey;
    fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        displayForecast(data.list);
      });
  }

  function displayWeather(data) {
    $("#current-weather").empty();
    var output;

    output = `<div class ="card">
        <div class= "card-header">
        <h2>${data.name} (${today.format('DD/MM/YYYY')})<span><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"/></span></h2>
        </div>
        <div class="card-body">
        <p>Temperature: ${data.main.temp} F</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} MPH</p>
        </div>
        </div>`;

    $("#current-weather").append(output);
  }

  function displayForecast(data) {
    $("#forecast").empty();
    var output;
    for (let i = 0; i < 5; i++) {
      var forIn = i * 8 + 4;
      var day = new Date(data[forIn].dt * 1000).toDateString();

      output = `<div class ="card forecast-card">
        <div class= "card-header">
        <h5>${day}<span><img src="https://openweathermap.org/img/wn/${data[forIn].weather[0].icon}.png"/></span></h5>
        </div>
        <div class="card-body">
        <p>Temperature: ${data[forIn].main.temp} F</p>
        <p>Humidity: ${data[forIn].main.humidity} %</p>
        <p>Wind Speed: ${data[forIn].wind.speed} MPH</p>
        </div>
        </div>`;
      $("#forecast").append(output);
    }
  }

  // Event listeners
  cityForm.on("submit", displayCity);

  cityList.on("click", function (event) {
    var city = event.target.textContent;
    console.log(city);
    fetchCurrentWeather(city);
  });
});
