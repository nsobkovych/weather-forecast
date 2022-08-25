const apiKey = "5ca7191e7c223ac438b06699f46c25b5";

// Section "Display Current Time"

function formatTime(hours, minutes) {
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  return `${hours}:${minutes}`;
}

function displayCurrentTime() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentTime = new Date();
  let currentDay = days[currentTime.getDay()];
  let currentMonth = months[currentTime.getMonth()];
  let currentDate = currentTime.getDate();
  let currentHours = currentTime.getHours();
  let currentMinutes = currentTime.getMinutes();

  let dateElem = document.querySelector(".date");
  let timeElem = document.querySelector(".time");

  dateElem.innerHTML = `${currentDay}, ${currentDate} ${currentMonth}`;
  timeElem.innerHTML = formatTime(currentHours, currentMinutes);
}

// Section "Display Current Weather Data"

function displayCityName(cityName, country) {
  let cityElem = document.querySelector(".city");
  cityElem.innerHTML = `${cityName}, ${country}`;
}

function displayTemperature(temp) {
  let currentTemp = Math.round(temp);
  let degreeElem = document.querySelector(".w-degree");
  degreeElem.innerHTML = currentTemp;
}

function displayWind(speed) {
  let currentWindSpeed = document.querySelector(".w-wind");
  speed = Math.round(speed);
  currentWindSpeed.innerHTML = `${speed}m/s`;
}

function displayHumidity(humidity) {
  let currentHumidity = document.querySelector(".w-humidity");
  currentHumidity.innerHTML = `${humidity}%`;
}

function displayClouds(clouds) {
  let currentClouds = document.querySelector(".w-clouds");
  currentClouds.innerHTML = `${clouds}%`;
}

function displayWeatherDescription(description) {
  let weatherType = document.querySelector(".w-type");
  weatherType.innerHTML = description;
}

let displayData = function (data) {
  let cityName = data.name;
  let country = data.sys.country;
  let temp = data.main.temp;
  let humidity = data.main.humidity;
  let windSpeed = data.wind.speed;
  let clouds = data.clouds.all;
  let description = data.weather[0].main;

  displayCityName(cityName, country);
  displayTemperature(temp);
  displayWind(windSpeed);
  displayHumidity(humidity);
  displayClouds(clouds);
  displayWeatherDescription(description);
};

// Section "Search Engine"

function validateEnteredCity(cityName) {
  if (cityName) {
    cityName = cityName.trim();

    if (cityName.length) {
      return cityName;
    } else {
      return "";
    }
  } else {
    return "";
  }
}

function showCityWeather(cityName, displayData) {
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric`;

  axios
    .get(`${weatherApiUrl}&appid=${apiKey}`)
    .then(function (response) {
      displayData(response.data);
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        alert(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      // console.log(error.config);
    });
}

function searchCityWeather(ev) {
  ev.preventDefault();

  let cityName = this.q.value;
  cityName = validateEnteredCity(cityName);

  if (cityName) {
    showCityWeather(cityName, displayData);
    this.q.value = "";
  } else {
    alert("Please enter a correct city name");
    this.q.value = "";
  }
}

let searchCityForm = document.forms["search-city-form"];

searchCityForm.addEventListener("submit", searchCityWeather);

// Section "Choose scale"

function switchTempScale(ev) {
  let isCels = this.classList.contains("btn-celsius");
  let isActive = this.classList.contains("btn-active");

  if (isCels) {
    degreeElem.innerHTML = tempCels;
    btnFahrenheit.classList.remove("btn-active");

    if (!isActive) {
      btnCelsius.classList.add("btn-active");
    }
  } else {
    degreeElem.innerHTML = tempFahr;
    this.classList.toggle("btn-active");
    btnCelsius.classList.remove("btn-active");
  }
}

let tempCels = 30;
let tempFahr = Math.round(tempCels * 1.8 + 32);

let btnCelsius = document.querySelector(".btn-celsius");
let btnFahrenheit = document.querySelector(".btn-fahrenheit");

let degreeElem = document.querySelector(".w-degree");

degreeElem.innerHTML = tempCels;

btnCelsius.addEventListener("click", switchTempScale);
btnFahrenheit.addEventListener("click", switchTempScale);

// Section "Display Current Location Weather"

function showCurrentLocationWeather() {
  function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let currentLocWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;

    axios
      .get(`${currentLocWeatherApiUrl}&appid=${apiKey}`)
      .then(function (response) {
        displayData(response.data);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response);
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          alert(error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        // console.log(error.config);
      });
  }

  function showDefaultData(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
    showCityWeather("Kyiv", displayData);
  }

  navigator.geolocation.getCurrentPosition(showPosition, showDefaultData);
}

function init() {
  showCurrentLocationWeather();
  displayCurrentTime();
}

init();
