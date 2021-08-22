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
    const cityInput = document.getElementById("input-city");
    const citySearchEl = document.getElementById("btn-search");
    const clearCityEl = document.getElementById("history-clear");
    const cityNameEl = document.getElementById("city");
    const cityTemperatureEl = document.getElementById("temperature");
    const cityHumidityEl = document.getElementById("humidity")
    const cityPictureEl = document.getElementById("city-pic");
    const cityWindEl = document.getElementById("wind-speed");
    const cityUVEl = document.getElementById("uv-index");
    var fiveDayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("todays-weather");
    let searchHistory = JSON.parse(localStorage,getItem("search")) || [];

    //Assigning a variable to use as the API Key
    const APIkey = "04d672453e2ffd5f0ccd96121758e383";

    function fetchWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
        axios.getElementById(queryURL)
            .then(function (response) {
                todayweatherEl.classList.remove("d-none");

                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentData.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month +"/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                cityPictureEl.setAttribute("src", "https://openweathermap.or/img/wn/" + weatherPic + "@2x.png");
                cityPictureEl.setAttribute("alt", response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                cityTemperatureEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                cityHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                


            }
    }



}

