//Load libraries
var weatherAnims = require(__dirname+'/weatherAnimations'); //custom weather animations
var Forecast = require('forecast'); //https://www.npmjs.com/package/forecast
var request = require('request'); //https://www.npmjs.com/package/request

//Global Vars
var location = {};
var forecast = {};
////////////////////////////////
//Obtaining location data
////////////////////////////////
function getLocation(callback){
    request.get('http://ip-api.com/json')
    //catch any errors
    .on('error', function(error){
        return console.log(error + '\nCould Not Find Location!');
    })
    //get response status
    .on('response', function(data) {
        console.log('Status Code: '+data.statusCode)
    })
    //get location data
    .on('data', function(data){
        try{
            //save location data
            location = JSON.parse(data);

            //log all location data
            console.log(location);

            callback();
        }
        catch(error){
            console.log(error);
        }
    });
}

////////////////////////////////
//Selecting Weather Animation
////////////////////////////////
function setWeatherAnim(forecast){
    //clear MATRIX LEDs
        weatherAnims.emit('stop');
    //set MATRIX LED animation
        weatherAnims.emit('start', forecast);
}

////////////////////////////////
//Obtaining Forecast data
////////////////////////////////
function determineForecast(lat, lon){
    // Retrieve weather information
    forecast.get([lat, lon], true, function(error, weather) {
        //stop if there's an error
        if(error)
            console.log(error);
        else{
            //pass weather into callback
            setWeatherAnim(weather.currently.icon);//ADD THIS LATER!!!

            //loop every X seconds
            setTimeout(function(){
                determineForecast(lat,lon);
            }, 180000);
        }
    });
}

////////////////////////////////
//Action Zone
////////////////////////////////
//Configure forecast options
forecast = new Forecast({
    service: 'darksky', //only api available
    key: 'YOUR_KEY_HERE', //darksky api key (https://darksky.net/dev/account)
    units: 'fahrenheit', //fahrenheit or celcius
    cache: false //cache forecast data
});

//Run getLocation first
getLocation(function(){
    //run forcast request loop
    determineForecast(location.lat, location.lon);
});























