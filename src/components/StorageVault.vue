<template>
    <div class="main-div">
      <h1>Storage Vault</h1>
      <div class="second-div">
        <div 
          class="second-first" 
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          @click="triggerFileInput"
        >
          <input 
            type="file" 
            ref="fileInput" 
            style="display: none" 
            @change="handleFileSelect"
            accept="image/png,image/jpeg,application/pdf"
            multiple
          />
          <div class="sec-first-first">
            <Icon 
              icon="hugeicons:upload-04" 
              class="icon-first" 
              :style="{ fontSize: '4rem', color: 'var(--text-secondary)' }"
            />
          </div>
          <div class="sec-first-sec">
            <p>Upload Medical Documents</p>
          </div>
          <div class="sec-first-third">
            <p>PNG, JPG, PDF up to 10mb</p>
          </div>
          <div v-if="uploadProgress" class="upload-progress">
            <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
            <p>Uploading: {{ uploadProgress }}%</p>
          </div>
        </div>
      </div>
  
      <div class="third-div">
        <h2>Stored Records</h2>
        <div v-if="loading" class="loading">
          <p>Loading files...</p>
        </div>
        <div v-else-if="storedFiles.length === 0" class="no-files">
          <p>No files uploaded yet</p>
        </div>
        <div 
          v-for="file in storedFiles" 
          :key="file.ipfsHash" 
          class="third-first"
        >
          <div class="third-first-left">
            <p>{{ file.name }}</p>
            <div class="third-ptag-first">
              <p>Uploaded on {{ formatDate(file.timestamp) }}</p>
            </div>
          </div>
          <div class="third-first-right">
            <div class="third-first-right-first">
              <Icon 
                icon="hugeicons:clock-01" 
                class="icon-sec" 
                :style="{ fontSize: '1rem', color: 'var(--text-secondary)' }"
              />
            </div>
            <div class="third-first-right-sec">
              <p>Stored on IPFS</p>
            </div>
            <div 
              class="third-first-right-third" 
              @click="downloadFile(file)"
            >
              <Icon 
                icon="hugeicons:attachment-02" 
                class="icon-sec" 
                :style="{ fontSize: '1.5rem', color: 'var(--accent-color)' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Icon } from '@iconify/vue'
  
  // State
  const fileInput = ref(null)
  const storedFiles = ref([])
  const loading = ref(false)
  const uploadProgress = ref(0)
  
  // Constants for Pinata API
  const PINATA_API_URL = 'https://api.pinata.cloud'
  const PINATA_GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud'
  const JWT = import.meta.env.VITE_PINATA_JWT
  
  // Utility Functions
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-GB')
  }
  
  const triggerFileInput = () => {
    fileInput.value?.click()
  }
  
  const handleFileDrop = (e) => {
    const files = [...e.dataTransfer.files]
    handleFiles(files)
  }
  
  const handleFileSelect = (e) => {
    const files = [...e.target.files]
    handleFiles(files)
  }
  
  // File Upload Logic
  const handleFiles = async (files) => {
    try {
      uploadProgress.value = 0
      const totalFiles = files.length
      let completedFiles = 0
  
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
  
        const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${JWT}`
          },
          body: formData
        })
  
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`)
        }
  
        const data = await response.json()
        completedFiles++
        uploadProgress.value = Math.round((completedFiles / totalFiles) * 100)
  
        // Add to stored files
        storedFiles.value.unshift({
          ipfsHash: data.IpfsHash,
          name: file.name,
          timestamp: new Date().toISOString()
        })
      }
  
      setTimeout(() => {
        uploadProgress.value = 0
      }, 1000)
  
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error.message}`)
      uploadProgress.value = 0
    }
  }
  
  // Fetch stored files
  const fetchFiles = async () => {
    loading.value = true
    try {
      const response = await fetch(`${PINATA_API_URL}/data/pinList?status=pinned`, {
        headers: {
          'Authorization': `Bearer ${JWT}`
        }
      })
  
      if (!response.ok) {
        throw new Error(`Failed to fetch files with status: ${response.status}`)
      }
  
      const data = await response.json()
      storedFiles.value = data.rows.map(item => ({
        ipfsHash: item.ipfs_pin_hash,
        name: item.metadata?.name || 'Unnamed File',
        timestamp: item.date_pinned
      }))
    } catch (error) {
      console.error('Error fetching files:', error)
      alert(`Failed to load files: ${error.message}`)
      storedFiles.value = []
    } finally {
      loading.value = false
    }
  }
  
  // Download file
  const downloadFile = async (file) => {
    try {
      const url = `${PINATA_GATEWAY_URL}/ipfs/${file.ipfsHash}`
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error downloading file:', error)
      alert(`Failed to download file: ${error.message}`)
    }
  }
  
  // Initial load
  onMounted(() => {
    fetchFiles()
  })
  </script>
  

<style>
.upload-progress {
  width: 80%;
  height: 20px;
  background-color: var(--secondary-bg);
  border-radius: 10px;
  overflow: hidden;
  margin: 10px auto;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
}

.loading, .no-files {
  text-align: center;
  padding: 20px;
  color: var(--text-secondary);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  opacity: 0.8;
}

/* Add drag and drop visual feedback */
.second-first {
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.second-first:hover {
  border-color: var(--accent-color);
}

.main-div{
    width: 100%;
    height: 90vh;
    background-color: var(--main-bg);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h1{
        font-size: 24px;
        font-family: 'Poppins', sans-serif;
        margin-bottom: 0.5rem;
        margin-left: 1rem;
    }
}
.second-div{
    width: 97%;
    height:39%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: c;
    justify-content: center;
    border-radius: 0.5rem;
    padding-top: 1.2rem;
    margin-bottom: 0.5rem;
    margin-left: 1rem;
}
.second-first{
    width: 95%;
    height: 90%;
    border: 0.1rem dashed rgb(180, 171, 171);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.sec-first-first{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    .icon{
        width: 10rem;
        height: 10rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}


.sec-first-sec{
    width: 100%;
    height: 15%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    p{
        display: flex;
        align-items: flex-start;
        justify-content: center;
        color: var(--accent-color);
        margin-top: 0.7rem;
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
       
    }
}
.sec-first-third{
    width: 100%;
    height: 25%;
    background-color: var(--secondary-bg);
    p{
        display: flex;
        align-items: flex-start;
        justify-content: center;
        color: var(--text-secondary);
        margin-top: 1rem;
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
    }
}
.third-div{
    width: 97%;
    min-height: 54%;
    background-color: var(--secondary-bg);
    border-radius: 0.5rem;
    margin-top: 1rem;
    margin-left: 1rem;
    h2{
        font-size: 24px;
        font-family: 'Poppins', sans-serif;
        margin: 1rem;
    }
   

}
.third-first{
    width: 95%;
    height: 22%;
    margin-left: 1.7rem;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-primary);
    }
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}
.third-first-left{
    width: 40%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
}
.third-first-right{
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
    padding: 0.5rem;
}
.third-first-right-first{
    width: 5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.third-first-right-sec{
    width: 25%;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-secondary);
    }
}
.third-first-right-third{
    width: 8%;
    padding: rem;
}
.third-sec{
    width: 95%;
    height: 22%;
    margin-left: 1.7rem;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-primary);
    }
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}
.third-sec-left{
    width: 40%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
}
.third-sec-right{
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
    padding: 0.5rem;
}
.third-sec-right-first{
    width: 5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: green;
    }
}
.third-sec-right-sec{
    width: 25%;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-secondary);
    }
}
.third-sec-right-third{
    width: 8%;
    padding: rem;
}
.third-third{
    width: 95%;
    height: 22%;
    margin-left: 1.7rem;
    background-color: var(--main-bg);
    border-radius: 0.5rem;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-primary);
    }
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}
.third-third-left{
    width: 40%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
}
.third-third-right{
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
    padding: 0.5rem;
}
.third-third-right-first{
    width: 5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.third-third-right-sec{
    width: 25%;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-secondary);
    }
}
.third-third-right-third{
    width: 8%;
    padding: rem;
}
.third-ptag-first{
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-top: 0.2rem;
    }
}
.third-ptag-sec{
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-top: 0.2rem;
    }
}
.third-ptag-third{
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        margin-top: 0.2rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
}
@media screen and (max-width: 768px) {
    .main-div {
        height: 150vh;
        padding: 0 1rem;
    }

    .main-div h1 {
        
        text-align: center;
        font-size: 24px;
        margin-left: 1rem;
    }

    .second-div {
        width: 100%;
        height: 25%;
        margin-bottom: 0.5rem;
        align-items: center;
        justify-content: center;
        margin-left: 0rem;
    }

    .second-first {
        width: 92%;
        height: 95%;
        margin-bottom: 1.1rem;

    }

    .sec-first-first {
        height: 40%;
        align-items: center;
    }

    .sec-first-first .icon-first {
        font-size: 3.0rem !important;
    }

    .sec-first-sec p, 
    .sec-first-third p {
        font-size: 0.9rem;
    }

    .third-div {
        width: 100%;
        height: 55%;
        margin-left: 0rem;
    }

    .third-div h2 {
        font-size: 1.2rem;
        margin: 0.5rem;
        text-align: center;
        margin-left: -13.9rem;
        margin-bottom: 1rem;
    }

    .third-first, 
    .third-sec, 
    .third-third {
        width:96%;
        margin-left: 0.5rem;
        flex-direction: row;
        height: auto;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .third-first-left, 
    .third-sec-left, 
    .third-third-left {
        width: 100%;
        padding: 0.5rem;
        height: 4rem;
    }

    .third-first-right, 
    .third-sec-right, 
    .third-third-right {
        width: 100%;
        align-items: center;
        justify-content: flex-end;

        padding: 0;
    }

    .third-first-right-first, 
    .third-sec-right-first, 
    .third-third-right-first {
        width: 10%;
    }

    .third-first-right-sec, 
    .third-sec-right-sec, 
    .third-third-right-sec {
        width: 50%;
        text-align: center;

    }

    .third-first-right-third, 
    .third-sec-right-third, 
    .third-third-right-third {
        width: 15%;
    }

    .third-ptag-first p, 
    .third-ptag-sec p, 
    .third-ptag-third p {
        font-size: 0.8rem;
    }
}




</style>