<template>
  <div class="first-div slide-in-from-top">
    <div class="first-inner-first slide-in-from-left">
      <h1>Disease Prediction Tool</h1>
      <div class="first-inner-upper">
        <p>Select your symptoms</p>
        <div class="first-inner-input">
          <!-- Symptom input with dropdown -->
          <div class="input-dropdown-container">
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
        
        <!-- Selected symptoms chips/tags -->
        <div class="selected-symptoms-container" v-if="selectedSymptoms.length > 0">
          <span 
            v-for="(symptom, index) in selectedSymptoms" 
            :key="index" 
            class="symptom-tag"
            @click="removeSymptom(index)"
          >
            {{ symptom.name }} ×
          </span>
        </div>
        <p v-else class="no-symptoms">No symptoms selected yet</p>
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
    </transition>
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
}

.dropdown-item:hover {
  background-color: var(--accent-color);
  color: var(--common-white);
}

.dropdown-item.disabled {
  color: var(--border-color);
  cursor: default;
}

/* Symptom tag styles */
.selected-symptoms-container {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
}

.symptom-tag {
  display: inline-block;
  background-color: var(--accent-color);
  color: white;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.symptom-tag:hover {
  background-color: #e74c3c;
}

.no-symptoms {
  margin-top: 10px;
  color: var(--text-secondary);
  font-style: italic;
}

/* Top diseases list */
.disease-list {
  margin: 10px 0;
}

.disease-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
}

.disease-item:last-child {
  border-bottom: none;
}

.confidence-bar {
  height: 12px;
  background-color: var(--accent-color);
  display: inline-block;
  border-radius: 2px;
  vertical-align: middle;
}

.symptoms-list li {
  margin-bottom: 5px;
}

/* Keep all your existing styles below */
.initial-state {
  width: 96%;
  height: 26rem;
  background-color: var(--main-bg);
  border-radius: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1.2rem;
}

.initial-content {
  text-align: center;
  color: var(--text-secondary);
  opacity: 0.7;
}

.health-icon {
  margin-bottom: 1rem;
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

.percent-sec {
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 0;
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
  height: 100%;
  background-color: var(--main-bg);
  display: flex;
  flex-direction: column;
}
.first-inner-first {
  width: 97%;
  height: 13rem;
  background-color: var(--secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
  padding-left: 1rem;
  margin-left: 1.2rem;
  margin-top: 1rem;
  h1 {
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    color: var(--text-primary);
  }
}
.first-inner-upper {
  width: 100%;
  height: 40%;
  display: flex;
  align-items: flex-start;

  p {
    font-size: var(--font-size-base);
    font-family: "Poppins", sans-serif;
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }
  flex-direction: column;
}
.first-inner-input {
  width: 98%;
  height: 35%;
  background-color: var(--secondary-bg);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  input, select {
    width: 100%;
    height: 2rem;
    border-radius: 0.3rem;
    margin-left: 0rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    padding-left: 1rem;
    border: 1px solid var(--border-color);
    background-color: var(--secondary-bg);
  }
}
.first-inner-btn {
  width: 98%;
  height: 25%;
  background-color: var(--secondary-bg);
  display: flex;
  align-items: center;
  button {
    width: 100%;
    height: 80%;
    background-color: var(--accent-color);
    border-radius: 0.5rem;
    color: var(--common-white);
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.first-inner-second {
  width: 97%;
  height: 26rem;
  background-color: var(--secondary-bg);
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
  h2 {
    font-family: "Poppins", sans-serif;
    color: var(--accent-color);
    margin-top: 0.3rem;
    margin-bottom: 0.4rem;
  }
  p {
    font-size: var(--font-size-base);
    font-family: "Poppins", sans-serif;
    margin-top: 1.4rem;
    color: var(--text-secondary);
  }
  li {
    font-size: var(--font-size-base);
    font-family: "Poppins", sans-serif;
    margin-top: 1rem;
    margin-left: 1rem;
    color: var(--text-secondary);
  }
}
.percent-first {
  width: 98%;
  height: 0.5rem;
  background-color: rgb(231, 229, 229);
  border-radius: 0.3rem;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}
.percent-sec {
  width: 85%;
  height: 0.5rem;
  border-radius: 0.3rem;
  background-color: var(--accent-color);
}
.note-div {
  width: 98%;
  height: 3rem;
  background-color: antiquewhite;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 1rem;
  padding-bottom: 1.2rem;
  p {
    font-size: 13.2px;
    font-family: "Poppins", sans-serif;
    color: rgb(189, 60, 60);
  }
  border-radius: 0.7rem;
}
@media screen and (max-width: 1024px) {
  .first-inner-first h1 {
    margin-left: -40rem;
  }

  .first-inner-upper p {
    margin-left: -45rem;
  }
}

@media screen and (max-width: 768px) {
  .initial-state {
    width: 98%;
    margin-left: 0rem;
  }
  
  .frist-div {
    padding-left: 0.7rem;
  }

  .first-inner-first {
    height: auto;
    width: 98%;
    padding: 1.5rem 1rem;
    margin-top: 0.5rem;
    margin-left: 0rem;

    h1 {
      margin-left: 0rem;
      text-align: center;
      font-size: 24px;
    }
  }

  .first-inner-upper {
    p {
      margin-left: 0.5rem;
      text-align: left;
      width: 100%;
    }
  }

  .first-inner-input {
    width: 100%;

    input, select {
      width: 100%;
      margin: 0;
      margin-bottom: 1rem;
    }
  }
  .first-inner-btn {
    height: 3.5rem;
  }

  .first-inner-second {
    height: auto;
    padding: 1.5rem;

    h2 {
      font-size: 1.6rem;
    }
    p {
      margin-left: 0;
    }
    li {
      margin-left: 2rem;
    }
  }

  .note-div {
    height: auto;
    padding: 0.5rem;
    margin-top: 2rem;

    p {
      margin: 0.5rem;
      font-size: 0.7rem;
      text-align: center;
    }
  }
}
</style>