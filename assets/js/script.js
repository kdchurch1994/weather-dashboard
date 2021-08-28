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

function generateWeather() { //This function is being used to generate the current weather for the searched city and five day forecast by setting the const to get a particular element from the html by use getElementbyID
    const cityInputEl = document.getElementById("input-city");
    const citySearchEl = document.getElementById("btn-search");
    const clearCityEl = document.getElementById("history-clear");
    const nameEl = document.getElementById("city-name");
    const cityTemperatureEl = document.getElementById("temperature");
    const cityHumidityEl = document.getElementById("humidity")
    const cityPictureEl = document.getElementById("city-pic");
    const cityWindEl = document.getElementById("wind-speed");
    const searchHistoryEl = document.getElementById("search-history");
    var fiveDayEl = document.getElementById("fiveday-header"); 
    var todayweatherEl = document.getElementById("todays-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || []; //creates local storarge by parsing the searched cities or creating an empty array if no cities have been searched

    //Function that displays the correct temperature with degrees fahrenheit
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    //Assigning a variable to use as the API Key
    const APIkey = "04d672453e2ffd5f0ccd96121758e383";

    function fetchWeather(cityName) { //fetches the weather based off the name of a city
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                console.log(response)
                todayweatherEl.classList.remove("d-none"); //removes the d-none classification for the city cards so that this information can be viewed on the webpage

                const currentDate = new Date(response.dt * 1000); //gets the date to display on the weather card
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.weather[0].icon;
                cityPictureEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"); //Pulls the picture from the api and displays it on the weather card
                cityPictureEl.setAttribute("alt", response.weather[0].description); 
                cityTemperatureEl.innerHTML = "Temperature: " + k2f(response.main.temp) + " &#176F"; //Pulls the temperature for the searched city from the api and adds the k2f function to display the temperature with the correct degrees Farenheidt
                cityHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%"; //Pulls the humidty for the searched city from the api and formats it for how it will be displayed on the webpage
                cityWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH"; //Pulls the wind speed for the searched city from the api and formats it for how it will be displayed on the webpage

                //Retrieve UV Index 
                let lat = response.coord.lat;
                let lon = response.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&cnt=1";
                fetch(UVQueryURL)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        console.log(response)
                        let UVindex = document.querySelector(".badge");

                        UVindex.textContent = response.current.uvi

                        //Displays green when UV index is good, shows yellow when higher than good but not dangerous, and shows red when UV index is dangerously high
                        if (response.current.uvi < 4) {
                            UVindex.setAttribute("class", "bg-success badge");
                        }
                        else if (response.current.uvi < 8) {
                            UVindex.setAttribute("class", "bg-warning badge");
                        }
                        else {
                            UVindex.setAttribute("class", "badge-danger badge");
                        }
                        console.log(response.current.uvi);
                        
                    });

                    
                //Get the next 5 days of forecast for the search city
                let cityID = response.id;
                let forecastQueryURL =  "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIkey;
                fetch(forecastQueryURL)

                    .then( function (response) { //Takes the fetched data and converts it to json
                        return response.json()
                    })
                    .then(function (response) {
                        fiveDayEl.classList.remove("d-none"); //Allows us to see the 5 day forcast by removing the d-none class from the fiveday-header
                        console.log(response)

                        // This code includes a for loop that will parse the previous response data and provide the 5 day forecast
                        const weatherEls = document.querySelectorAll(".weather");
                        for (i =0; i < weatherEls.length; i++) {
                            weatherEls[i].innerHTML = "";
                            const weatherIndex = i * 8 + 4;
                            const weatherDate = new Date (response.list[weatherIndex].dt * 1000); //gets the date to display on the weather card for each of the five days
                            const weatherDay = weatherDate.getDate();
                            const weatherMonth = weatherDate.getMonth() + 1;
                            const weatherYear = weatherDate.getFullYear();
                            const weatherDateEl = document.createElement("p")
                            weatherDateEl.setAttribute("class", "mt-3 mb-0 weather-date");
                            weatherDateEl.innerHTML = weatherMonth + "/" + weatherDay + "/" + weatherYear;
                            weatherEls[i].append(weatherDateEl);

                            // add the current weather icon image to the weatherEls
                            const weatherImgEl = document.createElement("img");
                            weatherImgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.list[weatherIndex].weather[0].icon + "@2x.png");
                            weatherImgEl.setAttribute("alt", response.list[weatherIndex].weather[0].description);
                            weatherEls[i].append(weatherImgEl);

                            // add element to display the temperature of each day
                            const weatherTempEl = document.createElement("p");
                            weatherTempEl.innerHTML = "Temperature: " + k2f(response.list[weatherIndex].main.temp) + " &#176F";
                            weatherEls[i].append (weatherTempEl);

                            // add element to display the humidity for each day
                            const weatherHumidityEl = document.createElement("p");
                            weatherHumidityEl.innerHTML = "Humidity: " + response.list[weatherIndex].main.humidity + "%";
                            weatherEls[i].append(weatherHumidityEl);
                            
                            //add element to display the windspeed for each day
                            const weatherWindEl = document.createElement("p");
                            weatherWindEl.innerHTML = "Wind Speed: " + response.list[weatherIndex].wind.speed + " MPH";
                            weatherEls[i].append(weatherWindEl);
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
            searchHistoryItem.setAttribute("class", "form-control bg-white");
            searchHistoryItem.setAttribute("value", searchHistory[i]);
            searchHistoryItem.addEventListener("click", function () {
                fetchWeather(searchHistoryItem.value);
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

