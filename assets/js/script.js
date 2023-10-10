$(function () {

    // Add timezone plugins to day.js
    dayjs.extend(window.dayjs_plugin_utc);
    dayjs.extend(window.dayjs_plugin_timezone);

    // global variables
    var searchHistory = [];
    var cityName;
    var inputText;
    var lat, lon;


    // API endpoints
    // var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;
    // var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
    // var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}";
    var forecast5Url = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
    var apiKey = "93c5997f1683b54331b6cb9a90e8dbca";

    // DOM Elements
    var cityForm = $("#city-form");
    var cityInput = $("#city-input");
    var submitBtn = $("#submit-btn");
    var cityList = $("#city-list");

    // Display search history to page and push to searchHistory array
    function displayCity(event) {
        event.preventDefault();
        inputText = cityInput.val().trim();
        // console.log(inputText);
        // if the input text is not blank and is not already in the searchHistory array
        if (inputText != "" && searchHistory.indexOf(inputText) === -1) {
            // Creates new button
            var button = $("<button>", {
                type: "button",
                class: "btn btn-secondary w-100 mt-3",
                id: inputText,
                text: inputText
            });
            cityList.prepend(button);
            searchHistory.push(inputText);
            // save to local storage
            localStorage.setItem("cities", JSON.stringify(searchHistory));
            fetchGeocode();
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

    function fetchGeocode() {
        cityName = inputText;
        // console.log(cityName);
        var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;
        // console.log(geocodeUrl);
        fetch(geocodeUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // console.log(data);
                lat = data[0].lat;
                lon = data[0].lon;
                console.log(lat);
                console.log(lon);
                fetchCurrentWeather();
            });
    }

    function fetchCurrentWeather() {
        var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
        fetch(currentWeatherUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                // lat = data[0].lat;
                // lon = data[0].lon;
                // console.log(lat);
                // console.log(lon);
                // fetchCurrentWeather();
            });
    }












    // Event listeners
    cityForm.on("submit", displayCity);




});