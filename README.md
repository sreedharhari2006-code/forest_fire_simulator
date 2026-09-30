# Indian Forest Fire Simulator 🔥🇮🇳

A modern, interactive, and data-driven forest fire simulator tailored for the Indian subcontinent. Built with JavaScript, Leaflet.js, and HTML5 Canvas, this application simulates realistic fire spread mechanics based on real-time environmental data and highlights actual high-risk zones across India.

## ✨ Features

- **Interactive Cellular Automata Simulation:** Drop a fire anywhere on the map and watch it spread. The simulation calculates fire propagation using cellular automata, factoring in live wind speed, wind direction, and surrounding vegetation dynamics.
- **Real-Time Environmental Data:** Integrates with the **Open-Meteo API** to pull live temperature, humidity, and wind conditions for any clicked coordinate.
- **Reverse Geocoding:** Automatically resolves geographical coordinates into human-readable place names (e.g., "Bhopal, Madhya Pradesh") via the **Nominatim OpenStreetMap API**.
- **Adjustable Ember Physics:** Control the visual size and intensity of fire embers dynamically using an interactive slider. 
- **Windy.com Style Heatmap UI:** Features a sleek, glassmorphic overlay interface with a multi-layered Risk & Heat Map. It visualizes high-risk zones and active fire clusters using synthetic data inspired by actual **NASA FIRMS** and **FSI (Forest Survey of India)** reports.
- **Modern Light Theme:** A highly aesthetic, clean user interface with soft drop shadows, rounded corners, and intuitive sidebar navigation.

## 🚀 Getting Started

### Prerequisites

You need Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sreedharhari2006-code/forest_fire_simulator.git
   cd forest_fire_simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server address provided by Vite (usually `http://localhost:5173`).

## 🛠️ Built With

- **Vite** - Frontend tooling and bundling.
- **Vanilla JS & HTML5 Canvas** - Core simulation engine and rendering.
- **Leaflet.js** - Interactive mapping.
- **Leaflet.heat** - Heatmap generation.
- **Open-Meteo API** - Live weather data.
- **Nominatim API** - Reverse geocoding.

## 🗺️ How to Use

1. **Ignite a Fire**: Ensure you are in the **Simulation Map** tab. You can either click anywhere on the map or enter specific Lat/Lng coordinates in the sidebar.
2. **Observe**: Once ignited, the app will fetch the live weather for that exact spot and immediately start simulating the fire's spread based on those conditions.
3. **Control Embers**: Use the "Ember Size" slider in the sidebar to increase or decrease the visual intensity of the fire particles.
4. **Analyze Risk**: Switch over to the **Risk & Heat Map** tab to view historical vulnerabilities and active hotspots using the Windy.com-inspired overlay.

## 📝 License

This project is open-source and available for educational and simulation purposes.
