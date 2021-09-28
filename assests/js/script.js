// Display weather details of the user input
var form = document.getElementById("form-city");
var InputCity = document.getElementById("form-input");
const apiKey = "d3d59253ded6387d632037f53870b9da";
var todayDate = document.getElementById("today-city-date");
var todayTemp = document.getElementById("today-temp");
var todayWind = document.getElementById("today-wind");
var todayHumidity = document.getElementById("today-humidity");
var todayIndex = document.getElementById("today-UV");

// When user types in a city name 
form.addEventListener("submit", function(event){
    event.preventDefault();
    // we want to grab city name and call the weather dashboard 
const city = InputCity.value;

//call the weather api
getWeather(city)
    .then(function(weatherData){


todayTemp.textContent = convert(weatherData.current.temp).toFixed(2);
todayWind.textContent = weatherData.current.wind_speed;
todayHumidity.textContent = weatherData.current.humidity;
todayIndex.textContent = weatherData.current.uvi;

})
});

function createForecast(date, icon, temp, wind, humidity){

}


function getCurrentWeather(city){
return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
.then(function (response) {
    return response.json();
}).then(function(response) {
    console.log(response)
})
};
getCurrentWeather("perth")



function getOneCallWeather(longitude, latitude){
return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${apiKey}`)
.then(function (response) {
    return response.json();
})
};

function convert(kelvin) {
    return kelvin - 273.15
};

function getWeather(city){

 return getCurrentWeather(city)
 .then(function(currentWeatherResponse){
    // var wind = currentWeatherResponse.wind.speed;
     // var Temp = currentWeatherResponse.main.temp;
     // var humidity = currentWeatherResponse.main.humidity;
     // var coord = currentWeatherResponse.coord;

    return getOneCallWeather(coord.lon, coord.lat)
 })
}
getWeather("perth")