<!-- <template>
    <div class="health-map">
      
        <div class="health-map-container">
            <h3>Health Facilities Near You</h3>
            <div class="map-search-bar">
                <div>
                    <Icon icon="hugeicons:search-02" :style="{fontSize:'24px'}"/>
                </div>
                <div class="input-content">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        @input="handleSearch"
                        @keyup.enter="searchLocation"
                        placeholder="Search for clinics, Hospitals, Pharmacies..."
                    />
                    <div v-if="searchSuggestions.length > 0" class="search-suggestions">
                        <div 
                            v-for="suggestion in searchSuggestions" 
                            :key="suggestion.place_id"
                            @click="selectSuggestion(suggestion)"
                            class="suggestion-item"
                        >
                            {{ suggestion.display_name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="map-view-bar">
                <div id="map"></div>
            </div>
            <div class="map-hos-bar" v-if="selectedLocation">
                <div class="central-edit">
                    <div>
                        <h4>{{ selectedLocation.name || 'Selected Location' }}</h4>
                    </div>
                    <div>
                        <span v-if="selectedLocation.distance">{{ selectedLocation.distance }} Away</span>
                        <span v-if="selectedLocation.isOpen !== undefined">
                            {{ selectedLocation.isOpen ? 'Open 24/7' : 'Closed' }}
                        </span>
                    </div>
                </div>
                <div>
                    <div class="action-buttons">
                    <button @click="showRoute" class="direction-btn">
                        <Icon icon="carbon:direction-straight" class="mr-2"/>
                        Get Direction
                    </button>
                    <button @click="shareLocation" class="share-btn">
                        <Icon icon="carbon:share" class="mr-2"/>
                        Share
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from "@iconify/vue"
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L from 'leaflet'
import 'leaflet-routing-machine'

const map = ref(null)
const searchQuery = ref('')
const searchSuggestions = ref([])
const userLocation = ref(null)
const routingControl = ref(null)
const buildings = ref({})
const markers = ref({})
const selectedLocation = ref(null)
const clickMarker = ref(null)
const zoomHandler = ref(null)
const reverseGeocodeTimeout = ref(null)

// Sample health facilities data with building footprints
const healthFacilities = [
    {
        id: 1,
        name: 'Central Hospital',
        coords: [51.505, -0.09],
        distance: '2.3km',
        isOpen: true,
        type: 'Hospital',
        building: [
            [51.5052, -0.0902],
            [51.5052, -0.0898],
            [51.5048, -0.0898],
            [51.5048, -0.0902]
        ]
    },
    {
        id: 2,
        name: 'City Clinic',
        coords: [51.51, -0.1],
        distance: '1.8km',
        isOpen: false,
        type: 'Clinic',
        building: [
            [51.5102, -0.1002],
            [51.5102, -0.0998],
            [51.5098, -0.0998],
            [51.5098, -0.1002]
        ]
    }
]

const buildingStyle = {
    color: '#3388ff',
    fillColor: '#3388ff',
    fillOpacity: 0.4,
    weight: 2
}

const selectedBuildingStyle = {
    color: '#ff4444',
    fillColor: '#ff4444',
    fillOpacity: 0.6,
    weight: 3
}

const reverseGeocode = async (lat, lng) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const data = await response.json()
        return data.display_name || 'Selected Location'
    } catch (error) {
        console.error('Reverse geocoding error:', error)
        return 'Selected Location'
    }
}

const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng
    
    // Remove previous click marker and cleanup old zoom handler
    if (clickMarker.value) {
        map.value.removeLayer(clickMarker.value)
    }
    if (zoomHandler.value) {
        map.value.off('zoomend', zoomHandler.value)
    }
    
    // Clear any existing routing
    if (routingControl.value) {
        map.value.removeControl(routingControl.value)
    }
    
    // Get location name
    const locationName = await reverseGeocode(lat, lng)
    
    // Create new marker at clicked location
    clickMarker.value = L.marker([lat, lng], {
        zIndexOffset: 1000,
        draggable: false
    })
        .addTo(map.value)
        .bindPopup(locationName)
        .openPopup()
    
    // Store original coordinates
    const originalLatLng = [lat, lng]
    
    // Create an optimized zoom handler
    zoomHandler.value = () => {
        if (clickMarker.value) {
            clickMarker.value.setLatLng(originalLatLng)
        }
    }
    
    // Add zoom event listener with debounce
    map.value.on('zoomend', zoomHandler.value)
    
    // Update selected location
    selectedLocation.value = {
        name: locationName,
        coords: originalLatLng
    }
    
    // Calculate distance from user location if available
    if (userLocation.value) {
        selectedLocation.value.distance = 
            `${calculateDistance(userLocation.value, originalLatLng).toFixed(1)}km`
    }
}

const selectFacility = (facility) => {
    // Remove click marker if it exists
    if (clickMarker.value) {
        map.value.removeLayer(clickMarker.value)
    }
    
    // Clear any existing routing
    if (routingControl.value) {
        map.value.removeControl(routingControl.value)
    }
    
    // Reset all buildings to default style
    Object.values(buildings.value).forEach(building => {
        building.setStyle(buildingStyle)
    })
    
    // Set selected building to highlighted style
    buildings.value[facility.id].setStyle(selectedBuildingStyle)
    
    // Update selected location
    selectedLocation.value = facility
    
    // Add or update facility marker with zIndexOffset to ensure visibility
    if (markers.value[facility.id]) {
        map.value.removeLayer(markers.value[facility.id])
    }
    
    markers.value[facility.id] = L.marker(facility.coords, {
        zIndexOffset: 1000
    })
        .addTo(map.value)
        .bindPopup(facility.name)
        .openPopup()
    
    // Pan map to selected building
    map.value.panTo(facility.coords)
}

let searchTimeout = null
const handleSearch = async () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    
    if (searchQuery.value.length < 3) {
        searchSuggestions.value = []
        return
    }

    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`
            )
            const data = await response.json()
            searchSuggestions.value = data.slice(0, 5)
        } catch (error) {
            console.error('Search error:', error)
            searchSuggestions.value = []
        }
    }, 300)
}

const selectSuggestion = async (suggestion) => {
    searchQuery.value = suggestion.display_name
    searchSuggestions.value = []
    
    const [lat, lon] = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)]
    
    // Remove previous click marker and cleanup old zoom handler
    if (clickMarker.value) {
        map.value.removeLayer(clickMarker.value)
    }
    if (zoomHandler.value) {
        map.value.off('zoomend', zoomHandler.value)
    }
    
    // Clear any existing routing
    if (routingControl.value) {
        map.value.removeControl(routingControl.value)
    }
    
    // Create marker
    clickMarker.value = L.marker([lat, lon], {
        zIndexOffset: 1000,
        draggable: false
    })
        .addTo(map.value)
        .bindPopup(suggestion.display_name)
        .openPopup()
    
    // Store original coordinates
    const originalLatLng = [lat, lon]
    
    // Create an optimized zoom handler
    zoomHandler.value = () => {
        if (clickMarker.value) {
            clickMarker.value.setLatLng(originalLatLng)
        }
    }
    
    // Add zoom event listener
    map.value.on('zoomend', zoomHandler.value)
    
    // Update selected location
    selectedLocation.value = {
        name: suggestion.display_name,
        coords: originalLatLng
    }
    
    // Calculate distance if user location is available
    if (userLocation.value) {
        selectedLocation.value.distance = 
            `${calculateDistance(userLocation.value, originalLatLng).toFixed(1)}km`
    }
    
    // Optimize map movement
    map.value.setView([lat, lon], 13, {
        animate: true,
        duration: 0.5  // Reduced animation duration
    })
    
    await searchNearbyFacilities([lat, lon])
}

const searchLocation = () => {
    if (searchSuggestions.value.length > 0) {
        selectSuggestion(searchSuggestions.value[0])
    }
}

const calculateDistance = (point1, point2) => {
    const R = 6371
    const lat1 = point1[0] * Math.PI / 180
    const lat2 = point2[0] * Math.PI / 180
    const lon1 = point1[1] * Math.PI / 180
    const lon2 = point2[1] * Math.PI / 180
    
    const dLat = lat2 - lat1
    const dLon = lon2 - lon1
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
}

const searchNearbyFacilities = async ([lat, lon]) => {
    healthFacilities.forEach(facility => {
        facility.distance = `${calculateDistance([lat, lon], facility.coords).toFixed(1)}km`
    })
}

const showRoute = () => {
    if (!userLocation.value) {
        alert('Please allow location access to show directions')
        return
    }

    if (!selectedLocation.value) {
        alert('Please select a destination')
        return
    }

    if (routingControl.value) {
        map.value.removeControl(routingControl.value)
    }

    routingControl.value = L.Routing.control({
        waypoints: [
            L.latLng(userLocation.value[0], userLocation.value[1]),
            L.latLng(selectedLocation.value.coords[0], selectedLocation.value.coords[1])
        ],
        routeWhileDragging: true,
        lineOptions: {
            styles: [{ color: '#6FA1EC', weight: 4 }]
        },
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true
    }).addTo(map.value)
}

// Update initMap function to include performance optimizations
const initMap = () => {
    map.value = L.map('map', {
        // Add these options for better performance
        preferCanvas: true,  // Use Canvas instead of SVG for better performance
        wheelDebounceTime: 150,  // Debounce wheel events
        zoomSnap: 0.5,  // Smooth zoom
        zoomDelta: 0.5,
        fadeAnimation: false,  // Disable unnecessary animations
    }).setView([51.505, -0.09], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 4,
        tileSize: 256,
        keepBuffer: 2  // Reduce tile buffer for better performance
    }).addTo(map.value)

    // Add building polygons for health facilities
    healthFacilities.forEach(facility => {
        const building = L.polygon(facility.building, buildingStyle)
            .addTo(map.value)
            .bindTooltip(facility.name, {
                permanent: false,
                direction: 'top'
            })
            .on('click', () => {
                selectFacility(facility)
            })
        
        buildings.value[facility.id] = building
    })

    map.value.on('click', handleMapClick)
}

const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            userLocation.value = [latitude, longitude]
            map.value.setView([latitude, longitude], 13)
            
            // Add user location marker with zIndexOffset
            L.marker([latitude, longitude], {
                zIndexOffset: 1000
            })
                .addTo(map.value)
                .bindPopup('You are here')
                .openPopup()
        })
    }
}

onMounted(() => {
    initMap()
    getUserLocation()
})
</script>


<style scoped>
.health-map {
    width: 100%;
    height: 95vh;
    background-color: var(--main-bg);
    color: var(--text-primary);
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
    display: flex;
    flex-direction: column;
}

.health-map-container {
    background-color: var(--secondary-bg);
    width: 99%;
    height: 95%;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Added consistent gap between elements */
}

.map-search-bar {
    width: 100%;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem;
    background-color: var(--main-bg);
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.map-search-bar input {
    width: 100%;
    height: 100%;
    font-size: 15px;
    border: none;
    background-color: transparent;
    border-radius: 0.5rem;
    padding-left: 0.5rem;
    color: var(--text-primary);
    transition: all 0.2s ease;
}

.map-search-bar input:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.02);
}

.search-suggestions {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10000000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    max-height: 0;
    overflow: hidden;
}

.search-suggestions:not(:empty) {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    max-height: 300px;
    overflow-y: auto;
}

.suggestion-item {
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
}

.map-view-bar {
    width: 100%;
    flex-grow: 1;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

#map {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
}

.map-hos-bar {
    width: 100%;
    min-height: 4rem;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.map-hos-bar button {
    background-color: var(--accent-color);
    height: 3rem;
    margin-right: 1rem;
    border-radius: 0.5rem;
    color: white;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    min-width: 5.5rem;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
    padding: 0 1.5rem;
}

.map-hos-bar button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.map-hos-bar button:active {
    transform: translateY(0);
}

.central-edit {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.central-edit span {
    color: var(--text-secondary);
    margin-right: 0.75rem;
    font-size: 0.9rem;
}

.input-content {
    width: 100%;
    position: relative;
}

/* Custom scrollbar for suggestions */
.search-suggestions::-webkit-scrollbar {
    width: 6px;
}

.search-suggestions::-webkit-scrollbar-track {
    background: transparent;
}

.search-suggestions::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

@media screen and (max-width: 768px) {
    .health-map-container {
        height: auto;
        min-height: 50vh;
    }
    
    .map-view-bar {
        height: 50vh;
    }
    
    .map-hos-bar {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .central-edit {
        width: 100%;
        align-items: center;
    }
    
    .map-hos-bar button {
        width: 100%;
        max-width: 300px;
    }

    .search-suggestions {
        max-height: 40vh;
    }
}
</style> -->


<template>
    <div class="health-map">
        <div class="health-map-container">
            <h3>Health Facilities Near You</h3>
            <div class="map-search-bar">
                <div>
                    <Icon icon="hugeicons:search-02" :style="{fontSize:'24px'}"/>
                </div>
                <div class="input-content">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        @input="handleSearch"
                        @keyup.enter="searchLocation"
                        placeholder="Search for clinics, Hospitals, Pharmacies..."
                    />
                    <div v-if="searchSuggestions.length > 0" class="search-suggestions">
                        <div 
                            v-for="suggestion in searchSuggestions" 
                            :key="suggestion.place_id"
                            @click="selectSuggestion(suggestion)"
                            class="suggestion-item"
                        >
                            {{ suggestion.display_name }}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Facility filter controls
            <div class="filter-controls">
                <div class="radius-control">
                    <label for="radius-slider">Search Radius: {{ searchRadius }}km</label>
                    <input 
                        type="range" 
                        id="radius-slider" 
                        min="1" 
                        max="20" 
                        step="0.5" 
                        v-model.number="searchRadius"
                        @input="updateNearbyFacilities"
                    />
                </div>
                <div class="facility-types">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="facilityFilters.hospital" @change="updateNearbyFacilities" />
                        Hospitals
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="facilityFilters.clinic" @change="updateNearbyFacilities" />
                        Clinics
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="facilityFilters.pharmacy" @change="updateNearbyFacilities" />
                        Pharmacies
                    </label>
                </div>
            </div> -->
            
            <div class="map-view-bar">
                <div id="map"></div>
            </div>
            
            <!-- <div class="nearby-facilities-count" v-if="userLocation">
                <strong>Found {{ visibleFacilities.length }} health facilities within {{ searchRadius }}km</strong>
                <div class="facility-legend">
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #e74c3c;"></div> Hospitals
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #3498db;"></div> Clinics
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #2ecc71;"></div> Pharmacies
                    </div>
                </div>
            </div> -->
            
            <div class="map-hos-bar" v-if="selectedLocation">
                <div class="central-edit">
                    <div>
                        <h4>{{ selectedLocation.name || 'Selected Location' }}</h4>
                    </div>
                    <div>
                        <span v-if="selectedLocation.distance">{{ selectedLocation.distance }} Away</span>
                        <span v-if="selectedLocation.isOpen !== undefined" :class="selectedLocation.isOpen ? 'status-open' : 'status-closed'">
                            {{ selectedLocation.isOpen ? 'Open 24/7' : 'Closed' }}
                        </span>
                        <span v-if="selectedLocation.type">{{ selectedLocation.type }}</span>
                    </div>
                </div>
                <div>
                    <div class="action-buttons">
                        <button @click="showRoute" class="direction-btn">
                            <Icon icon="carbon:direction-straight" class="mr-2"/>
                            Get Direction
                        </button>
                        <button @click="shareLocation" class="share-btn">
                            <Icon icon="carbon:share" class="mr-2"/>
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Icon } from "@iconify/vue"
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L from 'leaflet'
import 'leaflet-routing-machine'

const map = ref(null)
const searchQuery = ref('')
const searchSuggestions = ref([])
const userLocation = ref(null)
const routingControl = ref(null)
const buildings = ref({})
const markers = ref({})
const selectedLocation = ref(null)
const clickMarker = ref(null)
const zoomHandler = ref(null)
const reverseGeocodeTimeout = ref(null)
const searchRadius = ref(5) // Default search radius in km
const facilityLayerGroup = ref(null)
const facilityFilters = ref({
    hospital: true,
    clinic: true,
    pharmacy: true
})

// Expanded health facilities data with more types and locations
const healthFacilities = [
    {
        id: 1,
        name: 'Central Hospital',
        coords: [51.505, -0.09],
        distance: null,
        isOpen: true,
        type: 'Hospital',
        building: [
            [51.5052, -0.0902],
            [51.5052, -0.0898],
            [51.5048, -0.0898],
            [51.5048, -0.0902]
        ]
    },
    {
        id: 2,
        name: 'City Clinic',
        coords: [51.51, -0.1],
        distance: null,
        isOpen: false,
        type: 'Clinic',
        building: [
            [51.5102, -0.1002],
            [51.5102, -0.0998],
            [51.5098, -0.0998],
            [51.5098, -0.1002]
        ]
    },
    {
        id: 3,
        name: 'Downtown Pharmacy',
        coords: [51.503, -0.095],
        distance: null,
        isOpen: true,
        type: 'Pharmacy',
        building: [
            [51.5032, -0.0952],
            [51.5032, -0.0948],
            [51.5028, -0.0948],
            [51.5028, -0.0952]
        ]
    },
    {
        id: 4,
        name: 'West End Hospital',
        coords: [51.515, -0.12],
        distance: null,
        isOpen: true,
        type: 'Hospital',
        building: [
            [51.5152, -0.1202],
            [51.5152, -0.1198],
            [51.5148, -0.1198],
            [51.5148, -0.1202]
        ]
    },
    {
        id: 5,
        name: 'Eastside Clinic',
        coords: [51.507, -0.08],
        distance: null,
        isOpen: true,
        type: 'Clinic',
        building: [
            [51.5072, -0.0802],
            [51.5072, -0.0798],
            [51.5068, -0.0798],
            [51.5068, -0.0802]
        ]
    },
    {
        id: 6,
        name: 'North London Pharmacy',
        coords: [51.525, -0.095],
        distance: null,
        isOpen: false,
        type: 'Pharmacy',
        building: [
            [51.5252, -0.0952],
            [51.5252, -0.0948],
            [51.5248, -0.0948],
            [51.5248, -0.0952]
        ]
    },
    {
        id: 7,
        name: 'South Bridge Clinic',
        coords: [51.495, -0.1],
        distance: null,
        isOpen: true,
        type: 'Clinic',
        building: [
            [51.4952, -0.1002],
            [51.4952, -0.0998],
            [51.4948, -0.0998],
            [51.4948, -0.1002]
        ]
    },
    {
        id: 8,
        name: 'Community Hospital',
        coords: [51.51, -0.07],
        distance: null,
        isOpen: true,
        type: 'Hospital',
        building: [
            [51.5102, -0.0702],
            [51.5102, -0.0698],
            [51.5098, -0.0698],
            [51.5098, -0.0702]
        ]
    },
    {
        id: 9,
        name: 'Medical Center Pharmacy',
        coords: [51.505, -0.105],
        distance: null,
        isOpen: true,
        type: 'Pharmacy',
        building: [
            [51.5052, -0.1052],
            [51.5052, -0.1048],
            [51.5048, -0.1048],
            [51.5048, -0.1052]
        ]
    },
    {
        id: 10,
        name: 'Riverside Medical Center',
        coords: [51.49, -0.085],
        distance: null,
        isOpen: true,
        type: 'Clinic',
        building: [
            [51.4902, -0.0852],
            [51.4902, -0.0848],
            [51.4898, -0.0848],
            [51.4898, -0.0852]
        ]
    }
]

// Computed property to filter facilities by distance and type
const visibleFacilities = computed(() => {
    if (!userLocation.value) return healthFacilities // Show all facilities if no user location
    
    return healthFacilities.filter(facility => {
        // Check if facility type is selected
        const typeFilter = (facility.type === 'Hospital' && facilityFilters.value.hospital) ||
                          (facility.type === 'Clinic' && facilityFilters.value.clinic) ||
                          (facility.type === 'Pharmacy' && facilityFilters.value.pharmacy)
        
        // Check if within radius
        const distance = parseFloat((facility.distance || '').replace('km', '') || 0)
        return typeFilter && distance <= searchRadius.value
    })
})

// Watch for changes in visible facilities and update map
watch(visibleFacilities, () => {
    updateFacilityMarkers()
}, { deep: true })

const buildingStyle = {
    color: '#3388ff',
    fillColor: '#3388ff',
    fillOpacity: 0.4,
    weight: 2
}

const selectedBuildingStyle = {
    color: '#ff4444',
    fillColor: '#ff4444',
    fillOpacity: 0.6,
    weight: 3
}

// Style variations for different facility types
const hospitalStyle = {
    color: '#e74c3c',
    fillColor: '#e74c3c',
    fillOpacity: 0.4,
    weight: 2
}

const clinicStyle = {
    color: '#3498db',
    fillColor: '#3498db',
    fillOpacity: 0.4,
    weight: 2
}

const pharmacyStyle = {
    color: '#2ecc71',
    fillColor: '#2ecc71',
    fillOpacity: 0.4,
    weight: 2
}

// Get style based on facility type
const getFacilityStyle = (facilityType) => {
    switch(facilityType) {
        case 'Hospital': return hospitalStyle
        case 'Clinic': return clinicStyle
        case 'Pharmacy': return pharmacyStyle
        default: return buildingStyle
    }
}

// Custom icons for different facility types
const createFacilityIcon = (facilityType) => {
    let iconColor, iconSymbol
    
    switch(facilityType) {
        case 'Hospital':
            iconColor = '#e74c3c'
            iconSymbol = 'H'
            break
        case 'Clinic':
            iconColor = '#3498db'
            iconSymbol = 'C'
            break
        case 'Pharmacy':
            iconColor = '#2ecc71'
            iconSymbol = 'P'
            break
        default:
            iconColor = '#3388ff'
            iconSymbol = '+'
    }
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div style="background-color:${iconColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;" class="marker-pin">
                ${iconSymbol}
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    })
}

const reverseGeocode = async (lat, lng) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const data = await response.json()
        return data.display_name || 'Selected Location'
    } catch (error) {
        console.error('Reverse geocoding error:', error)
        return 'Selected Location'
    }
}

const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng
    
    // Remove previous click marker and cleanup old zoom handler
    if (clickMarker.value) {
        map.value.removeLayer(clickMarker.value)
    }
    if (zoomHandler.value) {
        map.value.off('zoomend', zoomHandler.value)
    }
    
    // Clear any existing routing
    if (routingControl.value) {
        map.value.removeControl(routingControl.value)
    }
    
    // Get location name
    const locationName = await reverseGeocode(lat, lng)
    
    // Create new marker at clicked location
    clickMarker.value = L.marker([lat, lng], {
        zIndexOffset: 1000,
        draggable: false
    })
        .addTo(map.value)
        .bindPopup(locationName)
        .openPopup()
    
    // Store original coordinates
    const originalLatLng = [lat, lng]
    
    // Create an optimized zoom handler
    zoomHandler.value = () => {
        if (clickMarker.value) {
            clickMarker.value.setLatLng(originalLatLng)
        }
    }
    
    // Add zoom event listener with debounce
    map.value.on('zoomend', zoomHandler.value)
    
    // Update selected location
    selectedLocation.value = {
        name: locationName,
        coords: originalLatLng
    }
    
    // Calculate distance from user location if available
    if (userLocation.value) {
        selectedLocation.value.distance = 
            `${calculateDistance(userLocation.value, originalLatLng).toFixed(1)}km`
    }
}

const selectFacility = (facility) => {
    // Remove click marker if it exists
    if (clickMarker.value) {
        map.value.removeLayer(clickMarker.value)
    }
    
    // Clear any existing routing
    if (routingControl.value) {
        map.value.removeControl(routingControl.value)
    }
    
    // Reset all buildings to their type-specific style
    Object.keys(buildings.value).forEach(id => {
        const facility = healthFacilities.find(f => f.id === parseInt(id))
        buildings.value[id].setStyle(getFacilityStyle(facility.type))
    })
    
    // Set selected building to highlighted style
    buildings.value[facility.id].setStyle(selectedBuildingStyle)
    
    // Update selected location
    selectedLocation.value = facility
    
    // Pan map to selected building
    map.value.panTo(facility.coords)
}

let searchTimeout = null
const handleSearch = async () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    
    if (searchQuery.value.length < 3) {
        searchSuggestions.value = []
        return
    }

    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`
            )
            const data = await response.json()
            searchSuggestions.value = data.slice(0, 5)
        } catch (error) {
            console.error('Search error:', error)
            searchSuggestions.value = []
        }
    }, 300)
}

const selectSuggestion = async (suggestion) => {
    searchQuery.value = suggestion.display_name
    searchSuggestions.value = []
    
    const [lat, lon] = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)]
    
    // Remove previous click marker and cleanup old zoom handler
    if (clickMarker.value) {
        map.value.removeLayer(clickMarker.value)
    }
    if (zoomHandler.value) {
        map.value.off('zoomend', zoomHandler.value)
    }
    
    // Clear any existing routing
    if (routingControl.value) {
        map.value.removeControl(routingControl.value)
    }
    
    // Create marker
    clickMarker.value = L.marker([lat, lon], {
        zIndexOffset: 1000,
        draggable: false
    })
        .addTo(map.value)
        .bindPopup(suggestion.display_name)
        .openPopup()
    
    // Store original coordinates
    const originalLatLng = [lat, lon]
    
    // Create an optimized zoom handler
    zoomHandler.value = () => {
        if (clickMarker.value) {
            clickMarker.value.setLatLng(originalLatLng)
        }
    }
    
    // Add zoom event listener
    map.value.on('zoomend', zoomHandler.value)
    
    // Update selected location
    selectedLocation.value = {
        name: suggestion.display_name,
        coords: originalLatLng
    }
    
    // Calculate distance if user location is available
    if (userLocation.value) {
        selectedLocation.value.distance = 
            `${calculateDistance(userLocation.value, originalLatLng).toFixed(1)}km`
    }
    
    // Optimize map movement
    map.value.setView([lat, lon], 13, {
        animate: true,
        duration: 0.5  // Reduced animation duration
    })
    
    await updateNearbyFacilities()
}

const searchLocation = () => {
    if (searchSuggestions.value.length > 0) {
        selectSuggestion(searchSuggestions.value[0])
    }
}

const calculateDistance = (point1, point2) => {
    const R = 6371
    const lat1 = point1[0] * Math.PI / 180
    const lat2 = point2[0] * Math.PI / 180
    const lon1 = point1[1] * Math.PI / 180
    const lon2 = point2[1] * Math.PI / 180
    
    const dLat = lat2 - lat1
    const dLon = lon2 - lon1
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
}

// Update nearby facilities based on user location
const updateNearbyFacilities = async () => {
    const center = userLocation.value || (selectedLocation.value ? selectedLocation.value.coords : null)
    
    if (!center) return
    
    // Calculate distance for each facility from the center
    healthFacilities.forEach(facility => {
        const distance = calculateDistance(center, facility.coords)
        facility.distance = `${distance.toFixed(1)}km`
    })
    
    console.log(`Updated distances for ${healthFacilities.length} facilities from center: ${center}`)
    console.log(`Sample facility distances: ${healthFacilities[0].name}: ${healthFacilities[0].distance}`)
    
    // Ensure the radius is reasonable
    if (searchRadius.value <= 0) {
        searchRadius.value = 5 // Default radius
    }
    
    // Update markers based on filtered facilities
    updateFacilityMarkers()
}

// Update facility markers on the map based on filtered facilities
const updateFacilityMarkers = () => {
    // Clear existing facility buildings if facilityLayerGroup exists
    if (facilityLayerGroup.value) {
        map.value.removeLayer(facilityLayerGroup.value)
    }
    
    // Create a new layer group for facilities
    facilityLayerGroup.value = L.layerGroup().addTo(map.value)
    
    // Clear existing building references
    buildings.value = {}
    markers.value = {}
    
    console.log(`Updating markers for ${visibleFacilities.value.length} visible facilities`)
    
    // Add visible facilities to the map
    visibleFacilities.value.forEach(facility => {
        // Add building polygon with style based on facility type
        const style = getFacilityStyle(facility.type)
        const building = L.polygon(facility.building, style)
            .addTo(facilityLayerGroup.value)
            .bindTooltip(`${facility.name} (${facility.type}) - ${facility.distance}`, {
                permanent: false,
                direction: 'top'
            })
            .on('click', () => {
                selectFacility(facility)
            })
        
        buildings.value[facility.id] = building
        
        // Always add a marker for each facility to make them more visible
        const marker = L.marker(facility.coords, {
            icon: createFacilityIcon(facility.type),
            zIndexOffset: 1000
        })
            .addTo(facilityLayerGroup.value)
            .bindPopup(`
                <strong>${facility.name}</strong><br>
                Type: ${facility.type}<br>
                Distance: ${facility.distance}<br>
                Status: ${facility.isOpen ? 'Open' : 'Closed'}
            `)
        
        markers.value[facility.id] = marker
        
        // Open popup if this is the selected facility
        if (selectedLocation.value && selectedLocation.value.id === facility.id) {
            marker.openPopup()
        }
    })
}

const shareLocation = () => {
    if (!selectedLocation.value) return
    
    const locationString = `${selectedLocation.value.name} at ${selectedLocation.value.coords[0]},${selectedLocation.value.coords[1]}`
    
    if (navigator.share) {
        navigator.share({
            title: 'Shared Health Facility',
            text: `Check out this health facility: ${locationString}`,
            url: window.location.href
        }).catch(err => {
            console.error('Share failed:', err)
            // Fallback - copy to clipboard
            copyToClipboard(locationString)
        })
    } else {
        // Fallback - copy to clipboard
        copyToClipboard(locationString)
    }
}

const copyToClipboard = (text) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
        document.execCommand('copy')
        alert('Location copied to clipboard!')
    } catch (err) {
        console.error('Failed to copy:', err)
    }
    
    document.body.removeChild(textArea)
}

const showRoute = () => {
    if (!userLocation.value) {
        alert('Please allow location access to show directions')
        return
    }

    if (!selectedLocation.value) {
        alert('Please select a destination')
        return
    }

    if (routingControl.value) {
        map.value.removeControl(routingControl.value)
    }

    routingControl.value = L.Routing.control({
        waypoints: [
            L.latLng(userLocation.value[0], userLocation.value[1]),
            L.latLng(selectedLocation.value.coords[0], selectedLocation.value.coords[1])
        ],
        routeWhileDragging: true,
        lineOptions: {
            styles: [{ color: '#6FA1EC', weight: 4 }]
        },
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true
    }).addTo(map.value)
}

// Update initMap function to include performance optimizations
const initMap = () => {
    map.value = L.map('map', {
        // Add these options for better performance
        preferCanvas: true,  // Use Canvas instead of SVG for better performance
        wheelDebounceTime: 150,  // Debounce wheel events
        zoomSnap: 0.5,  // Smooth zoom
        zoomDelta: 0.5,
        fadeAnimation: false,  // Disable unnecessary animations
    }).setView([51.505, -0.09], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 4,
        tileSize: 256,
        keepBuffer: 2  // Reduce tile buffer for better performance
    }).addTo(map.value)

    // Create a layer group for facilities
    facilityLayerGroup.value = L.layerGroup().addTo(map.value)

    map.value.on('click', handleMapClick)
    
    // Add CSS for custom marker
    const style = document.createElement('style')
    style.innerHTML = `
        .marker-pin {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -15px 0 0 -15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            text-align: center;
            line-height: 30px;
            font-size: 16px;
        }
    `
    document.head.appendChild(style)
}

const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            userLocation.value = [latitude, longitude]
            map.value.setView([latitude, longitude], 13)
            
            // Add user location marker with zIndexOffset
            L.marker([latitude, longitude], {
                zIndexOffset: 1000
            })
                .addTo(map.value)
                .bindPopup('You are here')
                .openPopup()
                
            // Update facilities based on user location
            updateNearbyFacilities()
        }, () => {
            // Fallback if geolocation permission denied
            console.log("Geolocation permission denied, using default location")
            const defaultLocation = [51.505, -0.09] // London as default
            userLocation.value = defaultLocation
            map.value.setView(defaultLocation, 13)
            
            // Add default location marker
            L.marker(defaultLocation, {
                zIndexOffset: 1000
            })
                .addTo(map.value)
                .bindPopup('Default location')
                .openPopup()
                
            // Update facilities based on default location
            updateNearbyFacilities()
        })
    } else {
        // Fallback for browsers without geolocation support
        const defaultLocation = [51.505, -0.09] // London as default
        userLocation.value = defaultLocation
        
        // Update facilities based on default location
        updateNearbyFacilities()
    }
}

onMounted(() => {
    initMap()
    // Set a short timeout to ensure the map is fully initialized before getting location
    setTimeout(() => {
        getUserLocation()
    }, 500)
    
    // Set all facility types to visible by default
    facilityFilters.value = {
        hospital: true,
        clinic: true,
        pharmacy: true
    }
})
</script>

<style scoped>
.health-map {
    width: 100%;
    height: 95vh;
    background-color: var(--main-bg);
    color: var(--text-primary);
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
    display: flex;
    flex-direction: column;
}

.health-map-container {
    background-color: var(--secondary-bg);
    width: 99%;
    height: 95%;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Added consistent gap between elements */
}

.map-search-bar {
    width: 100%;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem;
    background-color: var(--main-bg);
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.map-search-bar input {
    width: 100%;
    height: 100%;
    font-size: 15px;
    border: none;
    background-color: transparent;
    border-radius: 0.5rem;
    padding-left: 0.5rem;
    color: var(--text-primary);
    transition: all 0.2s ease;
}

.map-search-bar input:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.02);
}

.search-suggestions {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10000000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    max-height: 0;
    overflow: hidden;
}

.search-suggestions:not(:empty) {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    max-height: 300px;
    overflow-y: auto;
}

.suggestion-item {
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
}

.filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.5rem;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.radius-control {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.radius-control input[type="range"] {
    width: 100%;
    cursor: pointer;
}

.facility-types {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-label input {
    cursor: pointer;
}

.map-view-bar {
    width: 100%;
    flex-grow: 1;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

#map {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
}

.nearby-facilities-count {
    padding: 0.5rem;
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-secondary);
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    margin: 0.5rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.facility-legend {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.map-hos-bar {
    width: 100%;
    min-height: 4rem;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.map-hos-bar button {
    background-color: var(--accent-color);
    height: 3rem;
    margin-right: 1rem;
    border-radius: 0.5rem;
    color: white;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    min-width: 5.5rem;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
    padding: 0 1.5rem;
}

.map-hos-bar button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.map-hos-bar button:active {
    transform: translateY(0);
}

.central-edit {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.central-edit span {
    color: var(--text-secondary);
    margin-right: 0.75rem;
    font-size: 0.9rem;
}

.status-open {
    color: #2ecc71 !important;
    font-weight: 500;
}

.status-closed {
    color: #e74c3c !important;
    font-weight: 500;
}

.input-content {
    width: 100%;
    position: relative;
}

/* Custom scrollbar for suggestions */
.search-suggestions::-webkit-scrollbar {
    width: 6px;
}

.search-suggestions::-webkit-scrollbar-track {
    background: transparent;
}

.search-suggestions::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

@media screen and (max-width: 768px) {
    .health-map-container {
        height: auto;
        min-height: 50vh;
    }
    
    .map-view-bar {
        height: 50vh;
    }
    
    .map-hos-bar {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .filter-controls {
        flex-direction: column;
    }
    
    .central-edit {
        width: 100%;
        align-items: center;
    }
    
    .map-hos-bar button {
        width: 100%;
        max-width: 300px;
    }

    .search-suggestions {
        max-height: 40vh;
    }
}
</style>