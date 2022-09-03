const apiKey = "5ca7191e7c223ac438b06699f46c25b5";

// Section "Display Current Time"

function formatTime(hours, minutes) {
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  return `${hours}:${minutes}`;
}

// Section "Display Current Weather Data"

function displayCityName(cityName, country) {
  let cityElem = document.querySelector(".city");
  cityElem.innerHTML = `${cityName}, ${country}`;
}

function displayDate(timestamp) {
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

  let date = new Date(timestamp * 1000);
  let currentDay = days[date.getDay()];
  let currentMonth = months[date.getMonth()];
  let currentDate = date.getDate();
  let currentHours = date.getHours();
  let currentMinutes = date.getMinutes();

  let dateElem = document.querySelector(".date");
  let timeElem = document.querySelector(".time");

  dateElem.innerHTML = `${currentDay}, ${currentDate} ${currentMonth}`;
  timeElem.innerHTML = formatTime(currentHours, currentMinutes);
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

function setWeatherIcon(icon) {
  let icons = {
    "01d": "01d_clear_day_FILL0_wght400_GRAD0_opsz48.svg",
    "02d": "02d_partly_cloudy_day_FILL0_wght400_GRAD0_opsz48.svg",
    "03d": "03d_cloudy_FILL0_wght400_GRAD0_opsz48.svg",
    "04d": "04d_filter_drama_FILL0_wght400_GRAD0_opsz48.svg",
    "09d": "09d_rainy_FILL0_wght400_GRAD0_opsz48.svg",
    "10d": "09d_rainy_FILL0_wght400_GRAD0_opsz48.svg",
    "11d": "11d_thunderstorm_FILL0_wght400_GRAD0_opsz48.svg",
    "13d": "13d_cloudy_snowing_FILL0_wght400_GRAD0_opsz48.svg",
    "50d": "50d_foggy_FILL0_wght400_GRAD0_opsz48.svg",
    "01n": "01n_clear_night_FILL0_wght400_GRAD0_opsz48.svg",
    "02n": "02n_partly_cloudy_night_FILL0_wght400_GRAD0_opsz48.svg",
    "03n": "03d_cloudy_FILL0_wght400_GRAD0_opsz48.svg",
    "04n": "04d_filter_drama_FILL0_wght400_GRAD0_opsz48.svg",
    "09n": "09d_rainy_FILL0_wght400_GRAD0_opsz48.svg",
    "10n": "09d_rainy_FILL0_wght400_GRAD0_opsz48.svg",
    "11n": "11d_thunderstorm_FILL0_wght400_GRAD0_opsz48.svg",
    "13n": "13d_cloudy_snowing_FILL0_wght400_GRAD0_opsz48.svg",
    "50n": "50d_foggy_FILL0_wght400_GRAD0_opsz48.svg",
  };

  return icons[icon];
}

function displayWeatherIcon(icon, description) {
  let weatherIcon = document.querySelector(".w-image img");
  let iconSrc = setWeatherIcon(icon);
  weatherIcon.setAttribute("alt", description);
  weatherIcon.setAttribute("src", `img/${iconSrc}`);
}

let displayData = function (data) {
  let cityName = data.name;
  let country = data.sys.country;
  let timestamp = data.dt;
  let temp = data.main.temp;
  let humidity = data.main.humidity;
  let windSpeed = data.wind.speed;
  let clouds = data.clouds.all;
  let mainDescription = data.weather[0].main;
  let description = data.weather[0].description;
  let icon = data.weather[0].icon;

  displayCityName(cityName, country);
  displayDate(timestamp);
  displayTemperature(temp);
  displayWind(windSpeed);
  displayHumidity(humidity);
  displayClouds(clouds);
  displayWeatherDescription(description);
  displayWeatherIcon(icon, mainDescription);
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
  // displayCurrentTime();
}

init();
