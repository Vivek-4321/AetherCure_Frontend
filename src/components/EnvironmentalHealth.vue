<template>
  <div class="Env-main-container">
    <h2 class="Env-header">Environmental Health</h2>
    <!-- Debug Info Panel (Only visible when there's an error) -->

    <div v-if="locationError" class="error-message">
      <p>{{ locationError }}</p>
      <button @click="requestLocation" class="retry-button">
        Retry Getting Location
      </button>
    </div>

    <div v-else class="Env-container">
      <div class="env-first-bar">
        <div class="first-bar-box1">
          <div class="first-bar-icon-content-align">
            <div class="first-bar-icon-text">
              <Icon
                icon="hugeicons:fast-wind"
                :style="{ fontSize: '40px', color: 'blue' }"
              />
              <div :class="['status-tag', airQualityTagColor]">
                <h5>{{ airQualityStatus }}</h5>
              </div>
            </div>
            <div class="air-quality-index-43">
              <h5>Air Quality Index</h5>
              <h1>{{ airQualityIndexDisplay }}</h1>
            </div>
          </div>
        </div>
        <div class="first-bar-box2">
          <div class="first-bar-icon-content-align">
            <div class="first-bar-icon-text">
              <Icon
                icon="hugeicons:temperature"
                :style="{ fontSize: '40px', color: 'red' }"
              />
              <div :class="['status-tag', temperatureTagColor]">
                <h5>{{ temperatureStatus }}</h5>
              </div>
            </div>
            <div class="air-quality-index-43">
              <h5>Temperature</h5>
              <h1>{{ temperature }}</h1>
            </div>
          </div>
        </div>
        <div class="first-bar-box3">
          <div class="first-bar-icon-content-align">
            <div class="first-bar-icon-text">
              <Icon
                icon="hugeicons:rain-double-drop"
                :style="{ fontSize: '40px', color: 'skyblue' }"
              />
              <div :class="['status-tag', humidityTagColor]">
                <h5>{{ humidityStatus }}</h5>
              </div>
            </div>
            <div class="air-quality-index-43">
              <h5>Humidity</h5>
              <h1>{{ humidity }}%</h1>
            </div>
          </div>
        </div>
        <div class="first-bar-box4">
          <div class="first-bar-icon-content-align">
            <div class="first-bar-icon-text">
              <Icon
                icon="hugeicons:sun-03"
                :style="{ fontSize: '40px', color: 'yellow' }"
              />
              <div :class="['status-tag', uvTagColor]">
                <h5>{{ uvStatus }}</h5>
              </div>
            </div>
            <div class="air-quality-index-43">
              <h5>UV Index</h5>
              <h1>{{ uvIndex }}</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="env-second-bar">
        <h3>Health Recommendation</h3>
        <div class="second-bar-align">
          <div class="second-bar-Air">
            <a>Air Quality: {{ airQualityRecommendation }}</a>
          </div>
          <div class="second-bar-Temperature">
            <a>Temperature: {{ temperatureRecommendation }}</a>
          </div>
          <div class="second-bar-Activity">
            <a>Activity Suggestion: {{ activitySuggestion }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Icon } from "@iconify/vue";

const apiKey = "f3ca6189124541a798a51926242512";
const latitude = ref(null);
const longitude = ref(null);
const locationError = ref(null);
const debugInfo = ref(null);

const temperature = ref(null);
  const humidity = ref(null);
  const uvIndex = ref(null);
  const airQualityData = ref(null);
  
  // Air Quality computations
  const airQualityIndexDisplay = computed(() => {
    if (airQualityData.value?.current?.air_quality['us-epa-index']) {
      return airQualityData.value.current.air_quality['us-epa-index'];
    }
    return 'Loading...';
  });
  
  const airQualityStatus = computed(() => {
    const aqi = airQualityData.value?.current?.air_quality['us-epa-index'];
    if (aqi) {
      switch (aqi) {
        case 1: return 'Good';
        case 2: return 'Moderate';
        case 3: return 'Sensitive';
        case 4: return 'Unhealthy';
        case 5: return 'Very Unhealthy';
        case 6: return 'Hazardous';
        default: return 'Unknown';
      }
    }
    return 'Loading...';
  });
  
  const airQualityTagColor = computed(() => {
    const status = airQualityStatus.value;
    switch (status) {
      case 'Good': return 'status-green';
      case 'Moderate': return 'status-yellow';
      case 'Sensitive': return 'status-orange';
      case 'Unhealthy': return 'status-red';
      case 'Very Unhealthy': return 'status-purple';
      case 'Hazardous': return 'status-maroon';
      default: return 'status-gray';
    }
  });
  
  // Temperature computations
  const temperatureStatus = computed(() => {
    const temp = parseFloat(temperature.value?.replace('F', ''));
    if (temp < 32) return 'Very Cold';
    if (temp < 50) return 'Cold';
    if (temp < 70) return 'Cool';
    if (temp < 80) return 'Moderate';
    if (temp < 90) return 'Warm';
    if (temp >= 90) return 'Hot';
    return 'Unknown';
  });
  
  const temperatureTagColor = computed(() => {
    const status = temperatureStatus.value;
    switch (status) {
      case 'Very Cold': return 'status-blue';
      case 'Cold': return 'status-lightblue';
      case 'Cool': return 'status-green';
      case 'Moderate': return 'status-yellow';
      case 'Warm': return 'status-orange';
      case 'Hot': return 'status-red';
      default: return 'status-gray';
    }
  });
  
  // Humidity computations
  const humidityStatus = computed(() => {
    const humid = humidity.value;
    if (humid < 30) return 'Low';
    if (humid < 60) return 'Optimal';
    if (humid < 80) return 'High';
    if (humid >= 80) return 'Very High';
    return 'Unknown';
  });
  
  const humidityTagColor = computed(() => {
    const status = humidityStatus.value;
    switch (status) {
      case 'Low': return 'status-yellow';
      case 'Optimal': return 'status-green';
      case 'High': return 'status-orange';
      case 'Very High': return 'status-red';
      default: return 'status-gray';
    }
  });
  
  // UV Index computations
  const uvStatus = computed(() => {
    const uv = uvIndex.value;
    if (uv < 3) return 'Low';
    if (uv < 6) return 'Moderate';
    if (uv < 8) return 'High';
    if (uv < 11) return 'Very High';
    if (uv >= 11) return 'Extreme';
    return 'Unknown';
  });
  
  const uvTagColor = computed(() => {
    const status = uvStatus.value;
    switch (status) {
      case 'Low': return 'status-green';
      case 'Moderate': return 'status-yellow';
      case 'High': return 'status-orange';
      case 'Very High': return 'status-red';
      case 'Extreme': return 'status-purple';
      default: return 'status-gray';
    }
  });
  
  // Recommendations
  const airQualityRecommendation = computed(() => {
    const status = airQualityStatus.value;
    switch (status) {
      case 'Good':
        return "Air quality is ideal for outdoor activities.";
      case 'Moderate':
        return "Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exposure.";
      case 'Sensitive':
        return "People with respiratory issues should reduce outdoor activities.";
      case 'Unhealthy':
        return "Everyone should reduce prolonged outdoor activities.";
      case 'Very Unhealthy':
        return "Avoid outdoor activities. Stay indoors if possible.";
      case 'Hazardous':
        return "EMERGENCY CONDITIONS: Everyone should avoid all outdoor activities.";
      default:
        return 'Air quality information unavailable.';
    }
  });
  
  const temperatureRecommendation = computed(() => {
    const status = temperatureStatus.value;
    switch (status) {
      case 'Very Cold':
        return 'Wear multiple layers and limit outdoor exposure.';
      case 'Cold':
        return 'Wear warm clothing and protect extremities.';
      case 'Cool':
        return 'Light jacket or sweater recommended.';
      case 'Moderate':
        return 'Comfortable conditions for most activities.';
      case 'Warm':
        return 'Stay hydrated and avoid prolonged sun exposure.';
      case 'Hot':
        return 'Limit outdoor activities, stay hydrated, and seek shade.';
      default:
        return 'Temperature information unavailable.';
    }
  });
  
  const activitySuggestion = computed(() => {
    const airStatus = airQualityStatus.value;
    const tempStatus = temperatureStatus.value;
    
    if (airStatus === 'Good' && ['Cool', 'Moderate'].includes(tempStatus)) {
      return 'Perfect conditions for outdoor activities.';
    } else if (airStatus === 'Moderate' && !['Very Cold', 'Hot'].includes(tempStatus)) {
      return 'Light to moderate outdoor activities recommended.';
    } else if (['Sensitive', 'Unhealthy'].includes(airStatus) || ['Very Cold', 'Hot'].includes(tempStatus)) {
      return 'Indoor activities recommended.';
    } else {
      return 'Stay indoors and avoid outdoor activities.';
    }
  });
  
  const clearErrors = () => {
  locationError.value = null;
  debugInfo.value = null;
};

const requestLocation = () => {
  clearErrors();
  
  // First check if geolocation is supported
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation is not supported by your browser.';
    return;
  }

  // Check if we're on a secure context (HTTPS or localhost)
  if (!window.isSecureContext) {
    locationError.value = 'Location services require a secure (HTTPS) connection.';
    return;
  }

  // Options for geolocation request
  const options = {
    enableHighAccuracy: true,    // Use GPS on mobile if available
    timeout: 15000,              // Increased timeout for slower mobile connections
    maximumAge: 0                // Don't use cached position
  };

  // Show loading state
  locationError.value = 'Requesting location access...';

  navigator.geolocation.getCurrentPosition(
    // Success callback
    (position) => {
      latitude.value = position.coords.latitude;
      longitude.value = position.coords.longitude;
      debugInfo.value = {
        type: 'Location Success',
        latitude: latitude.value,
        longitude: longitude.value,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      };
      locationError.value = null;
      fetchWeatherData();
    },
    // Error callback
    (error) => {
      const errorMessages = {
        1: 'Location access was denied. Please enable location services in your device settings and refresh the page.',
        2: 'Location unavailable. Please check if your device\'s GPS is enabled and try again.',
        3: 'Location request timed out. Please check your internet connection and try again.'
      };
      
      let errorMessage = errorMessages[error.code] || 'An unknown error occurred while requesting location.';
      
      // Add specific mobile instructions
      if (error.code === 1) {
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          errorMessage += '\n\nOn iOS: Settings > Privacy > Location Services > Safari > Allow';
        } else if (/Android/.test(navigator.userAgent)) {
          errorMessage += '\n\nOn Android: Settings > Location > Turn on & allow browser access';
        }
      }
      
      locationError.value = errorMessage;
      debugInfo.value = {
        type: 'Location Error',
        code: error.code,
        message: error.message,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };
      console.error('Geolocation error:', error);
    },
    options
  );
};

// Add a function to check location permissions
const checkLocationPermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    if (result.state === 'denied') {
      locationError.value = 'Location access is blocked. Please enable location services and refresh the page.';
      return false;
    }
    return true;
  } catch (error) {
    console.error('Permission check failed:', error);
    return true; // Proceed anyway if permission check fails
  }
};

const fetchWeatherData = async () => {
  if (latitude.value !== null && longitude.value !== null) {
    try {
      // Log the URL being fetched (without API key)
      const apiUrl = `http://api.weatherapi.com/v1/current.json?key=XXXXX&q=${latitude.value},${longitude.value}&aqi=yes`;
      debugInfo.value = {
        ...debugInfo.value,
        requestUrl: apiUrl.replace(apiKey, 'XXXXX'),
        requestTime: new Date().toISOString()
      };

      // Make sure we're using HTTPS for the API request
      const secureUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude.value},${longitude.value}&aqi=yes`;
      
      const response = await fetch(secureUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data && data.current) {
        temperature.value = `${data.current.temp_f}F`;
        humidity.value = data.current.humidity;
        uvIndex.value = data.current.uv;
        airQualityData.value = data;
        
        // Clear any previous errors
        clearErrors();
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      debugInfo.value = {
        ...debugInfo.value,
        type: 'API Error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      locationError.value = `Error fetching weather data: ${error.message}`;
    }
  }
};

const retryFetch = () => {
  clearErrors();
  fetchWeatherData();
};
  
onMounted(async () => {
  // First check if we have permission
  const hasPermission = await checkLocationPermission();
  if (hasPermission) {
    requestLocation();
  }
});
</script>

<style>
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Add animations to elements */
.Env-main-container {
  width: 100%;
  height: 100%;
  background-color: var(--main-bg);
  color: var(--text-primary);
  padding: 1rem;
  animation: fadeIn 0.6s ease-out;
}

.Env-header {
  font-size: 24px;
  animation: slideInFromTop 0.8s ease-out;
}

.error-message {
  animation: slideInFromTop 0.6s ease-out;
}

/* First bar animations */
.env-first-bar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2rem;
  gap: 1rem;
  animation: slideInFromBottom 0.8s ease-out;
}

.first-bar-box1 {
  animation: slideInFromBottom 0.6s ease-out 0.2s both;
}

.first-bar-box2 {
  animation: slideInFromBottom 0.6s ease-out 0.4s both;
}

.first-bar-box3 {
  animation: slideInFromBottom 0.6s ease-out 0.6s both;
}

.first-bar-box4 {
  animation: slideInFromBottom 0.6s ease-out 0.8s both;
}

/* Second bar animations */
.env-second-bar {
  animation: slideInFromBottom 0.8s ease-out 1s both;
}

.second-bar-Air {
  animation: slideInFromBottom 0.6s ease-out 1.2s both;
}

.second-bar-Temperature {
  animation: slideInFromBottom 0.6s ease-out 1.4s both;
}

.second-bar-Activity {
  animation: slideInFromBottom 0.6s ease-out 1.6s both;
}

/* Status tag animation */
.status-tag {
  animation: fadeIn 0.4s ease-out;
}

/* Rest of your existing styles... */
.first-bar-box1,
.first-bar-box2,
.first-bar-box3,
.first-bar-box4 {
  width: 23%;
  min-width: 12rem;
  height: 10rem;
  display: flex;
  border-radius: 0.5rem;
  background-color: var(--secondary-bg);
  box-sizing: border-box;
  flex-direction: column;
  padding: 0 0.5rem;
} 

.Env-main-container {
  width: 100%;
  height: 100%;
  background-color: var(--main-bg);
  color: var(--text-primary);
  padding: 1rem;
  
  h2 {
    font-size: 24px;
  }
}

.debug-panel {
  background-color: var(--secondary-bg);
  border: 2px solid var(--border-color);
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  font-family: monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-all;
}

.retry-button {
  background-color: var(--accent-color);
  color: var(--text-primary);
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.retry-button:hover {
  background-color: var(--accent-color);
  margin-top: 1rem;
}

.error-message {
  color: #e3626f;
  background-color: var(--secondary-bg);
  border: 3px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
}

.Env-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.env-first-bar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2rem;
  gap: 1rem;
}

.first-bar-box1,
.first-bar-box2,
.first-bar-box3,
.first-bar-box4 {
  width: 23%;
  min-width: 12rem;
  height: 10rem;
  display: flex;
  border-radius: 0.5rem;
  background-color: var(--secondary-bg);
  box-sizing: border-box;
  flex-direction: column;
  padding: 0 0.5rem;
}

/* Status tag styles */
.status-tag {
  width: fit-content;
  border-radius: 1.5rem;
  font-size: 0.9rem;
  padding: 0.2rem 1rem;
  margin-top: 0.5rem;
}

.status-tag h5 {
  margin: 0;
  color: white;
}

.status-green {
  background-color: #28a745;
}

.status-yellow {
  background-color: #ffc107;
  color: #000;
}

.status-orange {
  background-color: #fd7e14;
}

.status-red {
  background-color: #dc3545;
}

.status-purple {
  background-color: #6f42c1;
}

.status-maroon {
  background-color: #800000;
}

.status-blue {
  background-color: #007bff;
}

.status-lightblue {
  background-color: #17a2b8;
}

.status-gray {
  background-color: #6c757d;
}

/* Rest of the styles remain the same */
.env-second-bar {
  width: 100%;
  background-color: var(--secondary-bg);
  margin-top: 3rem;
  border-radius: 0.5rem;
  padding: 2rem;
  box-sizing: border-box;
}

.first-bar-icon-content-align {
  display: flex;
  flex-direction: column;
  line-height: 2.5rem;
  padding: 1rem;
}

.first-bar-icon-text {
  display: flex;
  justify-content: space-between;
}

.air-quality-index-43 h5 {
  color: rgb(153, 153, 153);
  margin: 0;
}

.air-quality-index-43 h1 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
}

.second-bar-align {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  font-family: "Poppins", sans-serif;
}

.second-bar-Air,
.second-bar-Temperature,
.second-bar-Activity {
  width: 100%;
  padding: 1.2rem;
  border-radius: 0.8rem;
  font-family: "Poppins", sans-serif;
  line-height: 1.6;
  box-sizing: border-box;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.second-bar-Air {
  background-color: var(--air-quality-bg);
  color: var(--air-quality-text);
  border-color: var(--air-quality-border);
  box-shadow: 0 2px 4px rgba(21, 101, 192, 0.1);
}

.second-bar-Temperature {
  background-color: var(--temperature-bg);
  color: var(--temperature-text);
  border-color: var(--temperature-border);
  box-shadow: 0 2px 4px rgba(230, 81, 0, 0.1);
}

.second-bar-Activity {
  background-color: var(--activity-bg);
  color: var(--activity-text);
  border-color: var(--activity-border);
  box-shadow: 0 2px 4px rgba(46, 125, 50, 0.1);
}

/* Responsive Design */
@media screen and (max-width: 1024px) {
  .env-first-bar {
    gap: 1rem;
  }

  .first-bar-box1,
  .first-bar-box2,
  .first-bar-box3,
  .first-bar-box4 {
    width: 48%;
  }

  .env-second-bar {
    margin-top: 2rem;
    padding: 1.5rem;
  }
}

@media screen and (max-width: 768px) {
  .Env-main-container{
    h2 {
      font-size: 17px;
    }
  }
  
  .Env-container {
    margin-top: -1rem;
    
  }

  .first-bar-box1,
  .first-bar-box2,
  .first-bar-box3,
  .first-bar-box4 {
    width: 100%;
    height: auto;
    min-height: 8rem;
  }

  .env-second-bar {
    padding: 1rem;
  }

  .air-quality-index-43 h1 {
    font-size: 1.25rem;
  }

  .status-tag {
    font-size: 0.8rem;
    padding: 0.15rem 0.8rem;
  }

  .first-bar-box1,
  .first-bar-box2,
  .first-bar-box3,
  .first-bar-box4 {
    animation-delay: 0.2s; /* Reduce animation delay on mobile */
  }
  
  .env-second-bar,
  .second-bar-Air,
  .second-bar-Temperature,
  .second-bar-Activity {
    animation-delay: 0.4s; /* Reduce animation delay on mobile */
  }
}

@media screen and (max-width: 480px) {
  .Env-main-container {
    padding: 0.5rem;
  }

  .Env-header {
    margin-left: 0.5rem;
    font-size: 23px;
  }

  .env-first-bar {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }

  .second-bar-Air,
  .second-bar-Temperature,
  .second-bar-Activity {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .first-bar-icon-content-align {
    padding: 0.8rem;
    line-height: 2rem;
  }

  .status-tag {
    font-size: 0.75rem;
    padding: 0.1rem 0.6rem;
  }
}
</style>
