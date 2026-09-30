 Indian Forest Fire Simulator: A Deep Dive

INDIA FOREST FIRE SIMULATOR

A web app that shows how a forest fire might spread across India, using real weather at the spot where you start it.

Click anywhere on the map and the app pulls the current temperature, humidity, wind speed and wind direction for that location. Then it lets a fire loose and shows you what the wind and terrain do to it.


WHAT IT DOES

The app uses live weather. When you pick a spot, it fetches current conditions from Open-Meteo, so the same place can burn differently on a calm day and on a windy one.

It simulates fire spread. The map is a grid of cells that catch fire from their neighbours. Wind pushes the fire downwind, denser fuel burns harder, cells burn out over time, and natural firebreaks can slow or stop the fire.

It stays smooth. The simulation runs at around 30 frames per second, and drawing happens on an offscreen canvas so large fires don't make it lag.

It won't light the ocean. The app checks the location first using BigDataCloud and refuses to start a fire in deep water.

It shows active fires. A sidebar tab has sample data modelled on FSI (Forest Survey of India) and NASA FIRMS.

It has shortcuts to risky regions. You can jump to forest areas in India that are known to be fire-prone.


BUILT WITH

HTML, CSS and vanilla JavaScript
Leaflet.js for the map, with Esri satellite imagery and boundary overlays
Vite as the build tool


RUNNING IT LOCALLY

You will need Node.js installed. Then run these commands one after another:

git clone https://github.com/sreedharhari2006-code/forest_fire_simulator.git
cd forest_fire_simulator
npm install
npm run dev

Vite will print a local address, usually http://localhost:5173. Open that in your browser.

You will need an internet connection, since the weather data, map tiles and location checks all come from online services.


HOW TO USE IT

There are two ways to start a fire.

1. Click the map. Click any point on India's land and the fire starts there, using that spot's live weather.

2. Enter coordinates. Type in an exact latitude and longitude if you know where you want to start.

Once the fire is burning, the panel on the right keeps count of the area burned, the number of cells still on fire, and how much time has passed in the simulation. When the fire dies out, click "Start New Burn" to clear the map and try somewhere else.




CONTRIBUTING

Ideas and pull requests are welcome. Fork the repo, make your changes on a branch, and open a pull request. If you're not sure where to start, opening an issue to talk it through works too.

Some things that would be nice to add:
- Real NASA FIRMS data instead of samples
- Terrain slope and elevation in the spread model
- Adjustable simulation speed
- Exportable reports


LICENSE

Not added yet. If you want others to reuse the code, add a LICENSE file (MIT is a common choice).


AUTHOR

Made by sreedharhari2006-code
https://github.com/sreedharhari2006-code
*Built with passion, data, and a whole lot of JavaScript.* 🌳🔥
