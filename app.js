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
    key: 'YOU_KEY_HERE', //darksky api key (https://darksky.net/dev/account)
    units: 'fahrenheit', //fahrenheit or celcius
    cache: false //cache forecast data
});

//Data seen on MATRIX Dashboard
var dashboardData = {
    lat: 0.00,
    lon: 0.00,
    weather: 'fetching...',
    temperature: 'fetching...'
}

////////////////////////////////
//Update MATRIX Dashboard
////////////////////////////////
function updateDashboard(){
    //prevent google maps pin at (0.00, 0.00)
    if(dashboardData.lat !== 0.00 || dashboardData.lon !== 0.00){
        //google maps location information
        matrix.type('location').send({
            'latitude': dashboardData.lat,
            'longitude': dashboardData.lon,
            'label': dashboardData.lat+','+dashboardData.lon
        });
        //forecast data
        matrix.type('forcast').send({
            'currentForecast': dashboardData.weather,
            'currentTemperature': dashboardData.temperature.toString()
        });
    }
    //loop every X milliseconds
    setTimeout(function(){
        updateDashboard();
    }, 2000);
}

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

            //update MATRIX dashboard values
            dashboardData.lat = lat;
            dashboardData.lon = lon;
            dashboardData.weather = weather.currently.summary;
            dashboardData.temperature = weather.currently.temperature;

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
    //Start updating MATRIX dashboard
    updateDashboard();
    //Start Forcast requests
    determineForecast(location.lat, location.lon);//input your coordinates for better accuracy ex. 25.7631,-80.1911
});