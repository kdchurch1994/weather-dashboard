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
    const cityName = document.getElementById("city");
    const currentTemperature = document.getElementById("temperature");
    const cityHumidity = document.getElementById("humidity")
    const cityPicture = document.getElementById("city-pic");
    const cityWind = document.getElementById("wind-speed");
    const cityUV = document.getElementById("uv-index");
    var fiveDayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("todays-weather");

    //Assigning a variable to use as the API Key
    const APIkey = "04d672453e2ffd5f0ccd96121758e383";



}

