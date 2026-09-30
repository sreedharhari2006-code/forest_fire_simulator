# Forest Fire Preemptive Analysis System

The Forest Fire Preemptive Analysis System is a dynamic, browser-based simulation engine designed explicitly for government agencies, forestry departments, and disaster management task forces. 

This application serves as a preemptive analysis tool. By modeling how fires propagate under real-time conditions, authorities can execute preventative measures, allocate resources efficiently, and act decisively before a forest fire escalates into an uncontrollable disaster. It combines real-time weather data, cellular automata mathematics, and interactive mapping to create a realistic forecasting environment for the Indian subcontinent.

---

## Core Operational Features

### Dual-Map Threat Interface
The application is split into two distinct visual interfaces, allowing task forces to both simulate potential new fires and analyze existing historical and active risk zones.

1. **The Tactical Simulation Map**
This is the primary interactive laboratory. It uses a high-resolution satellite base layer, allowing analysts to observe the actual topography and vegetation of India. In this view, operators can ignite theoretical fires at specific coordinates and watch the cellular automata engine calculate the spread in real-time, simulating how a real fire would behave in those precise geographical conditions.

2. **The Strategic Risk and Heat Map**
By toggling to the secondary map via the sidebar, the interface transforms into a macro-level data visualization dashboard. This overlay features a gradient legend that ranks areas from "Safe" to "Critical Fire." To ensure accuracy for resource deployment, the map uses custom clustering algorithms to tightly concentrate data points over actual high-risk areas rather than displaying broad, inaccurate heat zones. This data structure is modeled after active fire reports from NASA FIRMS (Fire Information for Resource Management System) and the Forest Survey of India.

### Live Meteorological Integration
A fire's behavior is dictated by its environment. When an operator initiates a simulated fire on the map, the system immediately contacts the Open-Meteo API. It passes the exact latitude and longitude of the chosen location and retrieves current environmental data, including:
- Ambient Temperature
- Relative Humidity
- Wind Speed
- Wind Direction

This data is actively fed into the simulation engine. A fire ignited in a humid, still environment will behave entirely differently than a fire caught in a dry, high-speed windstorm, allowing authorities to prepare for worst-case weather scenarios.

### Automated Reverse Geocoding
Raw coordinates can be difficult to interpret rapidly during a crisis. To make the interface more actionable, the application utilizes the Nominatim OpenStreetMap API. When a simulation is initiated, the engine translates the raw coordinates into a human-readable location name (for example, "Bhopal, Madhya Pradesh") and logs it in the active session history for easy reporting and communication.

### Ember and Particle Physics Adjustments
The fire spread is visually represented using an advanced particle system rendered on an HTML5 Canvas. We have included an interactive "Ember Size" slider in the sidebar. This tool allows operators to manually control the visual intensity and radius of the glowing fire particles in real-time as the simulation runs, which is useful for visualizing the intensity and spotting distance of a potential blaze.

---

## Technical Simulation Mechanics

The core of the fire spread forecasting logic is built on a mathematical model known as Cellular Automata. Here is a breakdown of how the engine calculates the spread:

1. **Topographical Grid Generation**
The visible map is divided into an invisible grid. Each cell in this grid represents a specific area of land (approximately 25 hectares).

2. **Environmental States**
At any given moment, a cell can exist in one of three states:
- Unburned: The forest is healthy and contains active fuel for a potential fire.
- Burning: The cell is actively on fire, emitting heat, and capable of spreading the fire to adjacent cells.
- Burned Out: The fuel has been entirely consumed, meaning the fire can no longer exist or spread through this specific cell.

3. **Spread Probability and Wind Vectoring**
Fire rarely spreads in a perfect circle. The engine calculates the angle between a currently burning cell and its unburned neighbors. It then factors in the live wind direction and wind speed pulled from the meteorological API. Cells that lie in the path of the wind are assigned a significantly higher "Spread Probability," causing the virtual fire to dynamically leap and elongate in the direction of the wind, mimicking real-world physics.

---

## System Architecture

This project was built to be lightweight, fast, and visually polished to ensure smooth operation on standard government hardware without relying on bloated frameworks. 

- **Frontend Build Tool:** Vite is used for bundling and development, ensuring fast server starts and highly optimized production builds.
- **Styling:** The user interface is built with pure Vanilla CSS. We implemented a custom light-theme design system using CSS variables, flexbox, and backdrop-filters to create a highly readable, professional aesthetic.
- **Mapping Engine:** Leaflet.js handles the interactive mapping and zooming mechanics.
- **Heatmaps:** The leaflet.heat plugin is used to render the Strategic Risk Map, heavily customized to render tight, localized data clusters.
- **Rendering Engine:** Vanilla JavaScript interacts directly with the HTML5 Canvas API. This ensures the simulation can render thousands of individual fire cells at 60 frames per second without causing browser lag.

---

## Deployment and Installation

To deploy the simulator locally on a secure internal network or machine, follow these standard setup steps:

1. **Clone the repository:**
Download the code to your local machine using git.
```bash
git clone https://github.com/sreedharhari2006-code/forest_fire_simulator.git
cd forest_fire_simulator
```

2. **Install dependencies:**
Ensure you have Node.js installed on the host machine, then run the package manager to install the required libraries.
```bash
npm install
```

3. **Start the local server:**
Launch the Vite server to run the application locally.
```bash
npm run dev
```

4. **Access the application:**
Open a web browser and navigate to the local address provided by the terminal (typically http://localhost:5173).
