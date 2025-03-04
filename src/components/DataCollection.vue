<template>
    <div class="data-first-div slide-in-from-top">
        <h1 class="fade-in">{{ isEditing ? 'Update Medical Information' : 'Data Collection' }}</h1>
        <div class="data-sec-div fade-in-up">
            <!-- Personal Info Section -->
            <div class="data-third-div">
                <div class="third-inner slide-in-left">
                    <div class="third-inner-first animate-entry">
                        <p>Full name</p>
                        <input 
                            v-model="formData.fullName" 
                            placeholder="Andy Dufresne"
                            :class="{ 'error-input': validationErrors.fullName }"
                        />
                        <small v-if="validationErrors.fullName" class="error-text">{{ validationErrors.fullName }}</small>
                    </div>
                    <div class="third-inner-second animate-entry">
                        <p>Age</p>
                        <input 
                            v-model="formData.age" 
                            placeholder="18"
                            type="number"
                            :class="{ 'error-input': validationErrors.age }"
                        />
                        <small v-if="validationErrors.age" class="error-text">{{ validationErrors.age }}</small>
                    </div>
                </div>
                <div class="third-inner-right slide-in-right">
                    <div class="third-inner-right-first animate-entry">
                        <p>Blood Pressure</p>
                        <input 
                            v-model="formData.bloodPressure" 
                            placeholder="120/80"
                            :class="{ 'error-input': validationErrors.bloodPressure }"
                        />
                        <small v-if="validationErrors.bloodPressure" class="error-text">{{ validationErrors.bloodPressure }}</small>
                    </div>
                    <div class="third-inner-right-second animate-entry">
                        <p>Blood Sugar</p>
                        <input 
                            v-model="formData.bloodSugar" 
                            placeholder="mg/dL"
                            :class="{ 'error-input': validationErrors.bloodSugar }"
                        />
                        <small v-if="validationErrors.bloodSugar" class="error-text">{{ validationErrors.bloodSugar }}</small>
                    </div>
                </div>
            </div>

            <!-- Medical Info Section -->
            <div class="data-four-div fade-in-up">
                <div class="four-first animate-entry">
                    <p>Current Medical Condition</p>
                    <textarea 
                        v-model="formData.medicalCondition" 
                        name="medicalcondition" 
                        id="cmc"
                        :class="{ 'error-input': validationErrors.medicalCondition }"
                    ></textarea>
                    <small v-if="validationErrors.medicalCondition" class="error-text">{{ validationErrors.medicalCondition }}</small>
                </div>
                <div class="four-Second animate-entry">
                    <p>Medical Background</p>
                    <textarea 
                        v-model="formData.medicalBackground" 
                        name="MedicalBackground" 
                        id="mb"
                        :class="{ 'error-input': validationErrors.medicalBackground }"
                    ></textarea>
                    <small v-if="validationErrors.medicalBackground" class="error-text">{{ validationErrors.medicalBackground }}</small>
                </div>
                <div class="four-third animate-entry">
                    <label class="switch">
                        <input type="checkbox" v-model="formData.shareData">
                        <span class="slider round"></span>
                    </label>
                    <p>share data for research</p>
                </div>
                <div class="four-four animate-entry">
                    <button @click="saveInformation" :disabled="isSubmitting">
                        <span v-if="isSubmitting">Saving...</span>
                        <span v-else>{{ isEditing ? 'Update Information' : 'Save Information' }}</span>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Data loading indicator -->
        <div v-if="isLoading" class="data-loading-indicator fade-in">
            Loading your medical data...
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Form data state
const formData = ref({
  fullName: '',
  bloodPressure: '',
  age: '',
  bloodSugar: '',
  medicalCondition: '',
  medicalBackground: '',
  shareData: false,
  weight: 70, // Default values for blockchain API
  height: 170 // Default values for blockchain API
})

// UI state management
const isSubmitting = ref(false)
const isLoading = ref(false)
const validationErrors = ref({})
const mainApiBaseUrl = ref('') // Deno auth backend
const blockchainApiBaseUrl = ref('') // Express blockchain backend
const userData = ref(null)
const existingMedicalData = ref(null)
const isEditing = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    
    // In a real app, these would be accessed from the environment
    mainApiBaseUrl.value ='https://high-goose-81-7wg96m812d17.deno.dev';
    blockchainApiBaseUrl.value = import.meta.env.VITE_BLOCKCHAIN_API_URL || 'http://localhost:3000'
    
    // Fetch user data
    await fetchUserData()
    
    // fetchExistingMedicalData is already called inside fetchUserData after user data is loaded
  } catch (error) {
    console.error('Error initializing component:', error)
    toast.error('Error loading your data. Please refresh the page.', {
      position: "top-right",
      autoClose: 4000
    })
  } finally {
    isLoading.value = false
  }
})

// Fetch user data from main backend
const fetchUserData = async () => {
  try {
    isLoading.value = true
    
    // Check for token using the key from Login.vue
    const token = localStorage.getItem('authToken')
    if (!token) {
      toast.warning("Please log in to save your medical information", {
        position: "top-right",
        autoClose: 3000
      })
      return
    }
    
    const response = await axios.get(`${mainApiBaseUrl.value}/getUser`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    userData.value = response.data
    console.log('User data loaded:', userData.value)
    
    // Once user data is loaded, try to get existing medical records
    if (userData.value) {
      await fetchExistingMedicalData()
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    
    if (error.response && error.response.status === 401) {
      toast.error("Your session has expired. Please log in again.", {
        position: "top-right",
        autoClose: 5000
      })
    }
  } finally {
    isLoading.value = false
  }
}

// Validate all form fields
const validateForm = () => {
  const errors = {}
  
  if (!formData.value.fullName?.trim()) {
    errors.fullName = 'Full name is required'
  }
  
  if (!formData.value.age) {
    errors.age = 'Age is required'
  } else if (isNaN(formData.value.age) || Number(formData.value.age) <= 0) {
    errors.age = 'Please enter a valid age'
  }
  
  if (!formData.value.bloodPressure?.trim()) {
    errors.bloodPressure = 'Blood pressure is required'
  }
  
  if (!formData.value.bloodSugar?.trim()) {
    errors.bloodSugar = 'Blood sugar is required'
  }
  
  if (!formData.value.medicalCondition?.trim()) {
    errors.medicalCondition = 'Medical condition is required'
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

// Get user ID from userData or localStorage, handling case sensitivity
const getUserId = () => {
  try {
    if (userData.value) {
      // Handle potential case variations in response
      return userData.value.userId || userData.value.userid || userData.value.userID
    }
    
    // Fallback to localStorage
    return localStorage.getItem('userId')
  } catch (error) {
    console.error('Error getting user ID:', error)
    return null
  }
}

// Update user's blockchain ID in main database
const updateBlockchainId = async (blockchainId) => {
  try {
    console.log('Updating user blockchain ID to:', blockchainId)
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Authentication token not found')
    }
    
    const response = await axios.post(
      `${mainApiBaseUrl.value}/updateBlockchainId`,
      { blockchainId: blockchainId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('Blockchain ID updated successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating blockchain ID:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    throw error
  }
}

// Helper function to get property value regardless of case
const getProperty = (obj, propName) => {
  if (!obj) return null
  
  // First try direct access
  if (obj[propName] !== undefined) return obj[propName]
  
  // Then try case-insensitive match
  const lowerPropName = propName.toLowerCase()
  for (const key in obj) {
    if (key.toLowerCase() === lowerPropName) {
      return obj[key]
    }
  }
  
  return null
}

// Fetch existing medical data from blockchain and your own database
const fetchExistingMedicalData = async () => {
  try {
    isLoading.value = true
    
    // Need to get the blockchain ID from user data - check all possible property casings
    let blockchainId = null
    
    if (userData.value) {
      blockchainId = userData.value.userIdOnBlockchain || 
                     userData.value.useridOnblockchain || 
                     userData.value.userIdOnblockchain || 
                     userData.value.useridOnBlockchain ||
                     userData.value.useridonblockchain
                        
      console.log('Found blockchain ID in user data:', blockchainId)
    }
    
    // Create object to store initial form data
    let formDataInitial = {
      fullName: '',
      bloodPressure: '',
      bloodSugar: '',
      age: '',
      weight: 70,
      height: 170,
      medicalCondition: '',
      medicalBackground: '',
      shareData: false
    }
    
    // Flag to track if blockchain data was found
    let blockchainDataFound = false
    
    // If blockchain ID exists, try to fetch from blockchain
    if (blockchainId) {
      console.log('Fetching medical data for blockchain ID:', blockchainId)
      
      try {
        const response = await axios.get(
          `${blockchainApiBaseUrl.value}/medical-records/${blockchainId}`
        )
        
        existingMedicalData.value = response.data
        isEditing.value = true
        blockchainDataFound = true
        
        console.log('Existing medical data loaded from blockchain:', existingMedicalData.value)
        
        // Handle all possible field name variations from blockchain
        const data = existingMedicalData.value
        formDataInitial.fullName = getProperty(data, 'name') || getProperty(data, 'Name') || ''
        formDataInitial.age = (getProperty(data, 'age') || getProperty(data, 'Age') || '')?.toString()
        formDataInitial.bloodPressure = getProperty(data, 'bloodPressure') || getProperty(data, 'BloodPressure') || ''
        formDataInitial.bloodSugar = getProperty(data, 'bloodSugar') || getProperty(data, 'BloodSugar') || getProperty(data, 'SugarLevel') || ''
        formDataInitial.weight = getProperty(data, 'weight') || getProperty(data, 'Weight') || 70
        formDataInitial.height = getProperty(data, 'height') || getProperty(data, 'Height') || 170
        
        // Log the extracted blockchain values
        console.log('Extracted blockchain values:', { 
          fullName: formDataInitial.fullName,
          age: formDataInitial.age,
          bloodPressure: formDataInitial.bloodPressure, 
          bloodSugar: formDataInitial.bloodSugar,
          weight: formDataInitial.weight,
          height: formDataInitial.height
        })
      } catch (error) {
        console.error('Error fetching from blockchain:', error)
        // Continue to fetch from local database even if blockchain fetch fails
      }
    }
    
    // Now fetch medical condition and background from your own database
    console.log('Fetching medical condition and background from database')
    
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      const medicalInfoResponse = await axios.get(
        `${mainApiBaseUrl.value}/medical-info`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (medicalInfoResponse.data) {
        console.log('Medical info from database:', medicalInfoResponse.data)
        
        // Update form data with values from your database
        formDataInitial.medicalCondition = medicalInfoResponse.data.medicalCondition || ''
        formDataInitial.medicalBackground = medicalInfoResponse.data.medicalBackground || ''
        formDataInitial.shareData = medicalInfoResponse.data.shareData || false
        
        // If we didn't get blockchain data but have database data, set isEditing to true
        if (!blockchainDataFound && (formDataInitial.medicalCondition || formDataInitial.medicalBackground)) {
          isEditing.value = true
        }
      }
    } catch (error) {
      console.error('Error fetching medical info from database:', error)
      // This is not critical - we can still proceed with blockchain data if available
    }
    
    // Update form data with all collected information
    formData.value = formDataInitial
    
    console.log('Form data populated:', formData.value)
    
    if (isEditing.value) {
      toast.info('Your existing medical information has been loaded', {
        position: "top-right",
        autoClose: 3000
      })
    }
  } catch (error) {
    console.error('Error in fetchExistingMedicalData:', error)
    toast.error('Error loading your medical data', {
      position: "top-right",
      autoClose: 3000
    })
  } finally {
    isLoading.value = false
  }
}
  

// Save new data to blockchain
const saveToBlockchain = async (medicalData) => {
  try {
    console.log('Saving to blockchain API:', `${blockchainApiBaseUrl.value}/medical-records`)
    console.log('Data being sent:', medicalData)
    
    const response = await axios.post(
      `${blockchainApiBaseUrl.value}/medical-records`,
      medicalData
    )
    
    console.log('Blockchain API response:', response.data)
    return response.data
  } catch (error) {
    console.error('Blockchain API error details:', error.response || error)
    
    // Extract the most useful error message
    let errorMessage = 'Error connecting to blockchain service'
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || error.response.data.message || errorMessage
    }
    
    throw new Error(errorMessage)
  }
}

// Update existing medical record
const updateMedicalRecord = async (medicalData) => {
  try {
    console.log('Updating blockchain record:', `${blockchainApiBaseUrl.value}/medical-records/${medicalData.patientId}`)
    console.log('Data being sent:', medicalData)
    
    // When updating, ensure ID field matches what's expected by API
    // Some APIs expect ID, some expect id, some expect patientId
    const dataToSend = {
      ...medicalData,
      ID: medicalData.patientId, // Add this in case API expects capitalized ID
      id: medicalData.patientId // Add this in case API expects lowercase id
    }
    
    const response = await axios.put(
      `${blockchainApiBaseUrl.value}/medical-records/${medicalData.patientId}`,
      dataToSend
    )
    
    console.log('Blockchain API update response:', response.data)
    return response.data
  } catch (error) {
    console.error('Blockchain API update error details:', error.response || error)
    
    // Extract the most useful error message
    let errorMessage = 'Error connecting to blockchain service'
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || error.response.data.message || errorMessage
    }
    
    throw new Error(errorMessage)
  }
}

// Save symptoms to main database - checking if API endpoint exists
const saveSymptoms = async (symptomData) => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Authentication token not found')
    }
    
    // Check if endpoint exists in the API (can be disabled if not needed)
    const response = await axios.post(
      `${mainApiBaseUrl.value}/symptoms`,
      symptomData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.data
  } catch (error) {
    console.error('Error saving symptoms:', error)
    // We'll treat this as non-critical, so just throw the error but let the main process continue
    throw error
  }
}

// Submit form data to both backends
const saveInformation = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form', {
      position: "top-right",
      autoClose: 3000
    })
    return
  }
  
  const token = localStorage.getItem('authToken')
  if (!token) {
    toast.error('You need to be logged in to save information. Please log in and try again.', {
      position: "top-right",
      autoClose: 3000
    })
    return
  }
  
  const userId = getUserId()
  if (!userId) {
    toast.error('Unable to determine your user ID. Please try logging in again.', {
      position: "top-right",
      autoClose: 3000
    })
    return
  }
  
  isSubmitting.value = true
  
  try {
    // PART 1: Save medical condition and background to your backend first
    try {
      console.log('Saving medical condition and background to database')
      
      const medicalInfoData = {
        medicalCondition: formData.value.medicalCondition,
        medicalBackground: formData.value.medicalBackground,
        shareData: formData.value.shareData
      }
      
      const medicalInfoResponse = await axios.post(
        `${mainApiBaseUrl.value}/medical-info`,
        medicalInfoData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log('Medical info saved to database:', medicalInfoResponse.data)
    } catch (error) {
      console.error('Error saving medical info to database:', error)
      // This is non-critical - continue with blockchain save
      toast.warning('Could not save detailed medical information to our database', {
        position: "top-right",
        autoClose: 3000
      })
    }
    
    // PART 2: Save basic medical data to blockchain
    // Check if user already has a blockchain ID
    let blockchainId = null
    if (userData.value) {
      blockchainId = userData.value.userIdOnBlockchain || 
                     userData.value.useridOnBlockchain || 
                     userData.value.userIDOnBlockchain ||
                     userData.value.useridonblockchain
    }
    
    // If no blockchain ID exists, generate one
    if (!blockchainId) {
      blockchainId = `${userId}-${Date.now()}`
    }
    
    // For an existing record, check if we need to use ID instead of patientId
    // based on what's in the existing data
    const idFieldName = existingMedicalData.value && 
                        existingMedicalData.value.ID !== undefined ? 'ID' : 'patientId'
    
    // Prepare data for blockchain API - only include basic health metrics
    const medicalData = {
      [idFieldName]: blockchainId,
      patientId: blockchainId, // Include both to be safe
      ID: blockchainId, // Include both to be safe
      name: formData.value.fullName,
      Name: formData.value.fullName, // Include capitalized version
      bloodPressure: formData.value.bloodPressure,
      BloodPressure: formData.value.bloodPressure, // Include capitalized version
      bloodSugar: formData.value.bloodSugar,
      BloodSugar: formData.value.bloodSugar, // Include capitalized version
      SugarLevel: formData.value.bloodSugar, // Include the alternative name
      age: Number(formData.value.age),
      Age: Number(formData.value.age), // Include capitalized version
      weight: formData.value.weight,
      Weight: formData.value.weight, // Include capitalized version
      height: formData.value.height,
      Height: formData.value.height // Include capitalized version
    }
    
    if (isEditing.value && existingMedicalData.value) {
      // Updating existing record
      toast.info('Updating your medical information...', {
        position: "top-right",
        autoClose: 2000
      })
      
      try {
        await updateMedicalRecord(medicalData)
        console.log('Medical record updated successfully')
      } catch (error) {
        console.error('Error updating medical record:', error)
        toast.error(`Error updating medical information: ${error.message || 'Unknown error'}`, {
          position: "top-right",
          autoClose: 5000
        })
        isSubmitting.value = false
        return
      }
    } else {
      // Creating new record
      toast.info('Saving to secure blockchain...', {
        position: "top-right",
        autoClose: 2000
      })
      
      try {
        const blockchainResult = await saveToBlockchain(medicalData)
        console.log('Blockchain save result:', blockchainResult)
      } catch (error) {
        console.error('Error saving to blockchain:', error)
        toast.error(`Error saving to blockchain: ${error.message || 'Unknown error'}`, {
          position: "top-right",
          autoClose: 5000
        })
        isSubmitting.value = false
        return
      }
      
      // Update user's blockchain ID in main database if needed
      if (!userData.value?.userIdOnBlockchain && !userData.value?.useridonblockchain) {
        toast.info('Updating your profile...', {
          position: "top-right",
          autoClose: 2000
        })
        
        try {
          await updateBlockchainId(blockchainId)
        } catch (error) {
          console.error('Error updating blockchain ID:', error)
          toast.warning("Your data was saved to blockchain but we couldn't update your profile. You can try again later.", {
            position: "top-right",
            autoClose: 5000
          })
        }
      }
    }
    
    // We don't need to save symptoms separately anymore, as we're saving 
    // medical condition and background directly to our database via the medical-info endpoint
    
    // All operations successful
    const successMessage = isEditing.value 
      ? 'Medical information updated successfully!' 
      : 'Medical information saved successfully and securely stored on blockchain!';
    
    toast.success(successMessage, {
      position: "top-right",
      autoClose: 5000
    })
    
    // Refresh data
    await fetchUserData()
    await fetchExistingMedicalData()
  } catch (error) {
    console.error('Error in save process:', error)
    toast.error(`Error: ${error.message || 'Failed to save medical information'}`, {
      position: "top-right",
      autoClose: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

// Optional: Reset form function
const resetForm = () => {
  formData.value = {
    fullName: '',
    bloodPressure: '',
    age: '',
    bloodSugar: '',
    medicalCondition: '',
    medicalBackground: '',
    shareData: false,
    weight: 70,
    height: 170
  }
  validationErrors.value = {}
  isEditing.value = false
  existingMedicalData.value = null
}
</script>

<style>
/* All your existing CSS styles */
.slide-in-from-top {
    animation: slideFromTop 0.6s ease-out forwards;
}

.slide-in-left {
    animation: slideFromLeft 0.6s ease-out forwards;
}

.slide-in-right {
    animation: slideFromRight 0.6s ease-out forwards;
}

.fade-in {
    opacity: 0;
    animation: fadeIn 0.8s ease forwards;
}

.fade-in-up {
    opacity: 0;
    animation: fadeInUp 0.8s ease forwards;
}

.animate-entry {
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards;
}

/* Status message styles */
.status-message {
    margin: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    font-weight: 500;
    animation: fadeIn 0.3s ease;
}

.status-message.success {
    background-color: rgba(52, 211, 153, 0.2);
    color: #10b981;
    border: 1px solid #10b981;
}

.status-message.error {
    background-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid #ef4444;
}

/* Error styling for form fields */
.error-input {
    border-color: #ef4444 !important;
}

.error-text {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

/* Data loading indicator */
.data-loading-indicator {
    margin: 1rem auto;
    padding: 0.5rem 1rem;
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid #3b82f6;
    border-radius: 0.5rem;
    text-align: center;
    font-weight: 500;
}

/* Button disabled state */
button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
}

/* Staggered animations for form elements */
.third-inner-first { animation-delay: 0.2s; }
.third-inner-second { animation-delay: 0.3s; }
.third-inner-right-first { animation-delay: 0.4s; }
.third-inner-right-second { animation-delay: 0.5s; }
.four-first { animation-delay: 0.6s; }
.four-Second { animation-delay: 0.7s; }
.four-third { animation-delay: 0.8s; }
.four-four { animation-delay: 0.9s; }

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

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Input and Button hover animations */
input, textarea {
    transition: border-color 0.3s ease, transform 0.2s ease;
}

input:focus, textarea:focus {
    transform: translateY(-1px);
    border-color: var(--accent-color) !important;
}

button {
    transition: transform 0.2s ease, background-color 0.3s ease;
}

button:hover:not(:disabled) {
    transform: translateY(-2px);
    background-color: var(--accent-color) !important;
}
.data-first-div{
    width: 100%;
    height: 90vh;
    background-color: var(--main-bg);
    color:var(--text-primary) ;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h1{
        font-size: 24px;
        font-family: 'Poppins', sans-serif;
        font-size: var(font-size-base);
        margin-bottom: 0.5rem;
        margin-left: 0.9rem;
    }
   
}
.data-sec-div{
    width: 97%;
    height: 92%;
    background-color: var(--secondary-bg);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-left: 0.9rem;
}
.data-third-div{
    width: 100%;
    height: 35%;
    background-color: var(--secondary-bg);
    display: flex;
}
.data-four-div{
    width: 100%;
    height: 60%;
    background-color: var(--secondary-bg);
}
.third-inner{
    width: 50%;
    height: 100%;
    background-color: var(--secondary-bg);
}
.third-inner-right{
    width: 50%;
    height: 100%;
    background-color: var(--secondary-bg);
}
.third-inner-first{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    color: var(--text-primary);
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    input{
        width: 90%;
        border: 0rem;
        border: none;
        height: 1.3rem;
        border-bottom: 1px solid var(--border-color);
        transform: translateY(5px);
        padding-left: 0.5rem;
        border-radius: 0.2rem;
        background-color: var(--secondary-bg);
        color: var(--text-primary);
    }
}
.third-inner-second{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    color:var(--text-primary) ;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    input{
        width: 90%;
        background-color: var(--secondary-bg);
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;
        color: var(--text-primary);
    }
}
.third-inner-right-first{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    color:var(--text-primary) ;
    p{
        margin-bottom: 0.5rem;
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    input{
        width: 90%;
        background-color: var(--secondary-bg);
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;
        color: var(--text-primary);
    }
}
.third-inner-right-second{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    color:var(--text-primary) ;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    input{
        width: 90%;
        border: 0rem;
        background-color: var(--secondary-bg);
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;
        color: var(--text-primary);
    }
}
.four-first{
    width: 100%;
    height: 7rem;
    background-color: var(--secondary-bg);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color:var(--text-primary) ;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    textarea{
        padding-left: 0.5rem;
        height: 5rem;
        background-color: var(--secondary-bg);
        width: 99%;
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        border-radius: 0.5rem;
        color: var(--text-primary);
    }
}
.four-Second{
    width: 100%;
    height: 7rem;
    background-color: var(--secondary-bg);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color:var(--text-primary) ;
    justify-content: center;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    textarea{
        padding-left: 0.5rem;
        height: 5rem;
        width: 99%;
        background-color: var(--secondary-bg);
        border: 2rem solid black;
        border: none;
        border-bottom: 1px solid var(--border-color);
        border-radius: 0.5rem;
        color: var(--text-primary);
    }
}
.four-third{
   display: flex;
   align-items: flex-start;

   padding: 1rem;
   background-color: var(--secondary-bg);
   color:var(--text-primary) ;
   align-content: center;
   
    p{
        justify-content: center;
        margin: 1rem;
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
        align-items: center;
    }
    .switch {
        align-items: center;
        position: relative;
        display: inline-block;
        width: 4rem;
        height: 2rem;
        margin-top: 0.5rem;
      }
    
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--main-bg);
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: #FEFEFE;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: var(--accent-color);
      }
      
      input:focus + .slider {
        box-shadow: var(--accent-color);
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }
}
.four-four{
    background-color: var(--secondary-bg);
    color:var(--text-primary) ;
    button{
        width: 97%;
        height: 2.5rem;
        margin: 1rem;
        border-radius: 0.5rem;
        background-color: var(--accent-color);
        color:white;
        border: 1px solid transparent;
        cursor: pointer;
    }
}
@media screen and (max-width: 1024px) {
    .data-first-div h1 {
        margin-left: 0;
        text-align: center;
    }
    
    .data-sec-div {
        width: 95%;
        height: auto;
    }
}
@media screen and (max-width: 768px) {
    .data-first-div {
        h1{
            margin-bottom: 0.5rem;
            margin-left: 1rem;
            font-size: 24px;
        }
        height: auto;
        padding-left: 0.2rem;
    }
    
    .data-sec-div{
        width: 99%;
        margin-left: 0;
        
    }

    .data-third-div {
        flex-direction: column;
        height: auto;
    }
    
    .third-inner,
    .third-inner-right {
        width: 100%;
    }
    
    .third-inner-first,
    .third-inner-second,
    .third-inner-right-first,
    .third-inner-right-second {
        p{
            margin-left: 0;
        }
        input {
            width: 100%;
        }
    }
    
    .four-first,
    .four-Second {
        p{
            margin-left: 0;
        }
        height: auto;
        textarea {
            width: 100%;
            min-height: 6rem;
        }
    }

    .four-four{
        margin-right: 1rem;
        margin-bottom: 2rem;
    }

    .data-loading-indicator {
        margin: 0.5rem;
        width: 90%;
    }

    .status-message {
        margin: 0.5rem;
        padding: 0.5rem;
    }
}
</style>