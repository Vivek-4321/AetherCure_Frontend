<template>
  <div class="file-viewer-container">
    <!-- Header with controls -->
    <div class="viewer-header">
      <div class="file-info">
        <h1>{{ fileName }}</h1>
        <p v-if="fileType">{{ formatFileType(fileType) }}</p>
      </div>
      <div class="viewer-controls">
        <button @click="goBack" class="control-btn back-btn">
          <Icon icon="hugeicons:arrow-left" />
          Back
        </button>
        <!-- <button @click="downloadFile" class="control-btn download-btn">
          <Icon icon="hugeicons:download-01" />
          Download
        </button> -->
      </div>
    </div>

    <!-- Main content area -->
    <div class="viewer-content" :class="{ 'loading': isLoading, 'error': hasError }">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading file...</p>
        <p v-if="loadingTooLong" class="timeout-message">
          Loading is taking longer than expected. 
          <button @click="retryLoading" class="retry-btn">Try Again</button>
        </p>
      </div>

      <!-- Error state -->
      <div v-else-if="hasError" class="error-container">
        <Icon icon="hugeicons:alert-circle" class="error-icon" />
        <h2>{{ errorMessage }}</h2>
        <p>There was a problem loading this file.</p>
        <div class="error-actions">
          <button @click="retryLoading" class="retry-btn">Try Again</button>
          <button @click="downloadFile" class="download-anyway-btn">
            Download File
          </button>
          <button v-if="isImage" @click="openInNewTab" class="open-tab-btn">
            Open in New Tab
          </button>
        </div>
      </div>

      <!-- Image viewer -->
      <div v-else-if="isImage" class="image-viewer">
        <!-- Use a direct link for images with crossorigin attribute -->
        <img 
          :src="fileUrl" 
          :alt="fileName" 
          @load="handleFileLoaded" 
          @error="handleImageError" 
          ref="imageRef"
          crossorigin="anonymous"
        />
        
        <!-- Image controls -->
        <div class="image-controls" v-if="!isLoading">
          <button @click="zoomIn" class="zoom-btn">
            <Icon icon="hugeicons:zoom-in-area" />
          </button>
          <button @click="zoomOut" class="zoom-btn">
            <Icon icon="hugeicons:zoom-out-area" />
          </button>
          <button @click="resetZoom" class="zoom-btn">
            <Icon icon="hugeicons:arrow-turn-backward" />
          </button>
        </div>
      </div>

      <!-- PDF viewer - Direct embed with object tag -->
      <div v-else-if="isPdf" class="pdf-viewer">
        <!-- First, try with object tag which works better for PDFs -->
        <object 
          v-if="!useIframeForPdf"
          :data="fileUrl" 
          type="application/pdf"
          width="100%" 
          height="100%"
          @load="handleFileLoaded"
          @error="fallbackToIframe"
          ref="pdfObject"
        >
          <p>Your browser does not support PDF viewing. 
            <button @click="downloadFile" class="text-btn">Download the PDF</button> instead.
          </p>
        </object>
        
        <!-- Fallback to iframe if object tag fails -->
        <iframe 
          v-else
          :src="fileUrl" 
          frameborder="0" 
          width="100%" 
          height="100%"
          @load="handleFileLoaded"
          @error="handleFileError"
        ></iframe>
      </div>

      <!-- Unsupported file type -->
      <div v-else class="unsupported-container">
        <Icon icon="hugeicons:file-01" class="file-icon" />
        <h2>Unsupported File Type</h2>
        <p>This file type ({{ fileType || 'unknown' }}) cannot be previewed in the browser.</p>
        <button @click="downloadFile" class="download-btn">
          <Icon icon="hugeicons:download-01" />
          Download Instead
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const route = useRoute();
const router = useRouter();

// State
const fileUrl = ref('');
const fileName = ref('');
const fileType = ref('');
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const zoomLevel = ref(1);
const imageRef = ref(null);
const pdfObject = ref(null);
const useIframeForPdf = ref(false);
const loadingStartTime = ref(null);
const loadingTooLong = ref(false);
const loadingTimeoutId = ref(null);
const retryCount = ref(0);

// Computed properties
const isImage = computed(() => {
  const type = fileType.value?.toLowerCase() || '';
  return type.includes('image/') || 
         type.includes('jpeg') || 
         type.includes('jpg') || 
         type.includes('png') || 
         type.includes('gif') || 
         type.includes('webp');
});

const isPdf = computed(() => {
  const type = fileType.value?.toLowerCase() || '';
  return type.includes('pdf') || 
         type.includes('application/pdf');
});

// Functions
const loadFile = async () => {
  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';
  loadingStartTime.value = Date.now();
  loadingTooLong.value = false;
  useIframeForPdf.value = false;
  
  // Clear any existing timeout
  if (loadingTimeoutId.value) {
    clearTimeout(loadingTimeoutId.value);
  }
  
  // Set a timeout to show the "loading too long" message after 5 seconds
  loadingTimeoutId.value = setTimeout(() => {
    if (isLoading.value) {
      loadingTooLong.value = true;
    }
  }, 5000);

  try {
    const { ipfsHash, fileType: type, fileName: name } = route.params;
    
    if (!ipfsHash) {
      throw new Error('Missing file hash');
    }

    // Gateway URLs to try in order - expanded list with direct proxies
    const gateways = [
      import.meta.env.VITE_PINATA_GATEWAY_URL || "https://gateway.pinata.cloud",
      "https://cloudflare-ipfs.com",
      "https://ipfs.io",
      "https://dweb.link",
      "https://gateway.ipfs.io"
    ];
    
    // Use the current gateway based on retry count
    const gatewayIndex = Math.min(retryCount.value, gateways.length - 1);
    const currentGateway = gateways[gatewayIndex];
    
    fileUrl.value = `${currentGateway}/ipfs/${ipfsHash}`;
    fileType.value = type || '';
    fileName.value = decodeURIComponent(name || 'File');

    console.log(`Loading file (attempt ${retryCount.value + 1}):`, {
      url: fileUrl.value,
      type: fileType.value,
      name: fileName.value,
      gateway: currentGateway
    });
    
    // Check if the file is accessible from the current gateway
    try {
      console.log(`Testing accessibility of ${fileUrl.value}`);
      const fetchOptions = {
        method: 'HEAD',
        mode: 'cors',
        cache: 'no-cache'
      };
      
      const response = await fetch(fileUrl.value, fetchOptions);
      
      if (!response.ok) {
        console.warn(`File not accessible from ${currentGateway}, status: ${response.status}`);
        
        // If we've tried all gateways, show error
        if (gatewayIndex >= gateways.length - 1) {
          throw new Error('File could not be accessed from any gateway');
        } else {
          // Try next gateway
          retryCount.value++;
          loadFile();
          return;
        }
      } else {
        console.log(`File is accessible from ${currentGateway}`);
      }
    } catch (fetchError) {
      console.warn('Error checking file accessibility:', fetchError);
      // For CORS errors or network issues, try the next gateway
      if (gatewayIndex < gateways.length - 1) {
        retryCount.value++;
        loadFile();
        return;
      }
      // Otherwise, continue and let the browser try to load it directly
    }
    
    // For images, also directly try to preload
    if (isImage.value) {
      // Set a timeout for image loading - shorter than the PDF timeout
      setTimeout(() => {
        if (isLoading.value) {
          // If still loading after 10 seconds, likely there's an issue
          // Try to directly download using window.open as fallback
          window.open(fileUrl.value, '_blank');
          handleFileLoaded();
        }
      }, 10000);
    }
    // For non-images, add a safety timeout
    else if (!isImage.value) {
      setTimeout(() => {
        if (isLoading.value) {
          if (isPdf.value && !useIframeForPdf.value) {
            // Try iframe as fallback for PDF
            fallbackToIframe();
          } else {
            // If still loading after 30 seconds, show error
            handleFileError(new Error('File loading timeout'));
          }
        }
      }, 30000);
    }
  } catch (error) {
    console.error('Error setting up file:', error);
    hasError.value = true;
    errorMessage.value = error.message || 'Failed to load file';
    isLoading.value = false;
    
    // Clear any timeout
    if (loadingTimeoutId.value) {
      clearTimeout(loadingTimeoutId.value);
      loadingTimeoutId.value = null;
    }
  }
};

const handleFileLoaded = () => {
  console.log('File loaded successfully');
  isLoading.value = false;
  loadingTooLong.value = false;
  
  // Clear the timeout
  if (loadingTimeoutId.value) {
    clearTimeout(loadingTimeoutId.value);
    loadingTimeoutId.value = null;
  }
};

const handleFileError = (error) => {
  console.error('Error loading file content:', error);
  
  // If we have retries left, try the next gateway
  const maxGateways = 3; // Number of gateway options
  if (retryCount.value < maxGateways - 1) {
    retryCount.value++;
    loadFile();
    return;
  }
  
  // Otherwise show error
  hasError.value = true;
  errorMessage.value = error.message || 'Failed to load file content';
  isLoading.value = false;
  
  // Clear the timeout
  if (loadingTimeoutId.value) {
    clearTimeout(loadingTimeoutId.value);
    loadingTimeoutId.value = null;
  }
};

// Specific handler for image errors to provide better diagnostics
const handleImageError = (error) => {
  console.error('Error loading image:', error);
  
  // Try to diagnose the specific issue with the image
  const img = new Image();
  img.onload = () => {
    console.log('Image loaded in diagnostic test, but failed in display');
    // This means the image is accessible but something else is wrong with rendering
    // Try direct display with window.open as a fallback
    window.open(fileUrl.value, '_blank');
    handleFileLoaded();
  };
  
  img.onerror = () => {
    console.error('Image failed to load in diagnostic test');
    // If we have retries left, try the next gateway
    const maxGateways = 3;
    if (retryCount.value < maxGateways - 1) {
      retryCount.value++;
      loadFile();
    } else {
      // Try with a different approach - append a cache buster to the URL
      const cacheBuster = `?t=${Date.now()}`;
      const urlWithCacheBuster = `${fileUrl.value}${cacheBuster}`;
      
      // Update the fileUrl and try one more time
      fileUrl.value = urlWithCacheBuster;
      
      // If that still fails after a reasonable timeout, show the error
      setTimeout(() => {
        if (isLoading.value) {
          hasError.value = true;
          errorMessage.value = 'Unable to load the image. You can try downloading it instead.';
          isLoading.value = false;
        }
      }, 5000);
    }
  };
  
  // Start the diagnostic test
  img.crossOrigin = 'anonymous';
  img.src = fileUrl.value;
};

const fallbackToIframe = () => {
  console.log('PDF object failed to load, falling back to iframe');
  useIframeForPdf.value = true;
  
  // Add a reasonable delay to prevent immediate error
  setTimeout(() => {
    if (isLoading.value) {
      handleFileLoaded();
    }
  }, 2000);
};

const formatFileType = (type) => {
  if (!type) return 'Unknown type';
  
  if (type.includes('pdf')) return 'PDF Document';
  if (type.includes('image/jpeg') || type.includes('jpg')) return 'JPEG Image';
  if (type.includes('image/png')) return 'PNG Image';
  if (type.includes('image/gif')) return 'GIF Image';
  
  return type;
};

const goBack = () => {
  router.back();
};

const downloadFile = () => {
  if (!fileUrl.value) return;
  
  // Create a temporary link element for downloading
  const link = document.createElement('a');
  link.href = fileUrl.value;
  link.setAttribute('download', fileName.value);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success('Downloading file...', {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    theme: 'colored'
  });
};

const retryLoading = () => {
  retryCount.value = 0; // Reset retry count to start over
  loadFile();
};

// Image zoom controls
const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.1, 3);
  applyZoom();
};

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5);
  applyZoom();
};

const resetZoom = () => {
  zoomLevel.value = 1;
  applyZoom();
};

const applyZoom = () => {
  if (imageRef.value) {
    imageRef.value.style.transform = `scale(${zoomLevel.value})`;
  }
};

// Watch for route changes to reload file if needed
watch(() => route.params, () => {
  retryCount.value = 0; // Reset retry count on new file
  loadFile();
}, { deep: true });

// Clean up on unmount
onUnmounted(() => {
  if (loadingTimeoutId.value) {
    clearTimeout(loadingTimeoutId.value);
  }
});

// Direct fallback function for emergency viewing
const openInNewTab = () => {
  if (fileUrl.value) {
    window.open(fileUrl.value, '_blank');
    handleFileLoaded();
    toast.info('Opening file in a new tab', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      theme: 'colored'
    });
  }
};

// Initialize
onMounted(() => {
  // Add global error handler for images on the window
  window.addEventListener('error', (event) => {
    if (event.target.tagName === 'IMG' && isImage.value && isLoading.value) {
      console.warn('Global image error caught:', event);
      handleImageError(new Error('Image failed to load'));
      event.preventDefault();
    }
  }, true);
  
  loadFile();
});
</script>

<style scoped>
.file-viewer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--main-bg);
  color: var(--text-primary);
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--secondary-bg);
  border-bottom: 1px solid var(--border-color);
}

.file-info h1 {
  font-size: 1.5rem;
  margin: 0;
  word-break: break-word;
}

.file-info p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.viewer-controls {
  display: flex;
  gap: 1rem;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-btn {
  background-color: var(--main-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.back-btn:hover {
  background-color: var(--border-color);
}

.download-btn {
  background-color: var(--accent-color);
  color: white;
}

.download-btn:hover {
  background-color: var(--hover-accent);
}

.viewer-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  position: relative;
  padding: 1rem;
}

.loading-container,
.error-container,
.unsupported-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--secondary-bg);
  color: var(--text-primary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--accent-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.timeout-message {
  margin-top: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  background-color: rgba(var(--secondary-bg-rgb, 255, 255, 255), 0.7);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.error-icon,
.file-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.error-container h2,
.unsupported-container h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.error-container p,
.unsupported-container p {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.retry-btn {
  padding: 0.5rem 1rem;
  background-color: var(--main-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background-color: var(--border-color);
}

.download-anyway-btn {
  padding: 0.5rem 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
}

.download-anyway-btn:hover {
  background-color: var(--hover-accent);
}

.image-viewer {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer img {
  max-width: 100%;
  max-height: calc(100vh - 200px);
  object-fit: contain;
  transition: transform 0.2s ease;
}

.image-controls {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  background-color: rgba(var(--secondary-bg-rgb, 255, 255, 255), 0.8);
  padding: 0.5rem;
  border-radius: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.zoom-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background-color: var(--main-bg);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-btn:hover {
  background-color: var(--border-color);
}

.pdf-viewer {
  width: 100%;
  height: 100%;
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

/* Responsive styles */
@media (max-width: 768px) {
  .viewer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  
  .viewer-controls {
    width: 100%;
  }
  
  .control-btn {
    flex: 1;
    justify-content: center;
  }
  
  .file-info h1 {
    font-size: 1.2rem;
  }
}
</style>