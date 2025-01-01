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
</style>