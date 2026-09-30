# India Real-World Forest Fire Simulator

A highly interactive, data-driven web application for simulating realistic forest fire spread across India, powered by real-time meteorological data and mapping APIs. 

## Features

- **Live Meteorological Data:** Fetches real-time temperature, humidity, wind speed, and wind direction via the Open-Meteo API when a location is selected.
- **Cellular Automata Engine:** Simulates realistic fire spread physics at 30fps. The algorithm calculates vector-based wind influence, fuel density, fatigue over time, and natural firebreaks.
- **Offscreen Canvas Rendering:** Highly optimized Canvas API drawing mechanism to prevent frame-rate drops when the fire grows large.
- **Real-world Active Fires:** A built-in sidebar tab synced with sample live data representations from FSI (Forest Survey of India) and NASA FIRMS. 
- **Land Detection:** Prevents unrealistic fire ignition in deep oceans using reverse geocoding from BigDataCloud.
- **High-Risk Zones:** Quickly navigate to predefined, historically vulnerable forest regions in India.

## Tech Stack
- **Frontend:** HTML, CSS (Custom styling, modern layout), Vanilla JavaScript
- **Mapping:** Leaflet.js with Esri World Imagery (Satellite) and Boundary overlays
- **Build Tool:** Vite

## Installation & Running Locally

1. **Install Dependencies:**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Open in Browser:**
   Navigate to the local URL provided by Vite (e.g., `http://localhost:5173`).

## How to Use
- **Click Map Mode:** Simply click anywhere on the landmass of India to fetch live weather for that exact coordinate and start a fire simulation.
- **Coordinate Mode:** Enter a precise Latitude and Longitude to ignite a fire.
- **Simulation Report:** Watch the real-time panel on the right track the total area burned, active burning cells, and simulated duration. Once the fire hits natural exhaustion (contained), click "Start New Burn" to clear the map.
