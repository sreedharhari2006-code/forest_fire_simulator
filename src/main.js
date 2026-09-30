import './style.css'

// Configuration
const INDIA_CENTER = [22.9734, 78.6569];
const INITIAL_ZOOM = 5;

// High Risk Zones Data
const HIGH_RISK_ZONES = [
    { name: "Simlipal National Park, Odisha", lat: 21.9333, lng: 86.3500 },
    { name: "Bandipur Tiger Reserve, Karnataka", lat: 11.6667, lng: 76.6222 },
    { name: "Nallamala Forest, Andhra Pradesh", lat: 15.8200, lng: 78.8900 },
    { name: "Kanha National Park, MP", lat: 22.3345, lng: 80.6115 },
    { name: "Sariska Tiger Reserve, Rajasthan", lat: 27.3200, lng: 76.4300 }
];

// Live FSI/NASA Data (Representative subset of top states in current FSI data)
const LIVE_FIRES = [
    { name: "NASA FIRMS Hotspot, Andaman Islands", lat: 14.1000, lng: 91.7000 },
    { name: "NASA FIRMS Hotspot, Madhya Pradesh", lat: 22.4512, lng: 80.5231 },
    { name: "FSI Large Fire, Maharashtra", lat: 20.2450, lng: 79.2810 },
    { name: "Active Fire Cluster, Odisha", lat: 21.9300, lng: 86.3550 },
    { name: "NASA FIRMS Hotspot, Chhattisgarh", lat: 19.1220, lng: 80.3550 },
    { name: "FSI Reported, Andhra Pradesh", lat: 15.8200, lng: 78.8910 }
];

// Initialize Leaflet Map
const map = L.map('map', {
    center: INDIA_CENTER,
    zoom: INITIAL_ZOOM,
    minZoom: 4,
    maxZoom: 12
});

// 1. Satellite Base Layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

// 2. Labels and Boundaries Overlay
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri'
}).addTo(map);

// Initialize Second Map (Risk/Heat Map)
const riskMap = L.map('map-risk', {
    center: INDIA_CENTER,
    zoom: INITIAL_ZOOM,
    minZoom: 4,
    maxZoom: 12,
    zoomControl: false // Hide zoom controls on the second map to save space
});

// Use Esri Dark Gray Base for the heat map to avoid API Key issues
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(riskMap);

// Generate realistic heat map points
const heatData = [];

function addCluster(centerLat, centerLng, radius, count, intensity) {
    for (let i = 0; i < count; i++) {
        const lat = centerLat + (Math.random() - 0.5) * radius;
        const lng = centerLng + (Math.random() - 0.5) * radius;
        heatData.push([lat, lng, intensity]);
    }
}

// Central/Eastern India (High Vulnerability)
addCluster(22.0, 81.0, 3.0, 300, 0.8); // MP / Chhattisgarh
addCluster(20.5, 84.5, 2.0, 150, 0.9); // Odisha
addCluster(19.0, 79.0, 2.5, 120, 0.7); // Maharashtra
addCluster(17.0, 80.0, 2.0, 100, 0.6); // Andhra
addCluster(24.0, 85.0, 1.5, 120, 0.8); // Jharkhand

// Himalayas / North
addCluster(30.0, 79.0, 1.2, 80, 0.6); // Uttarakhand
addCluster(32.0, 76.0, 1.0, 50, 0.5); // Himachal

// Northeast
addCluster(26.0, 92.0, 2.0, 100, 0.7); // Assam / Meghalaya
addCluster(23.5, 93.0, 1.0, 50, 0.6); // Mizoram

// Add the actual exact coordinates from our database to the heatmap
HIGH_RISK_ZONES.forEach(zone => heatData.push([zone.lat, zone.lng, 1.0]));
LIVE_FIRES.forEach(zone => heatData.push([zone.lat, zone.lng, 1.0]));

// Create the Native Leaflet Heatmap Layer
L.heatLayer(heatData, {
    radius: 18,
    blur: 15,
    maxZoom: 9,
    max: 1.0,
    gradient: {0.1: '#3b82f6', 0.4: '#10b981', 0.6: '#eab308', 0.8: '#ef4444', 1.0: '#7f1d1d'}
}).addTo(riskMap);

// Sync panning and zooming between the two maps
map.on('move', () => {
    riskMap.setView(map.getCenter(), map.getZoom(), { animate: false });
});
riskMap.on('move', () => {
    map.setView(riskMap.getCenter(), riskMap.getZoom(), { animate: false });
});

// Simulation State
let isSimulating = false;
let animationId;
let grid = [];
let nextGrid = [];
let GRID_WIDTH, GRID_HEIGHT;
const CELL_SIZE = 4; // Screen pixels per simulation cell
let simDurationTicks = 0; 
let totalBurned = 0; 
const HECTARES_PER_CELL = 25;
let emberSizeMultiplier = 1.5;

// Wind Particle System
const NUM_WIND_PARTICLES = 150;
let windParticles = [];

function initWindParticles() {
    windParticles = [];
    for(let i=0; i<NUM_WIND_PARTICLES; i++) {
        windParticles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 1.5 + 0.5,
            life: Math.random()
        });
    }
}

// Simulation params populated by API
const env = {
    temp: 25,
    humidity: 50,
    windSpeed: 10,
    windDir: 0
};

// Canvas Setup
const canvas = document.getElementById('fire-canvas');
const ctx = canvas.getContext('2d');

const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    offscreenCanvas.width = window.innerWidth;
    offscreenCanvas.height = window.innerHeight;
    
    GRID_WIDTH = Math.floor(canvas.width / CELL_SIZE);
    GRID_HEIGHT = Math.floor(canvas.height / CELL_SIZE);
}
window.addEventListener('resize', () => {
    if(!isSimulating) resizeCanvas();
});
resizeCanvas();

// States
const EMPTY = 0;
const TREE = 1;
const BURNING = 2;
const BURNT = 3;

// Colors
const colors = {
    [EMPTY]: 'transparent', 
    [TREE]: 'transparent',  
    [BURNT]: 'rgba(40, 30, 25, 0.4)' 
};

// UI Elements
const uiWeather = document.getElementById('weather-info');
const uiControls = document.getElementById('sim-controls');
const uiReport = document.getElementById('report-panel');
const repStatus = document.getElementById('rep-status');
const repArea = document.getElementById('rep-area');
const repActive = document.getElementById('rep-active');
const repTime = document.getElementById('rep-time');
const modeClickUI = document.getElementById('mode-click-ui');
const modeCoordsUI = document.getElementById('mode-coords-ui');
const errToast = document.getElementById('error-toast');
const historyList = document.getElementById('history-list');

// Error Handler
const showError = (msg) => {
    errToast.innerText = msg;
    errToast.classList.remove('hidden');
    setTimeout(() => errToast.classList.add('hidden'), 3500);
};

// Sidebar Tabs Logic
document.querySelectorAll('.side-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.side-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.side-content').forEach(c => c.classList.add('hidden'));
        e.target.classList.add('active');
        document.getElementById(e.target.dataset.target).classList.remove('hidden');
    });
});
// Ember Size Control
const emberSizeInput = document.getElementById('ember-size');
const emberSizeVal = document.getElementById('ember-size-val');
if (emberSizeInput) {
    emberSizeInput.addEventListener('input', (e) => {
        emberSizeMultiplier = parseFloat(e.target.value);
        if (emberSizeVal) emberSizeVal.textContent = emberSizeMultiplier.toFixed(1) + 'x';
    });
}
// Map Toggle Logic
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        targetBtn.classList.add('active');
        
        document.querySelectorAll('.map-wrapper').forEach(m => {
            m.classList.add('hidden-map');
            m.classList.remove('active-map');
        });
        
        const targetId = targetBtn.dataset.map;
        const targetContainer = document.getElementById(targetId);
        targetContainer.classList.remove('hidden-map');
        targetContainer.classList.add('active-map');
        
        if (targetId === 'map-risk-container') {
            riskMap.invalidateSize();
            document.getElementById('ui-overlay').classList.add('hidden');
        } else {
            map.invalidateSize();
            document.getElementById('ui-overlay').classList.remove('hidden');
        }
    });
});

const hrList = document.getElementById('highrisk-list');
HIGH_RISK_ZONES.forEach(zone => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${zone.name}</strong><br><span class="text-muted text-sm">Lat: ${zone.lat.toFixed(2)}, Lng: ${zone.lng.toFixed(2)}</span>`;
    li.addEventListener('click', () => {
        if(isSimulating) return showError("Stop current simulation first.");
        map.setView([zone.lat, zone.lng], 10, {animate: false});
        
        document.getElementById('input-lat').value = zone.lat.toFixed(4);
        document.getElementById('input-lng').value = zone.lng.toFixed(4);
        
        setTimeout(() => {
            const pixelPos = map.latLngToContainerPoint([zone.lat, zone.lng]);
            const gridX = Math.floor(pixelPos.x / CELL_SIZE);
            const gridY = Math.floor(pixelPos.y / CELL_SIZE);
            igniteAt(zone.lat, zone.lng, gridX, gridY);
        }, 300);
    });
    hrList.appendChild(li);
});

// Populate Live Fires List UI
const liveList = document.getElementById('live-list');
LIVE_FIRES.forEach(zone => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${zone.name}</strong><br><span class="text-muted text-sm">Lat: ${zone.lat.toFixed(2)}, Lng: ${zone.lng.toFixed(2)}</span>`;
    li.addEventListener('click', () => {
        if(isSimulating) return showError("Stop current simulation first.");
        map.setView([zone.lat, zone.lng], 10, {animate: false});
        
        document.getElementById('input-lat').value = zone.lat.toFixed(4);
        document.getElementById('input-lng').value = zone.lng.toFixed(4);
        
        setTimeout(() => {
            const pixelPos = map.latLngToContainerPoint([zone.lat, zone.lng]);
            const gridX = Math.floor(pixelPos.x / CELL_SIZE);
            const gridY = Math.floor(pixelPos.y / CELL_SIZE);
            igniteAt(zone.lat, zone.lng, gridX, gridY);
        }, 300);
    });
    liveList.appendChild(li);
});

// Mode Selector Logic
let currentMode = 'click';
document.querySelectorAll('input[name="sim-mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentMode = e.target.value;
        if (currentMode === 'click') {
            modeClickUI.classList.remove('hidden');
            modeCoordsUI.classList.add('hidden');
        } else {
            modeClickUI.classList.add('hidden');
            modeCoordsUI.classList.remove('hidden');
        }
    });
});

async function fetchWeather(lat, lng) {
    try {
        document.getElementById('loc-val').innerText = "Locating...";
        
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`);
        if (!res.ok) throw new Error("API failed");
        
        const data = await res.json();
        const current = data.current;
        
        env.temp = current.temperature_2m;
        env.humidity = current.relative_humidity_2m;
        env.windSpeed = current.wind_speed_10m;
        env.windDir = current.wind_direction_10m;
        
        // Fetch place name via Nominatim Reverse Geocoding
        let placeName = `${parseFloat(lat).toFixed(2)}, ${parseFloat(lng).toFixed(2)}`;
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                if (geoData.address) {
                    const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state_district;
                    const state = geoData.address.state || geoData.address.country;
                    if (city && state) placeName = `${city}, ${state}`;
                    else if (state) placeName = state;
                    else if (geoData.name) placeName = geoData.name;
                }
            }
        } catch(e) {
            console.error("Geocoding failed", e);
        }
        
        // Update UI
        document.getElementById('loc-val').innerText = placeName;
        document.getElementById('loc-val').title = `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
        document.getElementById('temp-val').innerText = env.temp;
        document.getElementById('hum-val').innerText = env.humidity;
        document.getElementById('wind-spd-val').innerText = env.windSpeed;
        document.getElementById('wind-arrow').style.transform = `rotate(${env.windDir}deg)`;
        
        uiWeather.classList.remove('hidden');
        uiControls.classList.remove('hidden');
        uiReport.classList.remove('hidden');
        document.querySelector('.mode-selector').classList.add('hidden'); 
        document.getElementById('mode-click-ui').classList.add('hidden');
        document.getElementById('mode-coords-ui').classList.add('hidden');
        
        // Add to history
        const emptyState = historyList.querySelector('.empty-state');
        if(emptyState) emptyState.remove();
        const li = document.createElement('li');
        li.innerHTML = `<strong>${placeName}</strong><br><span class="text-muted text-sm">Temp: ${env.temp}°C | Wind: ${env.windSpeed}km/h</span>`;
        historyList.prepend(li);
        
    } catch(e) {
        console.error(e);
        showError("Failed to fetch live weather data. Using generic defaults.");
        // Defaults if failed
        env.temp = 28; env.humidity = 40; env.windSpeed = 15; env.windDir = 45;
        document.getElementById('wind-arrow').style.transform = `rotate(45deg)`;
        uiWeather.classList.remove('hidden');
        uiControls.classList.remove('hidden');
        uiReport.classList.remove('hidden');
        document.querySelector('.mode-selector').classList.add('hidden'); 
        document.getElementById('mode-click-ui').classList.add('hidden');
        document.getElementById('mode-coords-ui').classList.add('hidden');
    }
}

function initGrid(startX, startY) {
    grid = new Array(GRID_HEIGHT).fill(0).map(() => new Array(GRID_WIDTH).fill(EMPTY));
    
    // Create natural firebreaks and varying fuel density
    for(let y = 0; y < GRID_HEIGHT; y++) {
        for(let x = 0; x < GRID_WIDTH; x++) {
            // 85% chance to be flammable tree, 15% natural barrier (rock, river, barren)
            grid[y][x] = Math.random() < 0.85 ? TREE : EMPTY;
        }
    }
    
    nextGrid = grid.map(row => [...row]);
    simDurationTicks = 0;
    totalBurned = 0;
    
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Ignite epicenter
    const r = 3;
    for(let dy=-r; dy<=r; dy++){
        for(let dx=-r; dx<=r; dx++){
            if (startY+dy >= 0 && startY+dy < GRID_HEIGHT && startX+dx >= 0 && startX+dx < GRID_WIDTH) {
                grid[startY+dy][startX+dx] = BURNING;
            }
        }
    }
    initWindParticles();
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw all burnt cells instantly from cached offscreen canvas
    ctx.drawImage(offscreenCanvas, 0, 0);
    
    // 2. Draw burning cells as glowing radial gradients
    ctx.globalCompositeOperation = 'lighter';
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (grid[y][x] === BURNING) {
                const cx = x * CELL_SIZE + CELL_SIZE/2;
                const cy = y * CELL_SIZE + CELL_SIZE/2;
                const r = CELL_SIZE * emberSizeMultiplier + (Math.random() * 2);
                
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); 
                grad.addColorStop(0.3, 'rgba(255, 200, 0, 0.7)'); 
                grad.addColorStop(0.6, 'rgba(255, 60, 0, 0.5)');  
                grad.addColorStop(1, 'rgba(255, 0, 0, 0)');
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }
    
    ctx.globalCompositeOperation = 'source-over';
    
    // 3. Draw Wind Particles
    const windRad = (env.windDir - 90) * (Math.PI / 180); 
    const vx = Math.cos(windRad);
    const vy = Math.sin(windRad);
    
    ctx.lineWidth = 1.5;
    for(let p of windParticles) {
        // Move particle
        p.x += vx * p.speed * (Math.max(1, env.windSpeed) / 4);
        p.y += vy * p.speed * (Math.max(1, env.windSpeed) / 4);
        p.life -= 0.015;
        
        if(p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            p.life = 1.0;
        }
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.life * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - vx * p.length, p.y - vy * p.length);
        ctx.stroke();
    }
}

function step() {
    let burningCount = 0;
    const windRad = (env.windDir - 90) * (Math.PI / 180); 
    const windVecX = Math.cos(windRad);
    const windVecY = Math.sin(windRad);
    
    const tempFactor = Math.max(0.1, 0.5 + ((env.temp - 10) / 40));
    const moistFactor = Math.max(0.1, 1.0 - (env.humidity / 100));
    
    // Simulation fatigue and containment
    // As the fire burns longer, natural containment and firefighting efforts increase
    const fatigue = Math.max(0.05, 1.0 - (simDurationTicks / 1000)); 
    const baseProb = 0.08 * tempFactor * moistFactor * fatigue;

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const state = grid[y][x];
            nextGrid[y][x] = state;

            if (state === TREE) {
                let igniteProb = 0;
                for(let dy=-1; dy<=1; dy++){
                    for(let dx=-1; dx<=1; dx++){
                        if (dx === 0 && dy === 0) continue;
                        let nx = x + dx, ny = y + dy;
                        if(nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
                            if (grid[ny][nx] === BURNING) {
                                const mag = Math.sqrt(dx*dx + dy*dy);
                                const dot = ((-dx/mag) * windVecX + (-dy/mag) * windVecY);
                                const windEffect = 1 + Math.max(0, dot) * (env.windSpeed / 10);
                                igniteProb += baseProb * windEffect / mag;
                            }
                        }
                    }
                }
                if (Math.random() < igniteProb) {
                    nextGrid[y][x] = BURNING;
                    burningCount++;
                    totalBurned++;
                }
            } else if (state === BURNING) {
                // 15% chance to burn out completely per frame, creating shorter lived fire fronts
                if (Math.random() < 0.15) {
                    nextGrid[y][x] = BURNT;
                    
                    // Cache the burnt cell to offscreen canvas permanently
                    offscreenCtx.fillStyle = colors[BURNT];
                    offscreenCtx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                } else {
                    burningCount++;
                }
            }
        }
    }
    
    let temp = grid;
    grid = nextGrid;
    nextGrid = temp;
    simDurationTicks++;
    
    // Update Report Live
    repArea.innerText = (totalBurned * HECTARES_PER_CELL).toLocaleString();
    repActive.innerText = burningCount.toLocaleString();
    repTime.innerText = (simDurationTicks / 10).toFixed(1); 
    
    if (burningCount === 0) {
        repStatus.innerText = "Contained";
        repStatus.style.color = "#22c55e";
        
        const btnReset = document.getElementById('btn-reset');
        btnReset.innerText = "Start New Burn";
        btnReset.classList.remove('secondary');
        btnReset.classList.add('primary', 'pulse-anim');
        
        return false; // Stop the simulation
    }
    return true; // Continue simulation
}

let lastTime = 0;
function loop(timestamp) {
    if (!isSimulating) return;
    if (timestamp - lastTime >= 1000/30) {
        const keepGoing = step();
        drawGrid();
        lastTime = timestamp;
        
        if (!keepGoing) {
            isSimulating = false;
            return; // Terminate loop completely
        }
    }
    animationId = requestAnimationFrame(loop);
}

let isFetching = false;

async function igniteAt(lat, lng, gridX, gridY) {
    if (isSimulating || isFetching) return;
    isFetching = true;
    
    // Anti-Ocean Check using free Reverse Geocode
    try {
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`);
        const geoData = await geoRes.json();
        
        // If there's no countryCode, it's deep ocean.
        if (!geoData.countryCode) {
            showError("Cannot ignite fire on deep ocean/water!");
            isFetching = false;
            return;
        }
    } catch (e) {
        console.warn("Geocode check failed", e);
    }
    
    await fetchWeather(lat, lng);
    
    // Lock map
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    
    document.getElementById('map').style.filter = 'brightness(0.7)';
    
    isSimulating = true;
    isFetching = false;
    repStatus.innerText = "Spreading";
    repStatus.style.color = "#f97316";
    initGrid(gridX, gridY);
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
}

// Click Map Event
map.on('click', (e) => {
    if (isSimulating) return;
    
    if (currentMode === 'click') {
        const pixelPos = map.latLngToContainerPoint(e.latlng);
        const gridX = Math.floor(pixelPos.x / CELL_SIZE);
        const gridY = Math.floor(pixelPos.y / CELL_SIZE);
        igniteAt(e.latlng.lat, e.latlng.lng, gridX, gridY);
    } else {
        document.getElementById('input-lat').value = e.latlng.lat.toFixed(4);
        document.getElementById('input-lng').value = e.latlng.lng.toFixed(4);
    }
});

// Manual Coord Event
document.getElementById('btn-ignite-coords').addEventListener('click', () => {
    if (isSimulating) return;
    const lat = parseFloat(document.getElementById('input-lat').value);
    const lng = parseFloat(document.getElementById('input-lng').value);
    
    if (isNaN(lat) || isNaN(lng)) return showError("Invalid coordinates entered.");
    
    // Center map to coords
    map.setView([lat, lng], 10, {animate: false});
    
    // Wait for map to settle then get center pixel
    setTimeout(() => {
        const pixelPos = map.latLngToContainerPoint([lat, lng]);
        const gridX = Math.floor(pixelPos.x / CELL_SIZE);
        const gridY = Math.floor(pixelPos.y / CELL_SIZE);
        igniteAt(lat, lng, gridX, gridY);
    }, 200);
});

function stopSimulation() {
    isSimulating = false;
    cancelAnimationFrame(animationId);
    
    // Reset map
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
    
    document.getElementById('map').style.filter = 'none';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    uiWeather.classList.add('hidden');
    uiControls.classList.add('hidden');
    uiReport.classList.add('hidden');
    
    document.querySelector('.mode-selector').classList.remove('hidden');
    if (currentMode === 'click') {
        document.getElementById('mode-click-ui').classList.remove('hidden');
    } else {
        document.getElementById('mode-coords-ui').classList.remove('hidden');
    }
    
    // Reset button state
    const btnReset = document.getElementById('btn-reset');
    btnReset.innerText = "Stop Simulation";
    btnReset.classList.remove('primary', 'pulse-anim');
    btnReset.classList.add('secondary');
}

document.getElementById('btn-reset').addEventListener('click', stopSimulation);
