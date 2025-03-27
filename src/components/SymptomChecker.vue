<template>
  <div class="first-div slide-in-from-top">
    <div class="tool-container">
      <div class="first-inner-first slide-in-from-left">
        <h1>Disease Prediction Tool</h1>
        <div class="first-inner-upper">
          <p>Select your symptoms</p>
          <div class="first-inner-input">
            <!-- Symptom input with dropdown and chips -->
            <div class="input-dropdown-container">
              <div class="input-chips-wrapper">
                <!-- Chips inside input area -->
              <div class="chips-container" v-if="selectedSymptoms.length > 0">
                <div 
                  v-for="(symptom, index) in selectedSymptoms" 
                  :key="index" 
                  class="symptom-chip"
                >
                  <span class="chip-text">{{ symptom.name }}</span>
                  <span class="chip-delete" @click="removeSymptom(index)">×</span>
                </div>
              </div>
              
              <input
                v-model="symptomInput"
                type="text"
                class="input-bar"
                placeholder="Type or select symptoms"
                @focus="showDropdown = true"
                @blur="handleBlur"
                @input="filterSymptoms"
                :disabled="loading || loadingSymptoms"
              />
            </div>
            
            <div v-if="showDropdown" class="dropdown-menu">
              <div v-if="loadingSymptoms" class="dropdown-item disabled">
                <span class="loader-small"></span> Loading symptoms...
              </div>
              <template v-else>
                <div 
                  v-for="symptom in filteredSymptoms" 
                  :key="symptom.id" 
                  class="dropdown-item"
                  @mousedown="addSymptomFromDropdown(symptom)"
                >
                  {{ symptom.name }}
                </div>
                <div v-if="filteredSymptoms.length === 0" class="dropdown-item disabled">
                  No symptoms found
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <!-- Empty state message -->
        <p v-if="selectedSymptoms.length === 0" class="no-symptoms">No symptoms selected yet</p>
      </div>
      <div class="first-inner-btn">
        <button
          @click="checkSymptoms"
          :disabled="loading || loadingSymptoms || selectedSymptoms.length === 0"
          :class="{ loading: loading }"
        >
          <span v-if="!loading">Predict Disease</span>
          <span v-else class="loader"></span>
        </button>
      </div>
    </div>

    <div class="results-area">
      <!-- Initial state with fade in -->
      <div v-if="!showResults" class="initial-state slide-in-from-right">
        <div class="initial-content fade-in">
          <Icon 
            icon="hugeicons:align-box-bottom-left" 
            class="health-icon"
            :style="{ fontSize: '4rem', color: 'var(--text-secondary)' }"
          />
          <p v-if="loadingSymptoms">
            <span class="loader-small"></span> Loading symptoms...
          </p>
          <p v-else-if="loading">
            <span class="loader-small"></span> Analyzing your symptoms...
          </p>
          <p v-else>Type or select symptoms to get an AI-powered health assessment</p>
        </div>
      </div>

      <!-- Enhanced Results section with staggered animations -->
      <transition name="fade-slide" @enter="startProgress">
        <div v-if="showResults" class="first-inner-second">
          <div class="results-scroll-container">
            <h3 class="slide-in-element">Predicted Disease</h3>
          <h2 class="slide-in-element">{{ prediction.predicted_disease }}</h2>
          <p class="slide-in-element">Confidence level</p>
          <div class="percent-first slide-in-element">
            <div
              ref="progressBar"
              class="percent-sec"
              :style="{ width: progressWidth + '%' }"
            ></div>
          </div>
          <p class="slide-in-element">{{ Math.round(prediction.confidence * 100) }}%</p>
          
          <p class="slide-in-element recommendations-title">Recommendations</p>
          <ul class="recommendations-list">
            <li
              v-for="(recommendation, index) in recommendations"
              :key="index"
              :style="{ animationDelay: `${0.8 + index * 0.2}s` }"
              class="recommendation-item slide-in-element"
            >
              {{ recommendation }}
            </li>
          </ul>
          
          <div v-if="prediction.top_diseases" class="top-diseases slide-in-element">
            <h4>Top Predictions:</h4>
            <div class="disease-list">
              <div v-for="(disease, index) in prediction.top_diseases" :key="index" class="disease-item">
                {{ disease.disease }}: {{ (disease.probability * 100).toFixed(2) }}%
                <div class="confidence-bar" :style="{ width: Math.round(disease.probability * 200) + 'px' }"></div>
              </div>
            </div>
          </div>
          
          <h4 class="slide-in-element">Symptoms Analyzed:</h4>
          <ul class="symptoms-list slide-in-element">
            <li v-for="(symptom, index) in selectedSymptoms" :key="index">
              {{ symptom.name }}
            </li>
          </ul>
          
          <div class="note-div slide-in-element">
            <p>
              Note: This is an AI-powered prediction and should not replace
              professional medical advice. Please consult a medical healthcare
              provider for accurate diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
      </transition>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";

// API URL - change this to your server address
const API_URL = 'https://ai-model-jiy2.onrender.com';

const symptomInput = ref("");
const allSymptoms = ref([]);
const filteredSymptoms = ref([]);
const selectedSymptoms = ref([]);
const loading = ref(false);
const loadingSymptoms = ref(true);
const prediction = ref(null);
const recommendations = ref([]);
const progressWidth = ref(0);
const showResults = ref(false);
const showDropdown = ref(false);

onMounted(async () => {
  try {
    await loadSymptoms();
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    alert('Failed to load symptoms. Please check if the API server is running.');
  }
});

const loadSymptoms = async () => {
  loadingSymptoms.value = true;
  try {
    const response = await fetch(`${API_URL}/symptoms`);
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    allSymptoms.value = await response.json();
    filteredSymptoms.value = [...allSymptoms.value];
  } catch (error) {
    console.error('Error loading symptoms:', error);
    throw error;
  } finally {
    loadingSymptoms.value = false;
  }
};

const filterSymptoms = () => {
  if (!symptomInput.value.trim()) {
    filteredSymptoms.value = [...allSymptoms.value];
    return;
  }
  
  const input = symptomInput.value.toLowerCase();
  filteredSymptoms.value = allSymptoms.value.filter(symptom => 
    symptom.name.toLowerCase().includes(input)
  );
};

const handleBlur = () => {
  // Delay hiding dropdown to allow click events to register
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const addSymptomFromDropdown = (symptom) => {
  // Check if already selected
  if (selectedSymptoms.value.some(s => s.id === symptom.id)) {
    alert('This symptom is already selected');
    return;
  }
  
  // Add to selected symptoms
  selectedSymptoms.value.push(symptom);
  
  // Reset input and dropdown
  symptomInput.value = "";
  showDropdown.value = false;
  filteredSymptoms.value = [...allSymptoms.value];
};

const addManualSymptom = () => {
  if (!symptomInput.value.trim()) return;
  
  // Check if symptom exists in our list
  const existingSymptom = allSymptoms.value.find(
    s => s.name.toLowerCase() === symptomInput.value.trim().toLowerCase()
  );
  
  if (existingSymptom) {
    addSymptomFromDropdown(existingSymptom);
  } else {
    // Add as custom symptom
    const newSymptom = {
      id: `custom-${Date.now()}`,
      name: symptomInput.value.trim()
    };
    
    selectedSymptoms.value.push(newSymptom);
    symptomInput.value = "";
  }
};

const removeSymptom = (index) => {
  selectedSymptoms.value.splice(index, 1);
};

const startProgress = () => {
  progressWidth.value = 0;
  setTimeout(() => {
    progressWidth.value = Math.round(prediction.value.confidence * 100);
  }, 100);
};

const parseRecommendations = (text) => {
  // First, join any broken lines that were cut off
  let cleanedText = text.toString()
    .replace(/;\s*\n/g, '; ') // Join lines broken by semicolons
    .replace(/\n(?=[a-z])/g, ' '); // Join lines that break mid-sentence
    
  // Split by bullet points or numbers
  const lines = cleanedText.split(/[•\*\-\d+\.]\s+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
    
  // Clean up and format recommendations
  const cleanedRecs = lines.map(line => {
    // Remove trailing semicolons
    line = line.replace(/;$/, '');
    
    // Ensure sentence ends with proper punctuation
    if (!line.endsWith('.') && !line.endsWith('!') && !line.endsWith('?')) {
      line += '.';
    }
    
    // Capitalize first letter
    line = line.charAt(0).toUpperCase() + line.slice(1);
    
    return line;
  });

  // Take first 3 valid recommendations
  return cleanedRecs
    .filter(rec => rec.length >= 10) // Ensure minimum length for complete sentences
    .slice(0, 3);
};

const getDefaultRecommendations = (disease) => {
  const defaultRecs = {
    "Common Cold": [
      "Rest and stay hydrated",
      "Use over-the-counter cold medications",
      "Monitor symptoms for 3-4 days",
    ],
    "Bronchial Asthma": [
      "Use prescribed inhalers as directed",
      "Avoid known triggers",
      "Keep rescue inhaler nearby",
    ],
    // Add more default recommendations for other conditions
  };

  return (
    defaultRecs[disease] || [
      "Rest and stay hydrated",
      "Monitor your symptoms",
      "Consult a healthcare provider if symptoms worsen",
    ]
  );
};

const checkSymptoms = async () => {
  // If there's text in the input, try to add it first
  if (symptomInput.value.trim()) {
    addManualSymptom();
  }
  
  if (selectedSymptoms.value.length === 0) {
    alert('Please select at least one symptom');
    return;
  }
  
  loading.value = true;
  prediction.value = null;
  showResults.value = false;

  try {
    // Get symptom names
    const symptomNames = selectedSymptoms.value.map(s => s.name);
    
    // Call API
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        symptoms: symptomNames
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const result = await response.json();
    prediction.value = result;
    
    try {
      // Get recommendations using Puter.js
      const prompt = `List exactly 3 brief medical recommendations for ${result.predicted_disease}. Use bullet points and do not highlight text in the response.`;
      const puter_response = await puter.ai.chat(prompt);

      if (puter_response) {
        recommendations.value = parseRecommendations(puter_response);

        // If parsing failed or didn't return enough recommendations, use defaults
        if (recommendations.value.length < 3) {
          recommendations.value = getDefaultRecommendations(
            result.predicted_disease
          );
        }
      } else {
        recommendations.value = getDefaultRecommendations(
          result.predicted_disease
        );
      }
    } catch (puterError) {
      console.error("Puter.js error:", puterError);
      recommendations.value = getDefaultRecommendations(
        result.predicted_disease
      );
    }
    
    // Show results after data is ready
    setTimeout(() => {
      showResults.value = true;
    }, 300);
  } catch (error) {
    console.error('Prediction error:', error);
    prediction.value = {
      predicted_disease: "Unable to process",
      confidence: 0.5,
      top_diseases: [
        { disease: "Error", probability: 1.0 }
      ],
      symptoms_provided: selectedSymptoms.value.map(s => s.name)
    };
    recommendations.value = [
      "Please try again later",
      "Check your internet connection",
      "Contact support if the issue persists",
    ];
    setTimeout(() => {
      showResults.value = true;
    }, 300);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.slide-in-from-top {
  animation: slideFromTop 0.6s ease-out forwards;
}

.slide-in-from-left {
  animation: slideFromLeft 0.6s ease-out forwards;
}

.slide-in-from-right {
  animation: slideFromRight 0.6s ease-out forwards;
}

.slide-in-element {
  opacity: 0;
  animation: slideUp 0.5s ease forwards;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

@keyframes slideFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add animation delays for staggered entrance */
.first-inner-second > * {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

.first-inner-second > *:nth-child(1) { animation-delay: 0.2s; }
.first-inner-second > *:nth-child(2) { animation-delay: 0.3s; }
.first-inner-second > *:nth-child(3) { animation-delay: 0.4s; }
.first-inner-second > *:nth-child(4) { animation-delay: 0.5s; }
.first-inner-second > *:nth-child(5) { animation-delay: 0.6s; }
.first-inner-second > *:nth-child(6) { animation-delay: 0.7s; }

/* Dropdown and input styling */
.input-dropdown-container {
  position: relative;
  width: 100%;
  margin-bottom: 16px; /* Added spacing */
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text-primary);
  background-color: var(--secondary-bg);
}

.dropdown-item:hover {
  background-color: var(--accent-color);
  color: var(--common-white);
}

.dropdown-item.disabled {
  color: var(--border-color);
  cursor: default;
}

/* Input with chips styling */
.input-chips-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  min-height: 2rem;
  border-radius: 0.3rem;
  background-color: var(--secondary-bg);
  border: 1px solid var(--border-color);
  padding: 8px; /* Increased padding */
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px; /* Increased gap */
  max-width: 100%;
  margin-bottom: 4px; /* Added space below chips */
}

.symptom-chip {
  display: inline-flex;
  align-items: center;
  background-color: var(--accent-color);
  color: white;
  padding: 3px 10px; /* Increased padding */
  border-radius: 12px;
  margin: 2px;
  font-size: 12px;
}

.chip-text {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-delete {
  margin-left: 6px; /* Increased margin */
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.chip-delete:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.input-bar {
  flex: 1;
  height: 2rem; /* Increased height */
  border: none !important;
  outline: none;
  padding-left: 0.5rem;
  margin: 0 !important;
  background-color: transparent !important;
  color: var(--text-primary) !important;
}

.no-symptoms {
  margin-top: 16px; /* Increased margin */
  margin-bottom: 16px; /* Added margin below */
  color: var(--text-secondary);
  font-style: italic;
}

/* Top diseases list */
.disease-list {
  margin: 16px 0; /* Increased margin */
}

.disease-item {
  padding: 12px; /* Increased padding */
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 12px; /* Increased gap */
  margin-bottom: 6px; /* Added margin between items */
}

.disease-item:last-child {
  border-bottom: none;
}

.confidence-bar {
  height: 14px; /* Increased height */
  background-color: var(--accent-color);
  display: inline-block;
  border-radius: 3px; /* Increased radius */
  vertical-align: middle;
}

.top-diseases {
  margin: 24px 0; /* Added spacing */
}

.symptoms-list {
  margin-top: 8px;
  margin-bottom: 24px; /* Added bottom margin */
}

.symptoms-list li {
  margin-bottom: 8px; /* Increased spacing between items */
  line-height: 1.5; /* Improved line height */
}

/* Recommendations styling */
.recommendations-title {
  font-weight: 600;
  margin-top: 24px !important; /* Added extra top margin */
  margin-bottom: 6px !important; /* Reduced bottom margin */
}

.recommendations-list {
  margin-bottom: 24px; /* Added space after list */
}

.recommendation-item {
  margin-bottom: 14px !important; /* Increased space between items */
  line-height: 1.5; /* Improved line height */
  padding-right: 12px; /* Added padding */
}

/* Results elements spacing */
.first-inner-second h3 {
  margin-bottom: 10px; /* Added spacing */
  font-family: "Poppins", sans-serif;
  color: var(--text-secondary);
}

.first-inner-second h4 {
  margin-top: 24px; /* Added top margin */
  margin-bottom: 12px; /* Added bottom margin */
  font-family: "Poppins", sans-serif;
  color: var(--text-secondary);
}

/* Initial state */
.tool-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.results-area {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.initial-state {
  width: 96%;
  height: 26rem;
  background-color: var(--main-bg);
  border-radius: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
}

.initial-content {
  text-align: center;
  color: var(--text-secondary);
  opacity: 0.7;
  padding: 24px; /* Added padding */
}

.health-icon {
  margin-bottom: 1.5rem; /* Increased margin */
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.percent-first {
  width: 98%;
  height: 0.7rem; /* Increased height */
  background-color: rgb(231, 229, 229);
  border-radius: 0.3rem;
  margin-top: 0.8rem; /* Increased margin */
  margin-bottom: 0.8rem; /* Increased margin */
}

.percent-sec {
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 0;
  height: 0.7rem; /* Increased height */
  border-radius: 0.3rem;
  background-color: var(--accent-color);
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

.loader-small {
  width: 14px;
  height: 14px;
  border: 2px solid var(--text-secondary);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

button {
  transition: background-color 0.3s ease;
}

button.loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.first-div {
  width: 100%;
  height: auto;
  min-height: 100%;
  background-color: var(--main-bg);
  display: flex;
  flex-direction: column;
  padding: 0 12px; /* Added horizontal padding */
  overflow-y: auto;
  max-height: 100vh;
  margin-top: 2rem;
}

.first-inner-first {
  width: 97%;
  height: auto; /* Changed to auto height */
  min-height: 14rem; /* Set minimum height */
  background-color: var(--secondary-bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  border-radius: 1rem;
  margin-bottom: 1.5rem; /* Increased margin */
  padding: 24px; /* Increased padding */
  margin-left: 1.2rem;
  margin-top: 1.5rem; /* Increased margin */
}

.first-inner-first h1 {
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  color: var(--text-primary);
  margin-bottom: 16px; /* Added margin */
}

.first-inner-upper {
  width: 100%;
  height: auto; /* Changed to auto */
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-bottom: 20px; /* Added margin */
}

.first-inner-upper p {
  font-size: var(--font-size-base);
  font-family: "Poppins", sans-serif;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.first-inner-input {
  width: 98%;
  background-color: var(--secondary-bg);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 1rem; /* Increased margin */
}

.first-inner-input select {
  width: 100%;
  height: 2.4rem; /* Increased height */
  border-radius: 0.3rem;
  margin-left: 0rem;
  margin-bottom: 0.8rem; /* Increased margin */
  color: var(--text-primary);
  padding-left: 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--secondary-bg);
}

.first-inner-btn {
  width: 98%;
  height: auto; /* Changed to auto */
  background-color: var(--secondary-bg);
  display: flex;
  align-items: center;
  margin-top: 12px; /* Added space between input and button */
}

.first-inner-btn button {
  width: 100%;
  height: 3rem; /* Increased height */
  background-color: var(--accent-color);
  border-radius: 0.5rem;
  color: var(--common-white);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem; /* Increased font size */
  font-weight: 500; /* Added font weight */
}

.first-inner-second {
  width: 97%;
  height: auto; /* Changed to auto */
  min-height: 26rem; /* Set minimum height */
  background-color: var(--secondary-bg);
  padding: 24px; /* Increased padding */
  border-radius: 1rem;
  margin-bottom: 1.5rem; /* Increased margin */
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  max-width: 1200px;
}

.first-inner-second h2 {
  font-family: "Poppins", sans-serif;
  color: var(--accent-color);
  margin-top: 0.5rem; /* Increased margin */
  margin-bottom: 1rem; /* Increased margin */
  font-size: 1.8rem; /* Increased font size */
}

.first-inner-second p {
  font-size: var(--font-size-base);
  font-family: "Poppins", sans-serif;
  margin-top: 1.4rem;
  margin-bottom: 0.7rem; /* Added bottom margin */
  color: var(--text-secondary);
  line-height: 1.5; /* Improved line height */
}

.first-inner-second li {
  font-size: var(--font-size-base);
  font-family: "Poppins", sans-serif;
  margin-top: 0.7rem; /* Reduced top margin */
  margin-bottom: 0.7rem; /* Added bottom margin */
  margin-left: 1.5rem; /* Increased left margin */
  color: var(--text-secondary);
  line-height: 1.5; /* Improved line height */
}

.results-scroll-container {
  height: 100%;
  overflow-y: auto;
  padding-right: 0.8rem; /* Increased padding */
  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) var(--secondary-bg);
}

.results-scroll-container::-webkit-scrollbar {
  width: 8px; /* Increased width */
}

.results-scroll-container::-webkit-scrollbar-track {
  background: var(--secondary-bg);
  border-radius: 4px; /* Added radius */
}

.results-scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--accent-color);
  border-radius: 6px;
}

.note-div {
  width: 98%;
  height: auto; /* Changed to auto */
  min-height: 3rem; /* Set minimum height */
  background-color: antiquewhite;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 2rem; /* Increased margin */
  margin-bottom: 1rem; /* Added bottom margin */
  padding: 16px; /* Added padding all around */
  border-radius: 0.7rem;
}

.note-div p {
  font-size: 13.2px;
  font-family: "Poppins", sans-serif;
  color: rgb(189, 60, 60);
  margin: 0; /* Reset margin to prevent double spacing */
  line-height: 1.5; /* Improved line height */
}

@media screen and (max-width: 1024px) {
  .first-inner-first h1 {
    margin-left: 0; /* Fixed positioning */
    text-align: center;
  }

  .first-inner-upper p {
    margin-left: 0; /* Fixed positioning */
  }
}

@media screen and (max-width: 768px) {
  .initial-state {
    width: 98%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .first-div {
    padding: 0 10px; /* Added padding */
    overflow-y: auto;
    height: auto;
  }

  .tool-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .results-area {
    width: 100%;
  }

  .first-inner-first {
    height: auto;
    width: 94%; /* Adjusted width */
    padding: 20px; /* Adjusted padding */
    margin: 12px auto; /* Centered with margin */
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .first-inner-upper p {
    margin-left: 0;
    text-align: left;
    width: 100%;
  }

  .first-inner-input {
    width: 100%;
  }

  .first-inner-input input, .first-inner-input select {
    width: 100%;
    margin: 0;
    margin-bottom: 16px; /* Increased margin */
  }

  .first-inner-btn {
    width: 100%;
    height: auto; 
    padding-bottom: 12px; /* Added padding */
  }

  .first-inner-btn button {
    height: 3.5rem; /* Increased height on mobile */
  }

  .first-inner-second {
    width: 94%; /* Adjusted width */
    height: auto;
    min-height: 26rem;
    padding: 20px; /* Adjusted padding */
    margin: 0 auto 20px auto; /* Centered with margin */
  }

  .first-inner-second h2 {
    font-size: 1.6rem;
  }

  .first-inner-second p {
    margin-left: 0;
    margin-bottom: 12px; /* Added margin */
  }

  .first-inner-second li {
    margin-left: 24px; /* Increased margin */
    margin-bottom: 12px; /* Added margin */
  }

  .note-div {
    height: auto;
    padding: 16px; /* Increased padding */
    margin-top: 24px; /* Increased margin */
    width: 100%; /* Full width on mobile */
  }

  .note-div p {
    margin: 0;
    font-size: 12px;
    text-align: center;
    line-height: 1.5;
  }
}
</style>