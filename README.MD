#Weather
Uses your Raspberry Pi's IP address to find your geolocation and local weather. The MATRIX's LEDs are set to show a light sequence based on the current weather conditions. Location and local weather description are reflected in the app dashboard.

This app currently contains animations for the following:
- clear-day
- clear-night
- rain
- snow
- sleet
- wind
- fog
- cloudy
- partly-cloudy-day
- partly-cloudy-night

Note: 
- The LED's will turn red if there is a hazard (hail, thunderstorm, or tornado)
- The LED's will turn yellow if there is no LED sequence for the current weather
- This app relies on the following websites:
    - https://darksky.net
    - http://ip-api.com