// Using Moment JS to Display the current date and update the current date
var todaysDate = null; //sets the variable todaysDate to null. Will be called in a function. 
var currentTime = null; // sets the variable currentTime to null. Will be called in a function

//Update function that allows us to set a date format using moment.js.
var update = function () { 
    todaysDate = moment (new Date ())
    $("#currentDay").html(todaysDate.format ('dddd, MMMM Do, YYYY: hh:mm:ss a')); //Writes the current date to the html page in the format of day of the week, month, date of the month (1-31), year, hour, minute, and second in that order)
};

//Function used to update the time every second. The time updates with real time information
$(document).ready(function(){
    currentTime = $('#currentDay')
    update();
    setInterval(update, 1000);
});

function generateWeather() {
    const cityInputEl = document.getElementById("input-city");
    const citySearchEl = document.getElementById("btn-search");
    const clearCityEl = document.getElementById("history-clear");
    const cityNameEl = document.getElementById("name-city");
    const cityTemperatureEl = document.getElementById("temperature");
    const cityHumidityEl = document.getElementById("humidity")
    const cityPictureEl = document.getElementById("city-pic");
    const cityWindEl = document.getElementById("wind-speed");
    const cityUVEl = document.getElementById("uv-index");
    const searchHistoryEl = document.getElementById("search-history");
    var fiveDayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("todays-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    //Function that displays the temperature with degress fahrenheit
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    //Assigning a variable to use as the API Key
    const APIkey = "04d672453e2ffd5f0ccd96121758e383";

    function fetchWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
        axios.get(queryURL)
            .then(function (response) {
                todayweatherEl.classList.remove("d-none");

                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                cityNameEl.innerHTML = response.data.name + " (" + month +"/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                cityPictureEl.setAttribute("src", "https://openweathermap.or/img/wn/" + weatherPic + "@2x.png");
                cityPictureEl.setAttribute("alt", response.data.weather[0].description); 
                cityTemperatureEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                cityHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                cityWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                //Retrieve UV Index
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid" + APIkey + "&cnt=1";
                axios.get(UVQueryURL)
                    .then(function (response) {
                        let UVindex = document.createElement("span");

                        //Displays green when UV index is good, shows yellow when higher than good but not dangerous, and shows red when UV index is dangerously high
                        if (response.data[0].value < 4) {
                            UVindex.setAttribute("class", "badge badge-success");
                        }
                        else if (response.data[0].value < 8) {
                            UVindex.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVindex.setAttribute("class", "badge badge-danger");
                        }
                        UVindex.innerHTML = response.data[0].value;
                        cityUVEl.innerHTML = "UV Index: ";
                        cityUVEl.append(UVIndex);
                    });

                    
                //Get the next 5 days of forecast for the search city
                let cityID = response.data.cityID;
                let forecastQueryURL =  "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIkey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fiveDayEl.classList.remove("d-none");

                        // This code includes a for loop that will parse the previous response data and provide the 5 day forecast
                        const weatherEls = document.querySelectorAll(".weather");
                        for (i =0; i < weatherEls.length; i++) {
                            weatherEls[i].innerHTML = "";
                            const weatherIndex = i * 8 + 4;
                            const weatherDate = new Date (response.data.list[weatherIndex].dt * 1000);
                            const weatherDay = weatherDate.getDate();
                            const weatherMonth = weatherDate.getMonth();
                            const weatherYear = weather.getFullYear();
                            const weatherDateEl = document.createElement("p")
                            weatherDateEl.setAttribute("class", "mt-3 mb-0 weather-date");
                            weatherDateEl.innerHTML = weatherMonth + "/" + weatherDay + "/" + weatherYear;
                            weatherEls[i].append(weatherDateEl);

                            // add the current weather icon image to the weatherEls
                            const weatherImgEl = document.createElement("img");
                            weatherImgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[weatherIndex].weather[0].icon + "@2x.png");
                            weatherImgEl.setAttribute("alt", response.data.list[weatherIndex].weather[0].description);
                            weatherEls[i].append(weatherImgEl);

                            // add element to display the temperature of each day
                            const weatherTempEl = document.createElement("p");
                            weatherTempEl. innerHTML = "Temperature: " + k2f(response.data.list[weatherIndex].main.temp) + " &#176F";
                            weatherEls[i].append (weatherTempEl);

                            // add element to display the humidity for each day
                            const weatherHumidityEl = document.createElement("P");
                            weatherHumidityEl = "Humidity: " + response.data.list[weatherIndex].main.humidity + "%";
                            weatherEls[i].append(forecastHumidityEl);
                        }
                    })

            });
    }
    
    // Get data from local storage
    citySearchEl.addEventListener("click", function() {
        const searchInfo = cityInputEl.value;
        fetchWeather(searchInfo);
        searchHistory.push(searchInfo);
        localStorage.getItem("search", JSON.stringify(searchHistory));
        displaysearchHistory();
    })

    // Clear search history
    clearCityEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        displaysearchHistory();
    })

    // function that displays the search history
    function displaysearchHistory() {
        searchHistoryEl.innerHTML = "";
        //for loop that loops through search history to pull the information in local storage and display it to the user
        for (let i = 0; i < searchHistory.length; i++) {
            const searchHistoryItem = document.createElement("input");
            searchHistoryItem.setAttribute("type", "text");
            searchHistoryItem.setAttribute("readonly", true);
            searchHistoryItem.setAttribute("class", "form-control d-block bg-white");
            searchHistoryItem.setAttribute("value", searchHistory[i]);
            searchHistoryItem.addEventListener("click", function () {
                fetchWeather(searchHistory[searchHistory.length - 1]);
            })
            searchHistoryEl.append(searchHistoryItem);
        }
    }

    displaysearchHistory();
    if (searchHistory.length > 0) {
        fetchWeather(searchHistory[searchHistory.length - 1]);
    }

    
}

generateWeather();

