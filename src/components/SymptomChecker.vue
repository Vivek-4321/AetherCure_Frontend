<template>
    <div class="frist-div">
      <div class="first-inner-first">
        <h1>Symptom Checker</h1>
        <div class="first-inner-upper">
          <p>Select your symptoms</p>
          <div class="first-inner-input">
            <input
              v-model="symptoms"
              type="text"
              class="input-bar"
              placeholder="Enter symptoms (e.g., fever and cough)"
              :disabled="loading"
            />
          </div>
        </div>
        <div class="first-inner-btn">
          <button
            @click="checkSymptoms"
            :disabled="loading || !symptoms"
            :class="{ loading: loading }"
          >
            <span v-if="!loading">Check Symptoms</span>
            <span v-else class="loader"></span>
          </button>
        </div>
      </div>
  
      <!-- Initial state or loading message -->
      <div v-if="!showResults" class="initial-state">
        <div class="initial-content">
          <Icon 
            icon="hugeicons:align-box-bottom-left" 
            class="health-icon"
            :style="{ fontSize: '4rem', color: 'var(--text-secondary)' }"
          />
          <p v-if="!loading">Enter your symptoms above to get an AI-powered health assessment</p>
          <p v-else>Analyzing your symptoms...</p>
        </div>
      </div>
  
      <!-- Results section with fade and slide animation -->
      <transition name="fade-slide" @enter="startProgress">
        <div v-if="showResults" class="first-inner-second">
          <!-- Rest of your results content remains the same -->
          <h3>Predicted Condition</h3>
          <h2>{{ prediction.predicted_disease }}</h2>
          <p>Confidence level</p>
          <div class="percent-first">
            <div
              ref="progressBar"
              class="percent-sec"
              :style="{ width: progressWidth + '%' }"
            ></div>
          </div>
          <p>{{ Math.round(prediction.confidence * 100) }}%</p>
          <p>Recommendations</p>
          <ul>
            <li
              v-for="(recommendation, index) in recommendations"
              :key="index"
              :style="{ animationDelay: `${index * 0.2}s` }"
              class="recommendation-item"
            >
              {{ recommendation }}
            </li>
          </ul>
          <div class="note-div">
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

const symptoms = ref("");
const loading = ref(false);
const prediction = ref(null);
const recommendations = ref([]);
const progressWidth = ref(0);
const showResults = ref(false);

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
  if (!symptoms.value) return;

  loading.value = true;
  prediction.value = null;
  recommendations.value = [];
  showResults.value = false;

  try {
    // API call for prediction
    const response = await fetch(
      "https://sample-server-ktep.onrender.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom: symptoms.value }),
      }
    );

    const data = await response.json();
    if (data.status === "success") {
      prediction.value = data.result;

      try {
        // Get recommendations using Puter.js
        const prompt = `List exactly 3 brief medical recommendations for ${data.result.predicted_disease}. Use bullet points and do not highlight text in the response.`;
        const puter_response = await puter.ai.chat(prompt);

        if (puter_response) {
          recommendations.value = parseRecommendations(puter_response);

          // If parsing failed or didn't return enough recommendations, use defaults
          if (recommendations.value.length < 3) {
            recommendations.value = getDefaultRecommendations(
              data.result.predicted_disease
            );
          }
        } else {
          recommendations.value = getDefaultRecommendations(
            data.result.predicted_disease
          );
        }
      } catch (puterError) {
        console.error("Puter.js error:", puterError);
        recommendations.value = getDefaultRecommendations(
          data.result.predicted_disease
        );
      }

      // Show results only after all data is ready
      setTimeout(() => {
        showResults.value = true;
      }, 300);
    }
  } catch (error) {
    console.error("API error:", error);
    // Show error state or default recommendations
    prediction.value = {
      predicted_disease: "Unable to process",
      confidence: 0.5,
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

.recommendation-item {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
  input {
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
  width: 98%;
  height: 26rem;
  background-color: var(--secondary-bg);
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
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

    input {
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
