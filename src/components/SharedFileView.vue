<template>
    <div class="shared-file-container">
      <div class="shared-file-card">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading shared file...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <Icon icon="hugeicons:alert-circle" class="error-icon" />
          <h2>{{ error }}</h2>
          <p v-if="error.includes('expired')">
            This shared file has expired or is no longer available.
          </p>
          <button @click="goHome" class="action-btn">Go Home</button>
        </div>
        
        <div v-else-if="fileData" class="file-details">
          <div class="file-header">
            <h2>Shared Medical Document</h2>
            <div class="expiry-badge">
              <Icon icon="hugeicons:clock-01" class="expiry-icon" />
              <span>Expires {{ formatTimeRemaining() }}</span>
            </div>
          </div>
          
          <div class="file-info">
            <div class="file-info-row">
              <span class="label">Filename:</span>
              <span class="value">{{ fileData.fileName }}</span>
            </div>
            
            <div class="file-info-row">
              <span class="label">File Type:</span>
              <span class="value">{{ formatFileType(fileData.fileType) }}</span>
            </div>
            
            <div class="file-info-row">
              <span class="label">Shared On:</span>
              <span class="value">{{ formatDate(fileData.createdAt) }}</span>
            </div>
            
            <div class="file-info-row">
              <span class="label">Expires On:</span>
              <span class="value">{{ formatDate(fileData.expirationTime * 1000) }}</span>
            </div>
          </div>
          
          <div class="file-actions">
            <button @click="viewFile" class="primary-button">
              <Icon icon="hugeicons:eye-01" class="button-icon" />
              View Document
            </button>
            
            <!-- <button @click="downloadFile" class="secondary-button">
              <Icon icon="hugeicons:download-01" class="button-icon" />
              Download
            </button> -->
          </div>
          
          <div class="disclaimer">
            <p>
              This is a temporary link to a secure medical document. 
              It will expire on {{ formatDate(fileData.expirationTime * 1000) }}.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Icon } from '@iconify/vue';
  import { fileAPI } from './fileApi.js';
  
  const route = useRoute();
  const router = useRouter();
  const loading = ref(true);
  const error = ref(null);
  const fileData = ref(null);
  
  // Constants for Pinata Gateway
  const PINATA_GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY_URL || "https://gateway.pinata.cloud";
  
  // Format functions
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const formatFileType = (type) => {
    if (!type) return 'Unknown';
    
    if (type.includes('pdf')) return 'PDF Document';
    if (type.includes('image/jpeg')) return 'JPEG Image';
    if (type.includes('image/png')) return 'PNG Image';
    
    return type;
  };
  
  const formatTimeRemaining = () => {
    if (!fileData.value) return '';
    
    const now = Math.floor(Date.now() / 1000);
    const expiryTime = fileData.value.expirationTime;
    const timeRemaining = expiryTime - now;
    
    if (timeRemaining <= 0) return 'Expired';
    
    // Less than one hour
    if (timeRemaining < 3600) {
      const minutes = Math.floor(timeRemaining / 60);
      return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    // Less than one day
    if (timeRemaining < 86400) {
      const hours = Math.floor(timeRemaining / 3600);
      return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    // More than one day
    const days = Math.floor(timeRemaining / 86400);
    return `in ${days} day${days !== 1 ? 's' : ''}`;
  };
  
  // View and download functions
  const viewFile = () => {
  if (!fileData.value || !fileData.value.ipfsHash) {
    console.error("Missing file data or ipfsHash:", fileData.value);
    toast.error("File data is incomplete", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    });
    return;
  }
  
  // Check for ipfsHash in different possible property names/formats
  const ipfsHash = fileData.value.ipfsHash || fileData.value.ipfs_pin_hash || fileData.value.ipfshash;
  
  if (!ipfsHash) {
    console.error("IPFS hash not found in file data");
    toast.error("File hash is missing", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    });
    return;
  }
  
  // Redirect to the file viewer with the appropriate parameters
  router.push({
    name: 'FileViewer',
    params: {
      ipfsHash: ipfsHash,
      fileType: fileData.value.fileType || '',
      fileName: fileData.value.fileName || 'Document'
    }
  });
};
  
const downloadFile = () => {
  if (!fileData.value || !fileData.value.ipfsHash) {
    console.error("Missing file data or ipfsHash for download:", fileData.value);
    toast.error("File data is incomplete", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    });
    return;
  }
  
  console.log("Downloading file with data:", fileData.value);
  
  // Check for ipfsHash in different possible property names/formats
  const ipfsHash = fileData.value.ipfsHash || fileData.value.ipfs_pin_hash || fileData.value.ipfshash;
  
  if (!ipfsHash) {
    console.error("IPFS hash not found in file data for download");
    toast.error("File hash is missing", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: 'colored'
    });
    return;
  }
  
  // Make sure gateway URL is properly set
  const gatewayUrl = import.meta.env.VITE_PINATA_GATEWAY_URL || "https://gateway.pinata.cloud";
  
  const url = `${gatewayUrl}/ipfs/${ipfsHash}`;
  console.log("Downloading file from URL:", url);
  
  // Create a temporary link element for downloading
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileData.value.fileName || 'download');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  
  const goHome = () => {
    router.push('/');
  };
  
  // Fetch the shared file
  const fetchSharedFile = async () => {
    const shareId = route.params.shareId;
    
    if (!shareId) {
      error.value = 'Invalid share link';
      loading.value = false;
      return;
    }
    
    try {
      const data = await fileAPI.getSharedFile(shareId);
      fileData.value = data;
      
      // Check if the file has expired
      const now = Math.floor(Date.now() / 1000);
      if (data.expirationTime < now) {
        error.value = 'This shared file has expired';
        fileData.value = null;
      }
    } catch (err) {
      console.error('Error fetching shared file:', err);
      error.value = err.message || 'Failed to load the shared file';
    } finally {
      loading.value = false;
    }
  };
  
  // Lifecycle hooks
  onMounted(() => {
    fetchSharedFile();
  });
  </script>
  
  <style scoped>
  .shared-file-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: var(--main-bg);
  }
  
  .shared-file-card {
    background-color: var(--secondary-bg);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    padding: 30px;
    animation: fadeIn 0.5s ease-out;
  }
  
  /* Loading state */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--accent-color);
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Error state */
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    text-align: center;
  }
  
  .error-icon {
    font-size: 60px;
    color: #ef4444;
    margin-bottom: 20px;
  }
  
  .error-state h2 {
    color: var(--text-primary);
    margin-bottom: 15px;
  }
  
  .error-state p {
    color: var(--text-secondary);
    margin-bottom: 25px;
  }
  
  /* File details */
  .file-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .file-header h2 {
    color: var(--text-primary);
    margin: 0;
  }
  
  .expiry-badge {
    display: flex;
    align-items: center;
    background-color: var(--main-bg);
    color: var(--text-secondary);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  
  .expiry-icon {
    margin-right: 6px;
    font-size: 1rem;
  }
  
  .file-info {
    background-color: var(--main-bg);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
  }
  
  .file-info-row {
    display: flex;
    margin-bottom: 12px;
  }
  
  .file-info-row:last-child {
    margin-bottom: 0;
  }
  
  .label {
    width: 100px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .value {
    flex: 1;
    color: var(--text-primary);
  }
  
  .file-actions {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
  }
  
  .primary-button, .secondary-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    flex: 1;
  }
  
  .primary-button {
    background-color: var(--accent-color);
    color: var(--common-white);
  }
  
  .primary-button:hover {
    background-color: var(--hover-accent);
    transform: translateY(-2px);
  }
  
  .secondary-button {
    background-color: var(--main-bg);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }
  
  .secondary-button:hover {
    background-color: var(--border-color);
    transform: translateY(-2px);
  }
  
  .button-icon {
    margin-right: 8px;
  }
  
  .disclaimer {
    padding: 15px;
    border-radius: 8px;
    background-color: rgba(var(--accent-color-rgb), 0.1);
    margin-top: 10px;
  }
  
  .disclaimer p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .shared-file-card {
      padding: 20px;
    }
    
    .file-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .file-actions {
      flex-direction: column;
    }
    
    .file-info-row {
      flex-direction: column;
    }
    
    .label {
      width: 100%;
      margin-bottom: 4px;
    }
  }
  </style>