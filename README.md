# 🔥 Indian Forest Fire Simulator: A Deep Dive

Welcome to the **Indian Forest Fire Simulator**! 

Have you ever wondered how a tiny spark in a dry forest can escalate into a massive, uncontrolled wildfire? This project was built to answer exactly that. It isn't just a static map; it is a **live, dynamic simulation engine** built right into your browser. 

By clicking anywhere on the map of India, you can ignite a virtual fire. The system instantly reaches out to real-world weather satellites, pulls the exact wind and temperature conditions for that specific coordinate at this exact moment in time, and uses physics and math to simulate how a fire would naturally spread through that environment. 

Whether you're a developer, a data enthusiast, or just curious about environmental modeling, this guide will explain everything that makes this simulator tick.

---

## 🧠 How the Fire Actually Spreads (The Science)

Behind the beautiful glowing embers on the screen is a mathematical concept called **Cellular Automata**. Here is exactly how we model the fire:

1. **The Grid System:** We divide the entire screen into a massive, invisible grid of tiny cells. Every single cell represents a small patch of forest (about 25 hectares).
2. **The 3 States of Nature:** At any given millisecond, a cell can only be in one of three states:
   - 🌳 **Unburned:** Healthy forest, waiting for a spark.
   - 🔥 **Burning:** Currently on fire, actively destroying the forest and emitting heat.
   - 🪨 **Burned Out:** The fuel is gone. Fire can no longer spread here.
3. **Wind Physics & Probability:** Fire doesn't spread in a perfect circle. If the wind is blowing aggressively towards the East, the fire will rapidly leap eastward, while the western edge of the fire might barely move. We achieve this by calculating the angle between the fire's current position and its neighbors, applying the live wind direction, and calculating a **"Spread Probability."** 
4. **Visual Ember System:** We don't just color squares red. We use HTML5 Canvas to render overlapping, glowing radial gradients that simulate real embers. You can even use the **Ember Size Slider** in the UI to manually control the visual intensity of these embers in real-time!

---

## 📡 The Data Pipeline: Talking to the Real World

To make the simulation realistic, we couldn't just invent weather data. We had to connect the app to the real world. 

### 1. Live Weather Integration (Open-Meteo API)
The moment you click the map, the app fires off a request to the **Open-Meteo API**. It passes the precise Latitude and Longitude of your click and asks for:
- Current Temperature (°C)
- Relative Humidity
- Wind Speed (km/h)
- Wind Direction (Degrees)

*Why does this matter?* Because a fire ignited in the humid, still air of Kerala will behave completely differently than a fire ignited during a dry, howling windstorm in the forests of Madhya Pradesh.

### 2. Reverse Geocoding (Nominatim API)
Coordinates like `22.97, 78.65` mean nothing to the average human. To fix this, we integrated the **Nominatim OpenStreetMap API**. When you start a fire, the app sends those coordinates to the API and asks, *"What is the actual name of this place?"* The API responds with readable locations (e.g., "Kanha National Park, Madhya Pradesh"), which we instantly display in the UI and save to your simulation history.

---

## 🗺️ The Dual-Map Interface

We realized that simulating fires is only half the battle; preventing them is the other half. That's why we built two entirely different map experiences into the app.

### 📍 The Simulation Map (The Laboratory)
This is your sandbox. It uses a high-resolution Esri Satellite base layer so you can see the actual topography and vegetation of India. This is where you drop fires, tweak ember sizes, and watch the cellular automata engine do its magic.

### 🚨 The Risk & Heat Map (The Command Center)
If you toggle to the second map, the UI transforms completely. We built a custom **Windy.com-inspired overlay** that features glassmorphic (blurred glass) layers and a beautiful color legend ranging from blue (Safe) to deep red (Critical Fire). 
- Instead of showing you random, continent-wide heat blurs, we wrote custom clustering algorithms that tightly concentrate heat data over actual, known high-risk zones (like Odisha and Chhattisgarh). 
- This data is heavily inspired by reports from **NASA FIRMS (Fire Information for Resource Management System)** and the **Forest Survey of India (FSI)**.

---

## 🛠️ The Technology Stack

This project was built to be lightning fast and visually stunning, without the bloat of massive frameworks.

- **Frontend Build Tool:** [Vite](https://vitejs.dev/) (For instant server starts and ultra-fast hot module replacement).
- **Styling:** Pure Vanilla CSS. We custom-built a modern, light-theme design system using CSS variables, flexbox, and backdrop-filters to create a premium, natively-compiled feel without relying on Bootstrap or Tailwind.
- **Mapping Engine:** [Leaflet.js](https://leafletjs.com/). The industry standard for interactive, mobile-friendly maps.
- **Heatmaps:** `leaflet.heat` plugin, heavily customized to render tight, localized data clusters.
- **Rendering:** Vanilla JavaScript talking directly to the `HTML5 <canvas>` API to ensure 60fps rendering of thousands of individual fire cells without lagging the browser.

---

## 🚀 Getting Started (Run it yourself!)

Want to play with the simulation on your own computer? It takes less than two minutes to set up.

1. **Clone the code to your machine:**
   ```bash
   git clone https://github.com/sreedharhari2006-code/forest_fire_simulator.git
   cd forest_fire_simulator
   ```

2. **Install the necessary dependencies:**
   *(Make sure you have Node.js installed first!)*
   ```bash
   npm install
   ```

3. **Start the engine:**
   ```bash
   npm run dev
   ```

4. **Open your browser!**
   Vite will give you a local URL (usually `http://localhost:5173`). Click it, and you're ready to start simulating! 

---
*Built with passion, data, and a whole lot of JavaScript.* 🌳🔥
