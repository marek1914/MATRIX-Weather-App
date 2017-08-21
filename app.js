//Load libraries
var weatherAnims = require(__dirname+'/weatherAnimations'); //custom weather animations
var Forecast = require('forecast'); //https://www.npmjs.com/package/forecast
var request = require('request'); //https://www.npmjs.com/package/request

////////////////////////////////
//Global Variables
////////////////////////////////
//Detailed location data
var location = {};

//Configure forecast options
var forecast = new Forecast({
    service: 'darksky', //only api available
    key: 'YOUR_KEY_HERE', //darksky api key (https://darksky.net/dev/account)
    units: 'fahrenheit', //fahrenheit or celcius
    cache: false //cache forecast data
});

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
            console.log(error+'\n\x1b[31mThere has been an issue retrieving the weather\nMake sure you set your API KEY \x1b[0m ');
        else{
            //pass weather into callback
            setWeatherAnim(weather.currently.icon);

            //loop every X milliseconds
            setTimeout(function(){
                determineForecast(lat,lon);
            }, 180000);
        }
    });
}

////////////////////////////////
//Action Zone
////////////////////////////////
//Auto Obtain Location
getLocation(function(){
    //Start Forcast requests
    determineForecast(location.lat, location.lon);//input your coordinates for better accuracy ex. 25.7631,-80.1911
});
