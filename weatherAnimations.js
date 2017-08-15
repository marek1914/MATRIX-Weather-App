//Load libraries
var EventEmitter = require('events')

//Global Vars
var currentForecast = "";
var animationLoop;
/////////////////////////////
//Animation Event Handler
/////////////////////////////
var animation = new EventEmitter();
//start an animation
animation.on('start',function(currentForecast){
    console.log("starting "+ currentForecast +" animation");
    runAnimation(currentForecast);//input expects no casing
});
//stop current animation
animation.on('stop', function(){
    console.log("stopping "+ currentForecast );
    clearInterval(animationLoop);
    clearMatrixLights();
});

/////////////////////////////
//Export functions
/////////////////////////////
module.exports = animation;


////////////////////////////
// MATRIX LED ANIMATIONS
///////////////////////////
function runAnimation(forecast){//selects animation to run
    //clear day
    if (forecast === "clear-day")
        clear('day');
    //clear night
    else if (forecast === "clear-night")
        clear('night');
    //rain
    else if (forecast === "rain")
        rain();
    //snow
    else if (forecast === "snow")
        snow();
    //sleet (light snow)
    else if (forecast === "sleet")
        sleet();
    //windy
    else if (forecast === "wind")
        windy();
    //foggy
    else if (forecast === "fog")
        foggy();
    //cloudy
    else if (forecast === "cloudy")
        mostlyCloudy('day');
    //partly cloudy day
    else if (forecast === "partly-cloudy-day")
        partlyCloudy('day');
    //partly cloudy night
    else if (forecast === "partly-cloudy-night")
        partlyCloudy('night');
    //hail *hazard*
    else if (forecast === "hail")
        hazard();
    //thunderstorm *hazard*
    else if (forecast === "thunderstorm")
        hazard();
    //tornado *hazard*
    else if (forecast === "tornado")
        hazard();
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
            color: 'rgb(0, 0, 100)',
            start: 0,
            blend: true
        };
        //clouds
        var cloud1 = {
            arc: 120,
            color: 'rgb(255,255,255)',
            start: y*120+120,
            blend: false
        };
        var cloud2 = {
            arc: 120,
            color: 'rgb(255,255,255)',
            start: y*120+300,
            blend: false
        };

        var cloud3 = {
            arc: 120,
            color: 'rgb(255,255,255)',
            start: x*120+120,
            blend: false
        };
        var cloud4 = {
            arc: 120,
            color: 'rgb(255,255,255)',
            start: x*120+300,
            blend: false
        };
        //update matrix LEDs
        matrix.led([cloud1, cloud2, cloud3, cloud4, sky]).render(); 
    },10);
}
function mostlyCloudy(setting){
    var counter = 0;
    var increase = Math.PI / 100;
    var skyColor = '';

    animationLoop = setInterval(function(){
        //day
        if (setting === 'day'){
            skyColor = 'rgb(0,0,255)';
        }
        //night
        else{
            skyColor = 'rgb(80,0,255)';
        }

        var y = Math.cos(counter/1.2);
        counter += increase;
        //sky
        var sky = {
            arc: 360,
            color: skyColor,
            blend: false,
            start: 0
        };
        //clouds
        var cloud1 = {
            arc: 100,
            color: 'rgb(255,255,255)',
            start: y*120+400,
            blend: false
        };
        var cloud2 = {
            arc: 100,
            color: 'rgb(255,255,255)',
            start: y*120+225,
            blend: false
        };
        //update matrix LEDs
        matrix.led([cloud1, cloud2, sky]).render(); 
    },10);
}
function partlyCloudy(setting){
    var counter = 0;
    var increase = Math.PI / 100;
    var skyColor = '';

    animationLoop = setInterval(function(){
        var y = Math.sin(counter/1.2)*80;
        counter += increase;

        //day
        if (setting === 'day'){
            skyColor = 'rgb(0,0,255)';
        }
        //night
        else{
            skyColor = 'rgb(60,0,191.25)';
        }
        //avoid counter growing too big
        if (counter >= 360)
            counter = 0;

        //sky
        var sky = {
            arc: 360,
            color: skyColor,
            blend: false,
            start: 0
        };
        //cloud
        var cloud1 = {
            arc: 45,
            color: 'rgb(255,255,255)',
            start: 0+y,
            blend: false
        };
        var cloud2 = {
            arc: 45,
            color: 'rgb(255,255,255)',
            start: 70+y,
            blend: false
        };
        //update matrix LEDs
        matrix.led([cloud1, cloud2, sky]).render();  
    },10);
}
function clear(setting){
    var counter = 0;
    var increase = Math.PI / 180;
    var skyColor = 'rgb(0,0,0)';
    var satelliteColor = 'rgb(0,0,0)';
    //update matrix LEDs
    animationLoop = setInterval(function(){
        //day
        if (setting === 'day'){
            satelliteColor = 'rgb(255,50,0)';
            skyColor = 'rgb(0,0,255)';
        }
        //night
        else{
            satelliteColor = 'rgb(255,255,255)';
            skyColor = 'rgb(80,0,255)';
        }
        //avoid counter growing too big
        if (counter >= 360)
            counter = 0;
        //moon & sun
        var y = Math.sin(counter*3)*50;//speed
        var satellite = {
            arc: 100,
            color: satelliteColor,
            start: 40+y,
        };
        //sky
        var sky = {
            arc: 260,
            color: skyColor,
            start: 145+y,
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
            color: 'rgb(0,0,255)',
            start: 90+counter1,
            blend: false
        };
        var rainDrop2 = {
            arc: 20,
            color: 'rgb(0,0,255)',
            start: 450-counter1,
            blend: false
        };
        //set2
        var rainDrop3 = {
            arc: 20,
            color: 'rgb(0,0,255)',
            start: 90+counter2,
            blend: false
        };
        var rainDrop4 = {
            arc: 20,
            color: 'rgb(0,0,255)',
            start: 450-counter2,
            blend: false
        };
        //set3
        var rainDrop5 = {
            arc: 20,
            color: 'rgb(0,0,255)',
            start: 90+counter3,
            blend: false
        };
        var rainDrop6 = {
            arc: 10,
            color: 'rgb(0,0,255)',
            start: 450-counter3,
            blend: false
        };
        //cloud movement
        var y = Math.sin(sinCounter*3);
        sinCounter += increase;
        //cloud
        var cloud = {
            arc: 90,
            color: 'rgb(255,255,255)',
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
            color: 'rgb(255,255,255)',
            start: 90+counter1,
            blend: false
        };
        var snowFlake2 = {
            arc: 20,
            color: 'rgb(255,255,255)',
            start: 450-counter1,
            blend: false
        };
        //cloud movement
        var y = Math.sin(sinCounter*3);
        sinCounter += increase;
        //cloud
        var cloud = {
            arc: 90,
            color: 'rgb(255,255,255)',
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
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 90+counter1,
            blend: false
        };
        var snowFlake2 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 450-counter1,
            blend: false
        };
        //set2
        var snowFlake3 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 90+counter2,
            blend: false
        };
        var snowFlake4 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 450-counter2,
            blend: false
        };
        //set3
        var snowFlake5 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 90+counter3,
            blend: false
        };
        var snowFlake6 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 450-counter3,
            blend: false
        };
        //cloud movement
        var y = Math.sin(sinCounter*3);
        sinCounter += increase;
        //cloud
        var cloud = {
            arc: 90,
            color: 'rgb(255,255,255)',
            start: 45+y*21.2,
            blend: false
        };
        //set1 logic for droplet movement
        counter1 += 0.5;
        if (counter1 > 180)
            counter1 = 0;
        //clockwise
        if (snowFlake1.start >= 270)
            snowFlake1.start = 90;
        //counterClockwise
        if (snowFlake2.start <= 270)
            snowFlake2.start = 450;
        //set2 logic for droplet movement
        counter2 += 1.5;
        if (counter2 > 180)
            counter2 = 0;
        //clockwise
        if (snowFlake3.start >= 270)
            snowFlake3.start = 90;
        //counterClockwise
        if (snowFlake4.start <= 270)
            snowFlake4.start = 450;
        //set3 logic for droplet movement
        counter3 += 2;
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
            color: "rgb("+(1+y*254)+","+(1+y*254)+","+(1+y*254)+")",
            start: 180+counter,
            blend: false
        };
        var fog2 = {
            arc: 150+x*175,
            color: "rgb("+(1+y*254)+","+(1+y*254)+","+(1+y*254)+")",
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
    var increase = 9;
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
            color: 'rgb(255,255,255)',
            start: 180+counter,
            blend: false
        };
        var wind2 = {
            arc: 70+y*90,
            color: 'rgb(255,255,255)',
            start: 0+counter,
            blend: false
        };
        //update matrix LEDs
        matrix.led([wind1, wind2]).render();
    },10);
}
function sleet(){
    var counter1 = 0;
    var counter2 = 0;
    var counter3 = 0;
    var sinCounter = 0;
    var increase = Math.PI / 180;

    animationLoop = setInterval(function(){
        //sleets
        //set1
        var sleet1 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 90+counter1,
            blend: false
        };
        var sleet2 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 450-counter1,
            blend: false
        };
        //set2
        var sleet3 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 90+counter2,
            blend: false
        };
        var sleet4 = {
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 450-counter2,
            blend: false
        };
        //set3
        var sleet5 = {//not rendered
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 90+counter3,
            blend: false
        };
        var sleet6 = {//not rendered
            arc: 10,
            color: 'rgb(255,255,255)',
            start: 450-counter3,
            blend: false
        };
        //cloud movement
        var y = Math.sin(sinCounter*3);
        sinCounter += increase;
        //cloud
        var cloud = {
            arc: 90,
            color: 'rgb(255,255,255)',
            start: 45+y*21.2,
            blend: false
        };
        //set1 logic for droplet movement
        counter1 += 5.5;
        if (counter1 > 180)
            counter1 = 0;
        //clockwise
        if (sleet1.start >= 270)
            sleet1.start = 90;
        //counterClockwise
        if (sleet2.start <= 270)
            sleet2.start = 450;
        //set2 logic for droplet movement
        counter2 += 5;
        if (counter2 > 180)
            counter2 = 0;
        //clockwise
        if (sleet3.start >= 270)
            sleet3.start = 90;
        //counterClockwise
        if (sleet4.start <= 270)
            sleet4.start = 450;
        //set3 logic for droplet movement
        counter3 += 6.5;
        if (counter3 > 180)
            counter3 = 0;
        //clockwise
        if (sleet5.start >= 270)
            sleet5.start = 90;
        //counterClockwise
        if (sleet6.start <= 270)
            sleet6.start = 450;
        //update matrix LEDs
        matrix.led([sleet1, sleet2, sleet3, sleet4, cloud]).render();   
    },10);
}
function hazard(){
    var counter = 0;
    var increase = Math.PI / 180;
    animationLoop = setInterval(function(){
        //adjust for only pos values
        var y = Math.sin(counter*3)*150;
        //prevent counter from adding infinitely
        if (y === 360)
                y = 0;
        //move sin waves

        //move fog
        counter += increase;
        //fog object
        var redRing = {
            arc: 360,
            color: "rgb("+y+",0,0)",
            start: 0,
            blend: false
        }
        //update matrix LEDs
        matrix.led([redRing]).render();
    },10);
}

//Called on every animation transition
function clearMatrixLights(){
    matrix.led("black").render();
}


