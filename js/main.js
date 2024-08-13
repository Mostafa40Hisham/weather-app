// DOM elements
const projectPj = document.querySelector(".projectpj");
const countreName = document.querySelector(".countre_name");
const time = document.querySelector(".time");
const input = document.querySelector("input");
const button = document.querySelector(".btn");
const smallImg = document.querySelector(".smallimg");
const weather = document.querySelector(".weather");
const temprature = document.querySelector(".temprature");
const windSpeed = document.querySelector(".wind-speed-");
const humidity = document.querySelector(".humidity-");
const pressure = document.querySelector(".pressure-");


const fetchVideo = (city) => {
  return fetch(`https://pixabay.com/api/videos/?key=42510262-a578e62c7ae6b8b11ba215f3b&q=${city}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.hits.length > 2 && data.hits[2].videos.large) {
        projectPj.src = data.hits[2].videos.large.thumbnail;
      } else {
        throw new Error("No video data available");
      }
    });
};

const fetchWeatherAndTime = (city) => {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=08dd42bdc9e627940787e29415c41023`)
    .then((response) => response.json())
    .then((weatherData) => {
      if (!weatherData.coord) {
        throw new Error("No weather data available");
      }

      const { lon, lat } = weatherData.coord;
      const weatherCondition = weatherData.weather[0].main;
      weather.innerHTML = weatherCondition;
      smallImg.src = `images/${weatherCondition}.png`;
      smallImg.style.display = "block";

      const temp = weatherData.main.temp.toString().slice(0, 2);
      temprature.innerHTML = `${temp}<sup>°</sup>`;
      humidity.innerHTML = weatherData.main.humidity;
      pressure.innerHTML = weatherData.main.pressure;
      windSpeed.innerHTML = weatherData.wind.speed;

      return fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=ILPSNVFUT20V&format=json&by=position&lat=${lat}&lng=${lon}`);
    })
    .then((response) => response.json())
    .then((timeData) => {
      if (timeData) {
        countreName.innerHTML = `${timeData.cityName}/${timeData.countryName}`;
        time.innerHTML = `time: ${timeData.formatted}`;
      }
    });
};

const showData = () => {
  const city = input.value.trim();

  if (!city) {
    resetAll();
    temprature.innerHTML = `<h3 class="text-danger fw-bold">NOTHING TO GEOCODE!</h3>`;
    return;
  }

  fetchVideo(city)
    .catch(() => {
      resetAll();
      temprature.innerHTML = `<h3 class="text-danger fw-bold">CITY NOT FOUND!</h3>`;
    });

  fetchWeatherAndTime(city)
    .catch((error) => {
      console.error(error);
      resetAll();
      temprature.innerHTML = `<h3 class="text-danger fw-bold">CITY NOT FOUND!</h3>`;
    });


  input.value = "";
};

button.addEventListener("click", showData);

const resetAll = () => {
  projectPj.src = "images/project-bg.jpg";
  smallImg.src = "";
  smallImg.style.display = "none"; 
  countreName.innerHTML = "";
  time.innerHTML = "";
  weather.innerHTML = "";
  temprature.innerHTML = "";
  windSpeed.innerHTML = "";
  humidity.innerHTML = "";
  pressure.innerHTML = "";
};
