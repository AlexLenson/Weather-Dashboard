$(function () {
  // Add timezone plugins to day.js
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);

  // global variables
  var searchHistory = [];
  var cityName;
  var inputText;
  var today = dayjs();

  // API endpoints
  // var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;
  // var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
  // var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}";
  // var forecastUrl = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
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
    // console.log(inputText);
    // if the input text is not blank and is not already in the searchHistory array
    if (inputText != "" && searchHistory.indexOf(inputText) === -1) {
      searchHistory = JSON.parse(localStorage.getItem("cities")) || [];
      // Creates new button
      createButton(inputText);
      searchHistory.push(inputText);
      // save to local storage
      localStorage.setItem("cities", JSON.stringify(searchHistory));
      // create current weather h2 -------- this should be in a separate function?
      //var h2 = $("<h2>").text(inputText.charAt(0).toUpperCase() + inputText.slice(1) + " (" + today.format('DD/MM/YYYY') + ")");
      // $("#current-weather").addClass("border border-dark mt-3");
      // $("#current-weather").append(h2);

      fetchCurrentWeather(inputText);
    }
    cityInput.val("");
  }

  // TODO: make function to retrive and display search history when page loads
  // function renderMessage() {
  //     var lastGrade = JSON.parse(localStorage.getItem("studentGrade"));
  //     if (lastGrade !== null) {
  //         document.querySelector(".message").textContent = lastGrade.student +
  //             " received a/an " + lastGrade.grade
  //     }
  // }

  // function fetchGeocode() {
  //     cityName = inputText;
  //     // console.log(cityName);
  //     var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;
  //     // console.log(geocodeUrl);
  //     fetch(geocodeUrl)
  //         .then(function (response) {
  //             return response.json();
  //         })
  //         .then(function (data) {
  //             // console.log(data);
  //             var lat = data[0].lat;
  //             var lon = data[0].lon;
  //             // console.log(lat);
  //             // console.log(lon);
  //             fetchCurrentWeather(lat, lon);
  //             fetchForecast(lat, lon);
  //         });
  // }

  function fetchCurrentWeather(cityName) {
    //var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + apiKey;
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayWeather(data);

        // how do i get icon to appear??

        // console.log(temp);
        // console.log(wind);
        // console.log(humidity);
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        fetchForecast(lat, lon);
      });
  }

  function fetchForecast(lat, lon) {
    var forecastUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial" +
      "&appid=" +
      apiKey;
    console.log(forecastUrl);
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
    console.log(data);
    $("#current-weather").empty();
    var output;

    output = `<div class ="card">
        <div class= "card-header">
        <h2>${data.name}<span><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"/></span></h2>
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
        <p>Wind Speed: ${data[forIn].wind.speed}</p>
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
