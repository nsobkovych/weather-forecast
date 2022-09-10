const apiKey = "5ca7191e7c223ac438b06699f46c25b5";

// Section "Display Weather Data"

function formatTime(hours, minutes) {
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  return `${hours}:${minutes}`;
}

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
  degreeElem.innerHTML = temp;
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
  tempCels = Math.round(data.main.temp);
  let humidity = data.main.humidity;
  let windSpeed = data.wind.speed;
  let clouds = data.clouds.all;
  let mainDescription = data.weather[0].main;
  let description = data.weather[0].description;
  let icon = data.weather[0].icon;
  let coords = data.coord;

  displayCityName(cityName, country);
  displayDate(timestamp);
  displayTemperature(tempCels);
  displayWind(windSpeed);
  displayHumidity(humidity);
  displayClouds(clouds);
  displayWeatherDescription(description);
  displayWeatherIcon(icon, mainDescription);
  getForecast(coords);
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

// Section "Weather Forecast"

function renderForecast(forecastList) {
  let startIndex = 0;
  let endIndex = forecastList.length - 1;
  let forecastElem = document.querySelector(".w-forecast");
  let forecastHTML = `<div class="row">`;

  if (forecastList[0].samplesCounter <= 2) {
    startIndex = 1;
    endIndex = forecastList.length;
  }

  for (let i = startIndex; i < endIndex; i++) {
    let iconSrc = setWeatherIcon(forecastList[i].icon);

    forecastHTML =
      forecastHTML +
      `<div class="col">
        <div class="w-forecast-day">${forecastList[i].weekDay}</div>
        <div class="w-forecast-image">
          <img
            src="img/${iconSrc}"
            alt="${forecastList[i].description}"
          />
        </div>
        <div class="w-forecast-temperature">
          <span class="w-forecast-temperature-max">${Math.round(
            forecastList[i].maxTemp
          )}°</span> 
          <span class="w-forecast-temperature-min">${Math.round(
            forecastList[i].minTemp
          )}°</span>
        </div>
      </div>`;
  }

  forecastHTML = forecastHTML + "</div>";
  forecastElem.innerHTML = forecastHTML;
}

function displayForecast(data) {
  function extractCurrentDate(listItem) {
    return listItem.dt_txt.split(" ", 1)[0];
  }

  function extractTime(listItem) {
    return listItem.dt_txt.split(" ")[1].split(":", 1)[0];
  }

  let forecastDays = [];

  forecastDays[0] = {
    weekDay: Date((data.list[0].dt - data.city.timezone) * 1000).substring(
      0,
      3
    ),
    icon: data.list[0].weather[0].icon,
    description: data.list[0].weather[0].main,
    maxTemp: data.list[0].main.temp_max,
    minTemp: data.list[0].main.temp_min,
    samplesCounter: 0,
  };

  let currentDate = extractCurrentDate(data.list[0]);
  let index = 0;

  data.list.forEach((forecastData) => {
    if (extractTime(forecastData) == "12") {
      forecastDays[index].icon = forecastData.weather[0].icon;
    }

    if (currentDate == extractCurrentDate(forecastData)) {
      forecastDays[index].samplesCounter++;

      if (forecastDays[index].maxTemp < forecastData.main.temp_max) {
        forecastDays[index].maxTemp = forecastData.main.temp_max;
      }
      if (forecastDays[index].minTemp > forecastData.main.temp_min) {
        forecastDays[index].minTemp = forecastData.main.temp_min;
      }
    } else {
      let date = new Date((forecastData.dt - data.city.timezone) * 1000);

      currentDate = extractCurrentDate(forecastData);
      index++;

      forecastDays[index] = {
        weekDay: date.toString().substring(0, 3),
        icon: forecastData.weather[0].icon,
        description: forecastData.weather[0].main,
        maxTemp: forecastData.main.temp_max,
        minTemp: forecastData.main.temp_min,
        samplesCounter: 1,
      };
    }
  });

  renderForecast(forecastDays);
}

function getForecast(coords) {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric`;

  axios
    .get(`${forecastApiUrl}&appid=${apiKey}`)
    .then(function (response) {
      displayForecast(response.data);
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

// Section "Choose Scale"

function switchTempScale(ev) {
  ev.preventDefault();

  let isCels = this.classList.contains("btn-celsius");
  let isActive = this.classList.contains("btn-active");

  let tempFahr = Math.round(tempCels * 1.8 + 32);

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

let tempCels = null;

let btnCelsius = document.querySelector(".btn-celsius");
let btnFahrenheit = document.querySelector(".btn-fahrenheit");

let degreeElem = document.querySelector(".w-degree");

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

// Init Weather Application

function init() {
  showCurrentLocationWeather();
}

init();
