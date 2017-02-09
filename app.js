//Includes
var request = require("request"),
  	cheerio = require("cheerio"),
  	EventEmitter = require('events'),
  	http = require('http');

///////////////////////
// Event Listeners
//////////////////////
var animation = new EventEmitter();
//start an animation
animation.on('start',function(currentForecast){
	console.log("starting "+ currentForecast +" animation");
	runAnimation(currentForecast);
});
//stop current animation
animation.on('stop', function(){
	console.log("stopping "+ currentForecast );
	clearInterval(animationLoop);
	clearMatrixLights();
});

////////////////////////////
// Initiating Animations
///////////////////////////
var currentForecast = "";
var lastForecast = "";
var animationLoop;
//coordinate data vars
var ipData;
var lat = 0;
var lon = 0;
//Check weather on app start
getForecast(function(currentForecast){
	//change weather on app start
	animation.emit('start', currentForecast);
	//update last forecast
	lastForecast = currentForecast;
	//Check weather every X seconds
	setInterval(function(){
		//Get Forecast
		getForecast(function(currentForecast){
			//check if current animations should change
			if(lastForecast !== currentForecast){
				animation.emit('stop');
				lastForecast = currentForecast;
				animation.emit('start', currentForecast);
			}
		});
	},10000);
});

///////////////////////////////
// Get Forecast Information
//////////////////////////////
function getForecast(callback){
	//JSON with GEO Coordinates
	var webScrapper = http.get('http://ip-api.com/json/?callback', function(response){
		response.on("data", function(data){
			//Attempt To Obtain Geolocation Data
			try{
				ipData = JSON.parse(data);//format coordinate data
				lat = ipData.lat;
				lon = ipData.lon;

				//send Geolocation to matrix dashboard
				matrix.type('location').send({
				  'latitude': lat,
				  'longitude': lon,
				  'label': 'Forecast Location'}
				);
			}
			catch(jsonError){
				console.log(jsonError+"\nCould not load forecast data!");
			}
			console.log("[Lat: "+lat+"], ["+"Lon: "+lon+"]");
			//weather forecast data from darksky
			var url = "https://darksky.net/forecast/"+lat+","+lon;
	  		console.log("Using: "+url);
			//Attempt To Obtain Forecast Data
			request(url, function (error, response, body) {
			    	var $ = cheerio.load(body);
			    	//Attempt To Find And Format Forecast HTML Element
			    	try{
			    		currentForecast = $("span.summary.swap").html().slice(0, -1).toLowerCase();
			    		//send forcast to matrix dashboard
			    		matrix.type('forcast').send({
        					'currentForecast': currentForecast
    					});
			    	}
					catch(htmlError){
						console.log(htmlError+"\nCould not find HTML element!");
					}
				    console.log("Forecast: "+currentForecast);
				    callback(currentForecast);
			});
		});
	});
	//error handler if website is not loaded
	webScrapper.on("error",function(){
		currentForecast = lastForecast;
		console.log("*************************->Could not load Site<-*************************");
	});
}

////////////////////////////
// MATRIX LED ANIMATIONS
///////////////////////////
function runAnimation(forecast){//selects animation to run
	//overcast
	if (forecast === "overcast")
		overcast();
	//mostly cloudy
	else if (forecast === "mostly cloudy")
		mostlyCloudy();
	//partly cloudy
	else if (forecast === "partly cloudy")
		partlyCloudy();
	//clear skies
	else if (forecast === "clear")
		clear();
	//humid
	else if (forecast === "humid")
		humid();
	//really light rain
	else if (forecast === "drizzle")
		drizzle();
	//light rain
	else if (forecast === "light rain")
		lightRain();
	//heavy rain
	else if (forecast === "rain")
		rain();
	//light snow
	else if (forecast === "flurries")
		flurries();
	//medium snow**
	else if (forecast === "light snow")
		lightSnow();
	//heavy snow**
	else if (forecast === "snow")
		snow();
	//drizzle and breezy
	else if (forecast === "drizzle and breezy")
		drizzle();
	//breezy
	else if (forecast === "breezy")
		clear();
	//light rain + breezy
	else if (forecast === "light rain and breezy")
		lightRain();
	//windy + cloudy
	else if (forecast === "windy and mostly cloudy")
		mostlyCloudy();
	//heavy winds + partly cloudy
	else if (forecast === "dangerously windy and partly cloudy")
		partlyCloudy();
	//foggy
	else if (forecast === "foggy")
		foggy();
	//foggy
	else if (forecast === "windy")
		windy();
	//weather animation was not found
	else 
		matrix.led("yellow").render();
	//etc...
}
////////////////////////////////////////////////////
// To initiate, animations are required to have a 
// setInterval() assigned to animationLoop
//////////////////////////////////////////////////
function overcast(){
	var counter = 0;
	var increase = Math.PI / 100;

	animationLoop = setInterval(function(){
		var x = Math.sin(counter/2);
  		var y = Math.cos(counter/2);
  		counter += increase;
  		//sky
  		var sky = {
  			arc: 360,
			color: 'rgba(0, 0, 100,1)',
			blend: true
  		};
  		//clouds
  		var cloud1 = {
			arc: 120,
			color: 'rgba(255,255,0,1)',
			start: y*120+120,
			blend: false
		};
		var cloud2 = {
			arc: 120,
			color: 'rgba(255,255,0,1)',
			start: y*120+300,
			blend: false
		};

		var cloud3 = {
			arc: 120,
			color: 'rgba(255,255,0,1)',
			start: x*120+120,
			blend: false
		};
		var cloud4 = {
			arc: 120,
			color: 'rgba(255,255,0,1)',
			start: x*120+300,
			blend: false
		};
		//update matrix LEDs
  		matrix.led([cloud1, cloud2, cloud3, cloud4, sky]).render();	
	},10);
}
function mostlyCloudy(){
	var counter = 0;
	var increase = Math.PI / 100;

	animationLoop = setInterval(function(){
  		var y = Math.cos(counter/1.2);
  		counter += increase;
  		//sky
  		var sky = {
  			arc: 360,
			color: 'rgba(0, 0, 100,1)',
			blend: true
  		};
  		//clouds
  		var cloud1 = {
			arc: 100,
			color: 'rgba(255,255,0,1)',
			start: y*120+300,
			blend: false
		};
		var cloud2 = {
			arc: 100,
			color: 'rgba(255,255,0,1)',
			start: y*120+120,
			blend: false
		};
		//update matrix LEDs
  		matrix.led([cloud1, cloud2, sky]).render();	
	},10);
}
function partlyCloudy(){
	var counter = 0;
	var increase = Math.PI / 100;

	animationLoop = setInterval(function(){
  		var y = Math.sin(counter/1.2);
  		counter += increase;
  		//sky
  		var sky = {
  			arc: 360,
			color: 'rgba(0, 0, 100,1)',
			blend: true
  		};
  		//cloud
  		var cloud = {
			arc: 90,
			color: 'rgba(255,255,0,1)',
			start: 120+y*120,
			blend: false
		};
		//update matrix LEDs
  		matrix.led([cloud, sky]).render();	
	},10);
}
function clear(){
	var counter = 0;
	var increase = 1.5;
	var skyColor = 'rgba(0,0,0,1)';
	var satelliteColor = 'rgba(0,0,0,1)';
	//update matrix LEDs
	animationLoop = setInterval(function(){
		//day/night logic
		var time = new Date();
		var h = time.getHours();
		var m = time.getMinutes();

		if (h > 6 && h < 18){
			satelliteColor = 'rgba(255,50,0,1)';
			skyColor = 'rgba(0,0,255,1)';
		}
		else if (h <= 6 || h >= 18){
			satelliteColor = 'rgba(255,255,255,1)';
			skyColor = 'rgba(80,0,255,1)';
		}
		//avoid counter growing too big
		if (counter >= 360)
			counter = 0;
		//moon & sun
		var satellite = {
			arc: 98,
			color: satelliteColor,
			start: 260+counter,
		};
		//sky
		var sky = {
			arc: 270,
			color: skyColor,
			start: 0+counter,
		};
		counter += increase;
  		matrix.led([satellite, sky]).render();
	},10);
}
function humid(){
	var counter = 0;
	var increase = Math.PI / 180;

	animationLoop = setInterval(function(){
		//adjust for only pos values
  		var y = Math.sin(counter*3.3) / 2 + 0.5;
		//move sin wave
  		counter += increase;
		//update matrix LEDs
  		matrix.led("rgba(0,"+(1+y*99)+",255,1)").render();
	},10);
}
function drizzle(){
	var counter = 0;
	var sinCounter = 0;
	var increase = Math.PI / 180;

	animationLoop = setInterval(function(){
  		//rainDrops
  		var rainDrop1 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 90+counter,
			blend: false
		};
		var rainDrop2 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 450-counter,
			blend: false
		};
		//cloud movement
		var y = Math.sin(sinCounter*3);
		sinCounter += increase;
		//cloud
		var cloud = {
			arc: 90,
			color: 'rgba(255,255,255,1)',
			start: 45+y*21.2,
			blend: false
		};
		//logic for droplet movement
		counter += 2.5;
		if (counter > 180)
			counter = 0;
		//clockwise
		if (rainDrop1.start >= 270)
		rainDrop1.start = 90;
		//counterClockwise
		if (rainDrop2.start <= 270)
		rainDrop2.start = 450;
		//update matrix LEDs
  		matrix.led([rainDrop1, rainDrop2, cloud]).render();	
	},10);
}
function lightRain(){
	var counter1 = 0;
	var counter2 = 0;
	var sinCounter = 0;
	var increase = Math.PI / 180;

	animationLoop = setInterval(function(){
  		//rainDrops
  		//set1
  		var rainDrop1 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 90+counter1,
			blend: false
		};
		var rainDrop2 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 450-counter1,
			blend: false
		};
		//set2
		var rainDrop3 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 90+counter2,
			blend: false
		};
		var rainDrop4 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 450-counter2,
			blend: false
		};
		//cloud movement
		var y = Math.sin(sinCounter*3);
		sinCounter += increase;
		//cloud
		var cloud = {
			arc: 90,
			color: 'rgba(255,255,255,1)',
			start: 45+y*21.2,
			blend: false
		};
		//set1 logic for droplet movement
		counter1 += 2.5;
		if (counter1 > 180)
			counter1 = 0;
		//clockwise
		if (rainDrop1.start >= 270)
		rainDrop1.start = 90;
		//counterClockwise
		if (rainDrop2.start <= 270)
		rainDrop2.start = 450;
		//set2 logic for droplet movement
		counter2 += 3.5;
		if (counter2 > 180)
			counter2 = 0;
		//clockwise
		if (rainDrop3.start >= 270)
		rainDrop3.start = 90;
		//counterClockwise
		if (rainDrop4.start <= 270)
		rainDrop4.start = 450;
		//update matrix LEDs
  		matrix.led([rainDrop1, rainDrop2, rainDrop3, rainDrop4, cloud]).render();	
	},10);
}
function rain(){
	var counter1 = 0;
	var counter2 = 0;
	var counter3 = 0;
	var sinCounter = 0;
	var increase = Math.PI / 180;

	animationLoop = setInterval(function(){
  		//rainDrops
  		//set1
  		var rainDrop1 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 90+counter1,
			blend: false
		};
		var rainDrop2 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 450-counter1,
			blend: false
		};
		//set2
		var rainDrop3 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 90+counter2,
			blend: false
		};
		var rainDrop4 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 450-counter2,
			blend: false
		};
		//set3
		var rainDrop5 = {
			arc: 20,
			color: 'rgba(0,0,255,1)',
			start: 90+counter3,
			blend: false
		};
		var rainDrop6 = {
			arc: 10,
			color: 'rgba(0,0,255,1)',
			start: 450-counter3,
			blend: false
		};
		//cloud movement
		var y = Math.sin(sinCounter*3);
		sinCounter += increase;
		//cloud
		var cloud = {
			arc: 90,
			color: 'rgba(255,255,255,1)',
			start: 45+y*21.2,
			blend: false
		};
		//set1 logic for droplet movement
		counter1 += 2.5;
		if (counter1 > 180)
			counter1 = 0;
		//clockwise
		if (rainDrop1.start >= 270)
		rainDrop1.start = 90;
		//counterClockwise
		if (rainDrop2.start <= 270)
		rainDrop2.start = 450;
		//set2 logic for droplet movement
		counter2 += 4.5;
		if (counter2 > 180)
			counter2 = 0;
		//clockwise
		if (rainDrop3.start >= 270)
		rainDrop3.start = 90;
		//counterClockwise
		if (rainDrop4.start <= 270)
		rainDrop4.start = 450;
		//set3 logic for droplet movement
		counter3 += 6.5;
		if (counter3 > 180)
			counter3 = 0;
		//clockwise
		if (rainDrop5.start >= 270)
		rainDrop5.start = 90;
		//counterClockwise
		if (rainDrop6.start <= 270)
		rainDrop6.start = 450;
		//update matrix LEDs
  		matrix.led([rainDrop1, rainDrop2, rainDrop3, rainDrop4, rainDrop5, rainDrop6, cloud]).render();	
	},10);
}
function flurries(){
	var counter1 = 0;
	var sinCounter = 0;
	var increase = Math.PI / 180;
	animationLoop = setInterval(function(){
		//Snowflakes
  		//set1
  		var snowFlake1 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 90+counter1,
			blend: false
		};
		var snowFlake2 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 450-counter1,
			blend: false
		};
		//cloud movement
		var y = Math.sin(sinCounter*3);
		sinCounter += increase;
		//cloud
		var cloud = {
			arc: 90,
			color: 'rgba(255,255,255,1)',
			start: 45+y*21.2,
			blend: false
		};
		//set1 logic for snowflake movement
		counter1 += 1.5;
		if (counter1 > 180)
			counter1 = 0;
		//clockwise
		if (snowFlake1.start >= 270)
		snowFlake1.start = 90;
		//counterClockwise
		if (snowFlake2.start <= 270)
		snowFlake2.start = 450;
		//update matrix LEDs
		matrix.led([snowFlake1,snowFlake2, cloud]).render();	
	},10);
}
function lightSnow(){
	var counter1 = 0;
	var counter2 = 0;
	var sinCounter = 0;
	var increase = Math.PI / 180;

	animationLoop = setInterval(function(){
  		//snowFlakes
  		//set1
  		var snowFlake1 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 90+counter1,
			blend: false
		};
		var snowFlake2 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 450-counter1,
			blend: false
		};
		//set2
		var snowFlake3 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 90+counter2,
			blend: false
		};
		var snowFlake4 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 450-counter2,
			blend: false
		};
		//cloud movement
		var y = Math.sin(sinCounter*3);
		sinCounter += increase;
		//cloud
		var cloud = {
			arc: 90,
			color: 'rgba(255,255,255,1)',
			start: 45+y*21.2,
			blend: false
		};
		//set1 logic for droplet movement
		counter1 += 1.5;
		if (counter1 > 180)
			counter1 = 0;
		//clockwise
		if (snowFlake1.start >= 270)
		snowFlake1.start = 90;
		//counterClockwise
		if (snowFlake2.start <= 270)
		snowFlake2.start = 450;
		//set2 logic for droplet movement
		counter2 += 2.3;
		if (counter2 > 180)
			counter2 = 0;
		//clockwise
		if (snowFlake3.start >= 270)
		snowFlake3.start = 90;
		//counterClockwise
		if (snowFlake4.start <= 270)
		snowFlake4.start = 450;
		//update matrix LEDs
  		matrix.led([snowFlake1, snowFlake2, snowFlake3, snowFlake4, cloud]).render();	
	},10);
}
function snow(){
	var counter1 = 0;
	var counter2 = 0;
	var counter3 = 0;
	var sinCounter = 0;
	var increase = Math.PI / 180;

	animationLoop = setInterval(function(){
  		//snowFlakes
  		//set1
  		var snowFlake1 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 90+counter1,
			blend: false
		};
		var snowFlake2 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 450-counter1,
			blend: false
		};
		//set2
		var snowFlake3 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 90+counter2,
			blend: false
		};
		var snowFlake4 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 450-counter2,
			blend: false
		};
		//set3
		var snowFlake5 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 90+counter3,
			blend: false
		};
		var snowFlake6 = {
			arc: 20,
			color: 'rgba(255,255,255,1)',
			start: 450-counter3,
			blend: false
		};
		//cloud movement
		var y = Math.sin(sinCounter*3);
		sinCounter += increase;
		//cloud
		var cloud = {
			arc: 90,
			color: 'rgba(255,255,255,1)',
			start: 45+y*21.2,
			blend: false
		};
		//set1 logic for droplet movement
		counter1 += 1;
		if (counter1 > 180)
			counter1 = 0;
		//clockwise
		if (snowFlake1.start >= 270)
		snowFlake1.start = 90;
		//counterClockwise
		if (snowFlake2.start <= 270)
		snowFlake2.start = 450;
		//set2 logic for droplet movement
		counter2 += 2;
		if (counter2 > 180)
			counter2 = 0;
		//clockwise
		if (snowFlake3.start >= 270)
		snowFlake3.start = 90;
		//counterClockwise
		if (snowFlake4.start <= 270)
		snowFlake4.start = 450;
		//set3 logic for droplet movement
		counter3 += 2.5;
		if (counter3 > 180)
			counter3 = 0;
		//clockwise
		if (snowFlake5.start >= 270)
		snowFlake5.start = 90;
		//counterClockwise
		if (snowFlake6.start <= 270)
		snowFlake6.start = 450;
		//update matrix LEDs
  		matrix.led([snowFlake1, snowFlake2, snowFlake3, snowFlake4, snowFlake5, snowFlake6, cloud]).render();	
	},10);
}
function foggy(){
	var sinCounter1 = 0;
	var sinIncrease1 = Math.PI / 280;
	var sinCounter2 = 0;
	var sinIncrease2 = Math.PI / 280;
	var increase = 2;
	var counter = 0;

	animationLoop = setInterval(function(){
		//adjust for only pos values
  		var y = Math.sin(sinCounter1*1.5) / 2 + 0.5;
  		var x = Math.sin(sinCounter2*1.5) / 2 + 0.5;
  		//prevent counter from adding infinitely
  		if (y === 254)
				sinCounter1 = 0;
		if (x === 360)
				sinCounter2 = 0;
		if (counter === 360)
				counter = 0;
		//move sin waves
  		sinCounter1 += sinIncrease1;
  		sinCounter2 += sinIncrease2;
  		//move fog
  		counter += increase;
  		//fog object
  		var fog1 = {
			arc: 150+x*175,
			color: "rgba("+(1+y*254)+","+(1+y*254)+","+(1+y*254)+",1)",
			start: 180+counter,
			blend: false
		};
		var fog2 = {
			arc: 150+x*175,
			color: "rgba("+(1+y*254)+","+(1+y*254)+","+(1+y*254)+",1)",
			start: 0+counter,
			blend: false
		};
		//update matrix LEDs
  		matrix.led([fog1, fog2]).render();
	},10);
}
function windy(){
	var sinCounter = 0;
	var sinIncrease = Math.PI / 100;
	var increase = 3;
	var counter = 0;

	animationLoop = setInterval(function(){
		//adjust for only pos values
  		y = Math.sin(sinCounter*3) / 2 + 0.5;
  		//prevent counter from adding infinitely
  		if (y === 254)
				sinCounter = 0;
		if (counter === 360)
				counter = 0;
		//move sin wave
  		sinCounter += sinIncrease;
  		//move fog
  		counter += increase;
  		//fog object
  		var wind1 = {
			arc: 70+y*90,
			color: 'rgba(255,255,255,1)',
			start: 180+counter,
			blend: false
		};
		var wind2 = {
			arc: 70+y*90,
			color: 'rgba(255,255,255,1)',
			start: 0+counter,
			blend: false
		};
		//update matrix LEDs
  		matrix.led([wind1, wind2]).render();
	},10);
}
//Called on every animation transition
function clearMatrixLights(){
	matrix.led("black").render();
}














