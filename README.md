# Indian Forest Fire Simulator

Welcome to the Indian Forest Fire Simulator. This project is a dynamic, browser-based simulation engine designed to model the spread of wildfires across the Indian subcontinent. It combines real-time weather data, cellular automata mathematics, and interactive mapping to create a realistic and highly interactive experience.

Designed explicitly for government agencies, forestry departments, and disaster management task forces, this application serves as a preemptive analysis tool. By understanding how fires propagate under real-time conditions, authorities can execute preventative measures, allocate resources efficiently, and act decisively before a forest fire escalates into an uncontrollable disaster.

---

## Core Features and Mechanics

### The Dual-Map Interface
The application is split into two distinct visual interfaces, allowing you to both simulate new fires and analyze existing risk zones.

1. **The Simulation Map**
This is your interactive laboratory. It uses a high-resolution satellite base layer, allowing you to see the actual topography and vegetation of India. In this view, you can ignite fires and watch the cellular automata engine calculate the spread in real-time.

2. **The Risk and Heat Map**
By toggling to the second map via the sidebar, the interface transforms into a data visualization dashboard. We built a custom overlay featuring a gradient legend that ranks areas from "Safe" to "Critical Fire." Instead of broad, inaccurate heat zones, the map uses custom clustering algorithms to tightly concentrate data points over actual high-risk areas. This data structure was inspired by active fire reports from NASA FIRMS (Fire Information for Resource Management System) and the Forest Survey of India.

### Live Weather Integration
A fire's behavior is dictated by its environment. When you initiate a fire on the map, the simulator immediately contacts the Open-Meteo API. It passes the exact latitude and longitude of your chosen location and retrieves current environmental data, including:
- Temperature
- Relative Humidity
- Wind Speed
- Wind Direction

This data is not just for display; it is actively fed into the simulation engine. A fire ignited in a humid, still environment will behave entirely differently than a fire caught in a dry, high-speed windstorm.

### Reverse Geocoding
Raw coordinates can be difficult to interpret. To make the interface more intuitive, the application utilizes the Nominatim OpenStreetMap API. When a fire is ignited, the engine translates the raw coordinates into a human-readable location name (for example, "Bhopal, Madhya Pradesh") and logs it in your active session history.

### Ember and Particle Physics
The fire spread is visually represented using an advanced particle system rendered on an HTML5 Canvas. We have included an interactive "Ember Size" slider in the sidebar. This slider allows you to manually control the visual intensity and radius of the glowing fire particles in real-time as the simulation runs.

---

## How the Simulation Engine Works

The core of the fire spread logic is built on a mathematical model known as Cellular Automata. Here is a breakdown of how it calculates the spread:

1. **Grid Generation**
The visible map is divided into an invisible grid. Each cell in this grid represents a specific area of land.

2. **Environmental States**
At any given moment, a cell can exist in one of three states:
- Unburned: The forest is healthy and contains fuel for a potential fire.
- Burning: The cell is actively on fire, emitting heat, and capable of spreading the fire to adjacent cells.
- Burned Out: The fuel has been entirely consumed, meaning the fire can no longer exist or spread through this specific cell.

3. **Spread Probability and Wind Vectoring**
Fire rarely spreads in a perfect circle. The engine calculates the angle between a currently burning cell and its unburned neighbors. It then factors in the live wind direction and wind speed pulled from the API. Cells that lie in the path of the wind are assigned a significantly higher "Spread Probability," causing the virtual fire to dynamically leap and elongate in the direction of the wind, mimicking real-world physics.

---

## Technical Architecture

This project was built to be lightweight, fast, and visually polished without relying on bloated frameworks. 

- **Frontend Build Tool:** Vite is used for bundling and development, ensuring fast server starts and hot module replacement.
- **Styling:** The user interface is built with pure Vanilla CSS. We implemented a custom light-theme design system using CSS variables, flexbox, and backdrop-filters to create a premium, glassmorphic aesthetic.
- **Mapping Engine:** Leaflet.js handles the interactive mapping and zooming mechanics.
- **Heatmaps:** The leaflet.heat plugin is used to render the Risk Map, heavily customized to render tight, localized data clusters.
- **Rendering Engine:** Vanilla JavaScript interacts directly with the HTML5 Canvas API. This ensures the simulation can render thousands of individual fire cells at 60 frames per second without causing browser lag.

---

## Setup and Installation

If you would like to run the simulator locally, follow these steps:

1. **Clone the repository:**
Download the code to your local machine using git.
```bash
git clone https://github.com/sreedharhari2006-code/forest_fire_simulator.git
cd forest_fire_simulator
```

2. **Install dependencies:**
Ensure you have Node.js installed, then run the package manager to install the required libraries.
```bash
npm install
```

3. **Start the development server:**
Launch the Vite server to run the application locally.
```bash
npm run dev
```

4. **Access the application:**
Open your web browser and navigate to the local address provided by the terminal (typically http://localhost:5173).
