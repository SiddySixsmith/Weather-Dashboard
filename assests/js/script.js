const apiKey =  "d3d59253ded6387d632037f53870b9da"
const inputForm = document.getElementById("input-form")
const inputCity = document.getElementById("input-city")
const alertCity = document.getElementById("alert-city")
const submitBtn = document.getElementById("submitBtn")
const clearBtn = document.getElementById("clearBtn")
const searchHistory = document.getElementById("search-history")
const allCards = document.getElementById("cards-all")
// Primary weather card constants
const currentCity = document.getElementById("current-city")
const currentMax = document.getElementById("current-max")
const currentDescription = document.getElementById("current-description")
const currentWindSpeed = document.getElementById("current-ws")
const currentHumidity = document.getElementById("current-h")
const currentUV = document.getElementById("current-uv")
const currentUVDescription = document.getElementById("uv-desc")
const currentIcon = document.getElementById("current-icon")
// Array for storage of previous search results
var savedSearchHistory = localStorage.getItem("savedSearches")
savedSearchHistory = savedSearchHistory ? savedSearchHistory.split(',') : [];

// Populate saved search results with savedSearchHistory from localStorage
for (i = 0; i < savedSearchHistory.length; i++) {
    // Create list items
    var newSearchLi = document.createElement("li")
    var newSearchText = document.createElement("a")
    newSearchLi.className = "history"

    // Add city name to list item
    newSearchText.innerHTML = savedSearchHistory[i]

    // Add to DOM    
    newSearchLi.appendChild(newSearchText)
    searchHistory.appendChild(newSearchLi)
}

// When the user clicks a list item, put target as inputCity value and fill cards
searchHistory.addEventListener("click", function (event) {
    event.preventDefault()

    // Retreive the city name
    inputCity.value = event.target.textContent

    // Run fillCards function
    fillCards()
})

// Load Perth on first page load
inputCity.value = "Perth"
fillCards()

// When the user clicks clear history, search history list is deleted
clearBtn.addEventListener("click", function (event) {
    event.preventDefault()

    // Clear localStorage
    localStorage.clear()
    // Clear savedSearchHistory array
    savedSearchHistory = []
    // Remove list items
    searchHistory.innerHTML = ''
});

// When the user clicks submit, get inputCity and fill weather cards with details
submitBtn.addEventListener("click", function (event) {
    event.preventDefault()
    inputCity.disabled = true
    fillCards()
    setTimeout(() => {
        inputCity.disabled = false
    }, 1000);
});

// When the user types a city name and presses enter, get inputCity and fill weather cards with details
inputForm.addEventListener('submit', function(event){
    event.preventDefault()
    inputCity.disabled = true
    fillCards()
    setTimeout(() => {
        inputCity.disabled = false
    }, 1000);
})

// When the user submits a search, add search to the search history list
function addHistory() {
    // Retreive the city name
    var city = inputCity.value

    // Create list items
    var newSearchLi = document.createElement("li")
    var newSearchText = document.createElement("a")
    newSearchLi.className = "history"

    // Add city name to list item
    newSearchText.innerHTML = city

    // Add city name to saved search history array
    savedSearchHistory.push(city)
    // Save array as string in local storage
    localStorage.setItem("savedSearches", savedSearchHistory.toString());


    // Add to DOM    
    newSearchLi.appendChild(newSearchText)
    searchHistory.appendChild(newSearchLi)
}

function fillCards() {
    // Hide alert whenever the submit button is pressed
    alertCity.setAttribute("class", "alert alert-danger mt-2 collapse")

    // Show weather cards
    allCards.setAttribute("class", "col-12 col-md-9 col-xl-10 show")

    // Retreive the city name
    const city = inputCity.value;

    // Call the OpenWeather API
    getWeather(city)
    .then(function(weatherData) {

        // Retreive data in UNIX format and convert to string using Moment
        var currentDateUnix = weatherData.current.dt
        var currentDateString = moment.unix(currentDateUnix).format("DD/MM/YYYY")
        
        // Fill current weather card with todays details and max's
        currentCity.textContent = inputCity.value + " " + currentDateString
        currentMax.textContent = (weatherData.daily[0].temp.max).toFixed(1) + " °C"
        currentDescription.textContent = weatherData.daily[0].weather[0].description
        currentWindSpeed.textContent = weatherData.daily[0].wind_speed + " m/s" 
        currentHumidity.textContent = weatherData.daily[0].humidity + " %"
        currentUV.textContent = weatherData.daily[0].uvi

        // Indicate UV index favourable colourings
        if (currentUV.textContent <= 2) {
            currentUV.setAttribute("class", "ms-1 low")
            currentUVDescription.setAttribute("class", "low")
            currentUVDescription.innerHTML=" (Low)"

        }   else if (currentUV.textContent > 2 && currentUV.textContent <= 5) {

            currentUV.setAttribute("class", "ms-1 mod")
            currentUVDescription.setAttribute("class", "mod")
            currentUVDescription.innerHTML=" (Moderate)"

        }   else if (currentUV.textContent > 5 && currentUV.textContent <= 7) {

            currentUV.setAttribute("class", "ms-1 high")
            currentUVDescription.setAttribute("class", "high")
            currentUVDescription.innerHTML=" (High)"

        }   else if (currentUV.textContent > 7 && currentUV.textContent < 11) {

            currentUV.setAttribute("class", "ms-1 vhigh")
            currentUVDescription.setAttribute("class", "vhigh")
            currentUVDescription.innerHTML=" (Very High!)"

        }   else if (currentUV.textContent >= 11) {

            currentUV.setAttribute("class", "ms-1 extreme")
            currentUVDescription.setAttribute("class", "extreme")
            currentUVDescription.innerHTML=" (Extreme!!)"
        }

        // Match correct weather icon
        var currentWeatherCode = weatherData.daily[0].weather[0].icon
        currentIcon.src = (`http://openweathermap.org/img/wn/${currentWeatherCode}@2x.png`)

        // Loop to create forecast cards
        for (let i = 1; i < 6; i++) {
            const forecastDate = document.getElementById("card-date-" + i)
            const forecastTemp = document.getElementById("card-temp-" + i)
            const forecastDesc = document.getElementById("card-description-" + i)
            const forecastWindSpeed = document.getElementById("card-ws-" + i)
            const forecastHumidity = document.getElementById("card-h-" + i)
            const forecastIcon = document.getElementById("card-icon-" + i)
            
            const forecastDateUnix = weatherData.daily[i].dt
            const forecastDateString = moment.unix(forecastDateUnix).format("DD/MM/YYYY")
            const forecastWeatherCode = weatherData.daily[i].weather[0].icon
            
            forecastDate.textContent = forecastDateString
            forecastDesc.textContent = weatherData.daily[i].weather[0].description
            forecastTemp.textContent = (weatherData.daily[i].temp.max).toFixed(1) + " °C"
            forecastWindSpeed.textContent = weatherData.daily[i].wind_speed + " m/s" 
            forecastHumidity.textContent = weatherData.daily[i].humidity + " %"
            forecastIcon.src = (`http://openweathermap.org/img/wn/${forecastWeatherCode}@2x.png`)
        }
        
    })
    .catch(function() {

        // Show alert if city name is not recognized
        alertCity.setAttribute("class", "alert alert-danger mt-2 show")
    })

}

// Get the current weather API response and retreive as .json
function getCurrentWeatherAPI(city) {
    return fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    ).then(function(response) {

        // If 404 is returned then set the addHistoryInterlock to 1
        if (response.status !== 404 && !savedSearchHistory.includes(inputCity.value)) {
            addHistory()
        }        
        return response.json();
    });
}

// Get the weather & forecast with the One Call API using longitude and latitude variables
function getOneCallAPI(longitude, latitude){
    return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`
    ).then(function(response){
        return response.json();
    });
}

// Use the current weather API to determine Lon/Lat values for the city, then use those values for the OneCallAPI
function getWeather(city) {
    return getCurrentWeatherAPI(city)
    .then(function(currentWeatherResponse){
        const coord = currentWeatherResponse.coord;

        return getOneCallAPI(coord.lon, coord.lat)
        
    })
}