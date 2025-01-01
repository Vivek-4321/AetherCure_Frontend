<template>
    <div class="diseases-header">
        <h1>Diseases Outbreak Alert</h1>
        <div class="diseases-type">     
            <div class="diseases-header-1" v-for="disease in diseases" :key="disease.country">
                <div class="first-bar">
                    <div class="first-bar-first-line">
                        <div class="icon-flex-warning">
                            <Icon icon="hugeicons:alert-02" :style="{ fontSize: '50px', paddingLeft: '2px', paddingTop: '12px'}" />
                            <div>
                                <div class="asd">
                                    <h2>COVID-19</h2>
                                    <div class="map-icon">
                                        <Icon icon="mynaui:location"/>
                                        <a>{{ disease.country }} ({{ disease.continent }})</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- <div>
                            <div :class="getSeverityClass(disease.activeCases)">
                                <h2>{{ getSeverityText(disease.activeCases) }}</h2>
                            </div>
                        </div> -->
                    </div>

                    <div class="first-bar-second-line">
                        <div class="first-bar-second-left">
                            <div>
                                <Icon icon="icon-park-outline:peoples" />
                            </div>
                            <div>
                                <span>Active Cases: {{ formatNumber(disease.activeCases) }}</span>
                            </div>
                        </div>
                        <div class="first-bar-second-right">
                            <div>
                                <Icon icon="fluent-emoji-high-contrast:chart-increasing" />
                            </div>
                            <div>
                                <span>Cases per Million: {{ formatNumber(disease.casesPerMillion) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="first-bar-third-line">
                        <div class="recommendation"> 
                            <h5>Statistics:</h5>
                            <ul>
                                <li>Total Cases: {{ formatNumber(disease.totalCases) }}</li>
                                <li>Recovered: {{ formatNumber(disease.recovered) }}</li>
                                <li>Critical Cases: {{ formatNumber(disease.critical) }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
            <p>Loading disease data...</p>
        </div>
        
        <!-- Error State -->
        <div v-if="error" class="error-state">
            <p>{{ error }}</p>
            <button @click="fetchDiseases" class="retry-button">Retry</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from "@iconify/vue"

const diseases = ref([])
const loading = ref(true)
const error = ref(null)

// Format large numbers
const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
}

// Determine severity based on active cases
const getSeverityText = (activeCases) => {
    if (activeCases > 100000) return 'Severe'
    if (activeCases > 10000) return 'Moderate'
    return 'Mild'
}

const getSeverityClass = (activeCases) => {
    if (activeCases > 100000) return 'severe'
    if (activeCases > 10000) return 'moderate'
    return 'moderate1'
}

const fetchDiseases = async () => {
    loading.value = true
    error.value = null
    
    try {
        const response = await fetch('https://disease.sh/v3/covid-19/countries')
        const data = await response.json()
        
        // Transform and sort by active cases
        diseases.value = data
            .filter(country => country.active > 0) // Only countries with active cases
            .sort((a, b) => b.active - a.active) // Sort by active cases
            .slice(0, 3) // Take top 3 countries
            .map(country => ({
                country: country.country,
                continent: country.continent,
                activeCases: country.active,
                casesPerMillion: country.casesPerOneMillion,
                totalCases: country.cases,
                recovered: country.recovered,
                critical: country.critical,
                deaths: country.deaths,
                tests: country.tests
            }))
    } catch (err) {
        error.value = 'Failed to fetch disease data. Please try again.'
        console.error('Error fetching disease data:', err)
    } finally {
        loading.value = false
    }
}

// Lifecycle hooks
onMounted(() => {
    fetchDiseases()
})
</script>

<style scoped>
.diseases-header{
    width: 100%;
    height: 100%;
    background-color: var(--main-bg);
    color: var(--text-primary);
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
}

.diseases-header-1{
    background-color: var(--secondary-bg);
    width: 100%;
    height: 19rem;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
    border-radius: 1rem;
    display: flex;
    margin-top: 1.5rem;
}

.first-bar{
    padding-top: 1.5rem;
    width: 100%;
    height: 3rem;
    line-height: 1.9rem;
}

.first-bar-first-line{
    display: flex;
    justify-content: space-between;
}

.moderate{
    width: 5rem;
    height: 2rem;
    border-radius: 1rem;
    background-color: rgb(255, 244, 150);
    font-size: 7px;
    color: rgb(243, 180, 7);
    padding-bottom: 15px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    margin-right: 20px;
}

.moderate1{
    width: 5rem;
    height: 2rem;
    border-radius: 1rem;
    background-color: rgb(92, 134, 73);
    font-size: 7px;
    color: rgb(20, 53, 10);
    padding-bottom: 15px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    margin-right: 20px;
}

.first-bar-second-line{
    display: flex;
    justify-content: space-between;
    padding-left: 5px;
    border-radius: 0.5rem;
    font-family: 'Poppins', sans-serif;
    margin-top: 1rem;
    width: 100%;
}

.first-bar-second-left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: var(--main-bg);
    width: 49%;
    border-radius: 0.5rem;
    padding-left: 12px;
    color: var(--text-secondary);
    font-size: 15px;
}

.first-bar-second-left span{
    padding-top: 6px;
    margin-left: 5px;
}

.first-bar-second-right{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: var(--main-bg);
    width: 49%;
    padding-left: 12px;
    margin-right: 10px;
    border-radius: 0.5rem;
    color: var(--text-secondary);
    font-size: 15px;
    height: 3rem;
}

.first-bar-second-right span{
    margin-left: 8px;
    padding-top: 6px;
}

.first-bar-third-line{
    margin-top: 0.5rem;
}

.recommendation h5{
    color: var(--text-primary);
    font-size: 17px;
    padding-left: 10px;
}

.recommendation ul{
    padding-left: 3rem;
}

.recommendation li{
    color: var(--text-secondary);
    font-size: 16px;
}

.icon-flex-warning{
    display: flex;
    flex-direction: row;
    padding-left: 2px;
}

.map-icon{
    font-size: 14px;
}

.map-icon a{
    color: var(--text-secondary);
}

.severe {
    width: 5rem;
    height: 2rem;
    border-radius: 1rem;
    background-color: rgb(255, 200, 200);
    font-size: 7px;
    color: rgb(180, 0, 0);
    padding-bottom: 15px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    margin-right: 20px;
}

/* Loading state styles */
.loading-state {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

/* Error state styles */
.error-state {
    text-align: center;
    padding: 2rem;
    color: rgb(220, 53, 69);
}

.retry-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--secondary-bg);
    border: none;
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
}

.retry-button:hover {
    opacity: 0.9;
}

.severe {
    width: 5rem;
    height: 2rem;
    border-radius: 1rem;
    background-color: rgb(255, 200, 200);
    font-size: 7px;
    color: rgb(180, 0, 0);
    padding-bottom: 15px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    margin-right: 20px;
}

@media screen and (max-width: 768px){
    .diseases-type{
        flex-direction: column;
    }
}
</style>