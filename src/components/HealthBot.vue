<template>
    <div class="bot-main">
      <!-- Model and Settings Selector -->
      <div class="controls-container">
        <div class="model-selector">
          <button 
            v-for="model in models" 
            :key="model.id"
            :class="['model-btn', selectedModel === model.id ? 'active' : '']"
            @click="selectedModel = model.id"
          >
            {{ model.name }}
          </button>
        </div>
        
        <div class="settings">
          <label class="setting-option">
            <span class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="streamEnabled"
              />
              <span class="toggle-slider"></span>
            </span>
            <span class="toggle-label">Stream Response</span>
          </label>
        </div>
      </div>
  
      <!-- Main Chat Container -->
      <div class="bot-main-container">
        <div class="bot-main-sub">
          <div id="messages" class="messages-container custom-scrollbar">
            <div v-for="(message, index) in messages" 
                 :key="index" 
                 :class="['message', message.isUser ? 'user-message' : 'bot-message']">
              <!-- Text Content -->
              <p v-html="message.content"></p>
              
              <!-- Image Preview if present -->
              <img 
                v-if="message.imageUrl" 
                :src="message.imageUrl" 
                class="message-image"
                @click="openImagePreview(message.imageUrl)"
              />
              
              <!-- Generated Image if present -->
              <img 
                v-if="message.generatedImage" 
                :src="message.generatedImage" 
                class="generated-image"
                @click="openImagePreview(message.generatedImage)"
              />
            </div>
            
            <!-- Enhanced Loading Animation -->
            <div v-if="isLoading" class="loading-container">
              <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
              </div>
              <span class="loading-text">Processing...</span>
            </div>
          </div>
          
          <!-- Input Area -->
          <div class="input-bar-main">
            <div class="input-bar-main-sub">
              <!-- File Input -->
              <div class="file-input-container">
                <label for="file-input" class="file-input-label">
                  <Icon icon="material-symbols:upload-file" class="icon" />
                </label>
                <input 
                  id="file-input"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
              </div>
              
              <!-- Message Input -->
              <div class="input-bar-msge">
                <textarea 
                  v-model="inputMessage" 
                  placeholder="Type a message or use :generate/:analyze for specific tasks..."
                  @keyup.enter.exact="sendMessage"
                  :disabled="isLoading"
                  rows="1"
                  ref="messageInput"
                ></textarea>
              </div>
              
              <!-- Send Button -->
              <div class="input-bar-sent">
                <button @click="sendMessage" :disabled="isLoading || !canSend">
                  <Icon icon="fluent:send-24-filled" class="icon" />
                </button>
              </div>
            </div>
            
            <!-- Selected Image Preview -->
            <div v-if="selectedFile" class="selected-file-preview">
              <img :src="selectedFilePreview" class="preview-image" />
              <button @click="clearSelectedFile" class="clear-file-btn">
                <Icon icon="material-symbols:close" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Image Preview Modal -->
      <div v-if="previewImage" class="image-preview-modal" @click="closeImagePreview">
        <img :src="previewImage" class="preview-modal-image" />
        <button class="close-preview-btn">
          <Icon icon="material-symbols:close" />
        </button>
      </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from "@iconify/vue"

const models = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'gpt-4o', name: 'GPT-4o' }
]

const messages = ref([
  { content: "Hello! Use :generate to create images or :analyze to analyze images!", isUser: false }
])

const selectedModel = ref('claude-3-5-sonnet')
const streamEnabled = ref(true)
const inputMessage = ref('')
const isLoading = ref(false)
const selectedFile = ref(null)
const selectedFilePreview = ref('')
const previewImage = ref(null)
const messageInput = ref(null)

const canSend = computed(() => {
  return inputMessage.value.trim() || selectedFile.value
})

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
    // Create a URL for the file
    selectedFilePreview.value = URL.createObjectURL(file)
    
    // Convert the file to base64 for analysis
    const reader = new FileReader()
    reader.onloadend = () => {
      selectedFilePreview.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}


const clearSelectedFile = () => {
  selectedFile.value = null
  selectedFilePreview.value = ''
}

const openImagePreview = (imageUrl) => {
  previewImage.value = imageUrl
}

const closeImagePreview = () => {
  previewImage.value = null
}

const appendStreamPart = (text) => {
  const lastMessage = messages.value[messages.value.length - 1]
  if (!lastMessage.isUser) {
    lastMessage.content += text?.replaceAll('\n', '<br>')
  } else {
    messages.value.push({
      content: text?.replaceAll('\n', '<br>'),
      isUser: false
    })
  }
}

const sendMessage = async () => {
  if ((!inputMessage.value.trim() && !selectedFile.value) || isLoading.value) return

  const messageContent = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true

  // Add user message with image if present
  messages.value.push({
    content: messageContent,
    isUser: true,
    imageUrl: selectedFilePreview.value
  })

  try {
    let response
    
    if (selectedFile.value) {
      // Handle image analysis
      response = await puter.ai.chat(
        messageContent || "What do you see in this image?",
        selectedFilePreview.value,
        { 
          model: selectedModel.value,
          stream: streamEnabled.value
        }
      )
    } else if (messageContent.toLowerCase().startsWith(':generate')) {
      // Handle image generation
      const imageElement = await puter.ai.txt2img(messageContent.slice(9))
      messages.value.push({
        content: "Here's your generated image:",
        isUser: false,
        generatedImage: imageElement.src
      })
      return
    } else {
      // Handle text generation
      response = await puter.ai.chat(
        messageContent,
        { 
          model: selectedModel.value,
          stream: streamEnabled.value
        }
      )
    }

    // Handle streaming response
    if (streamEnabled.value) {
      messages.value.push({ content: '', isUser: false })
      for await (const part of response) {
        appendStreamPart(part?.text)
      }
    } else {
      messages.value.push({
        content: response.message.content[0].text,
        isUser: false
      })
    }
  } catch (error) {
    console.error('AI response error:', error)
    messages.value.push({
      content: "Sorry, I couldn't process that request. Please try again.",
      isUser: false
    })
  } finally {
    isLoading.value = false
    clearSelectedFile()
  }
}
</script>
<style scoped>
/* Base Layout */
.bot-main {
  width: 100%;
  height: 90vh;
  background-color: var(--main-bg);
  color: var(--text-primary);
  padding: 1rem;
  box-sizing: border-box;
}

/* Controls Section */
.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: var(--secondary-bg);
  border-radius: 0.5rem;
  min-height: 60px;
}

.model-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.model-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: var(--main-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.model-btn.active {
  background-color: var(--accent-color);
  color: var(--common-white);
}

/* Messages Container */
.messages-container {
  height: calc(100vh - 250px);
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  padding: 1rem;
  border-radius: 0.5rem;
  max-width: 70%;
  word-break: break-word;
  animation: fadeIn 0.3s ease-in-out;
}

.bot-message {
  background-color: var(--secondary-bg);
  align-self: flex-start;
}

.user-message {
  background-color: var(--accent-color);
  color: var(--common-white);
  align-self: flex-end;
}

/* Input Bar */
.input-bar-main {
  background-color: var(--secondary-bg);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-bar-main-sub {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* File Input */
.file-input-container {
  position: relative;
}

.file-input-label {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-bg);
  border-radius: 0.5rem;
  cursor: pointer;
}

.hidden {
  display: none;
}

/* Text Input */
.input-bar-msge {
  flex-grow: 1;
}

textarea {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  resize: none;
  overflow-y: auto;
  line-height: 1.5;
  max-height: 100px;
  background-color: var(--main-bg);
  color: var(--text-primary);
}

/* Send Button */
.input-bar-sent button {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: var(--accent-color);
  color: var(--common-white);
  border: none;
  cursor: pointer;
}

.input-bar-sent button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Image Handling */
.selected-file-preview {
  margin-top: 0.5rem;
  position: relative;
  display: inline-block;
}

.preview-image {
  max-height: 100px;
  border-radius: 0.5rem;
}

.message-image,
.generated-image {
  max-width: 300px;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
}

/* Image Preview Modal */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-modal-image {
  max-width: 90%;
  max-height: 90vh;
}

/* Loading Animation */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.loading-spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  animation-delay: -0.6s;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--main-bg);
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: var(--text-primary);
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--accent-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.toggle-label {
  margin-left: 10px;
  color: var(--text-primary);
}

/* Custom Scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) var(--secondary-bg);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--secondary-bg);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media screen and (max-width: 600px) {
  .bot-main {
    padding: 0.5rem;
  }

  .message {
    max-width: 85%;
  }

  .model-selector {
    flex-wrap: wrap;
  }
}
</style>