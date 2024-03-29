/*
This script handles the openweather Api and the DOM changes associated.
Gets location data, Norwich by default, User input for other cities,
Background image is changed dependant on weather type and saturation 
background filter dependent on temperature and grayscale fiter scaling 
with cloud percentage.
*/


/* Creates a request to the openweather api which returns weather data
as json, and is used to update the DOM with weatherChanges function */
function weatherChanges(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0bda57222292439b34a797a110b8a1ac`;
    const req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url);
    req.onload = () => {
        weatherHandle(req.response);
        cityInput.value = '';
    };
    req.send();
}

// Uses OpenWeather API response to apply a background image and
// filters associated with the current weather in that city
function weatherHandle(obj) {
    // If request is not succesful, an error message appears on the DOM
    const failedRequest = document.querySelector('.fail-request');
    const isInvisible = failedRequest.classList.contains('invisible');
    if(obj.cod !== 200 && isInvisible) {
        failedRequest.classList.remove('invisible')
        return false
    }
    else if (obj.cod !== 200 && !isInvisible) {
        return false
    }
    else if (!isInvisible) {
        failedRequest.classList.add('invisible');
    }

    // Extracting response data required for the changes
    const weatherCode = obj.weather[0].icon;
    const weatherDesc = obj.weather[0].description;
    const weatherClouds = obj.clouds.all/2 + '%';
    const dispTemp = Math.floor((obj.main.temp - 272.15) * 10)/10;
    const weatherTemp = 1 + (dispTemp - 16)/40;
    const dispCity = `${obj.name}, ${obj.sys.country}`;
    const dispWeather = document.createElement('img');
    const iconURL = `https://openweathermap.org/img/wn/${weatherCode}@2x.png`

    // Defining DOM elemnents to change
    const tabIcon = document.querySelector('link[rel="icon"]');
    const tabTitle = document.querySelector('title');
    const home = document.querySelector('.home');

    // Extracts main weather type, if extreme then assigned as other
    let weatherType;
    obj.weather[0].id.toString().charAt(0) === '7' ? weatherType = 'Other': weatherType = obj.weather[0].main;
    
    // Makes title and icon in tab relevant
    
    tabTitle.innerHTML = obj.name + ' Status';
    tabIcon.setAttribute('href', iconURL);

    // Weather changes to splash screens background image
    changeVariable('--weather-temp', weatherTemp);
    changeVariable('--weather-clouds', weatherClouds);
    home.style.setProperty('background-image', `var(--${weatherType})`);

    // Grabbing table element data cells
    const tableCity = document.querySelector('.weather-table-city');
    const tableWeather = document.querySelector('.weather-table-weather');
    const tableTemperature = document.querySelector('.weather-table-temperature');

    // Making changes to City Weather display
    tableCity.innerHTML = dispCity;
    tableWeather.innerHTML = weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);
    tableWeather.appendChild(dispWeather).setAttribute('src', iconURL);
    tableTemperature.innerHTML = dispTemp + ' Celsius';

    //Changes timezone variable to the tz of the current city (for time.js)
    timeZoneAdjustment = obj.timezone;
}

// Sends request on button click and resets the interval
// to update the weather every 10 mintues
citySubmit.addEventListener('click', event => {
    clearInterval(interval);
    const city = cityInput.value;
    weatherChanges(city);
    interval = setInterval(weatherChanges, 600000, city)
});

// Initial weather changes, then checks every 10 minutes for changes
weatherChanges('Norwich');
let interval = setInterval(weatherChanges, 600000, 'Norwich');
