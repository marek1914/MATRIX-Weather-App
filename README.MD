# MATRIX Weather
Uses your Raspberry Pi's IP address to find your geolocation and local weather. The MATRIX's LEDs are set to show a light sequence based on the current weather conditions.

<b>This app currently contains animations for the following:</b>
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

<b>Notes:</b>
- This app requires the MATRIX OS (https://matrix-io.github.io/matrix-documentation/)
- You must include your own Dark Sky API Key in app.js (https://darksky.net/dev/account)
- You can hard code your coordinates for better accuracy in app.js
- The LED's will turn red if there is a hazard (hail, thunderstorm, or tornado)
- The LED's will turn yellow if there is no LED sequence for the current weather
- This app relies on the following websites:
    - https://darksky.net
    - http://ip-api.com

