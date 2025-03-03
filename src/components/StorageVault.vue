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
          <div
            class="progress-bar"
            :style="{ width: uploadProgress + '%' }"
          ></div>
          <p>Uploading: {{ uploadProgress }}%</p>
        </div>
      </div>
    </div>

    <!-- File Records Section -->
    <div class="section-tabs">
      <button
        :class="['tab-button', { active: activeTab === 'files' }]"
        @click="activeTab = 'files'"
      >
        <Icon icon="hugeicons:files" />
        My Files
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'shared' }]"
        @click="activeTab = 'shared'"
      >
        <Icon icon="hugeicons:share-02" />
        Shared Links
      </button>
    </div>

    <!-- Files Tab -->
    <div v-if="activeTab === 'files'" class="third-div">
      <h2>My Files</h2>
      <div v-if="loading" class="loading">
        <p>Loading files...</p>
      </div>
      <div v-else-if="storedFiles.length === 0" class="no-files">
        <p>No files uploaded yet</p>
      </div>
      <div
        v-for="(file, index) in storedFiles"
        :key="file.fileId"
        class="third-first"
        :style="{ '--item-index': index }"
      >
        <div class="third-first-left">
          <!-- Make file name larger and more prominent -->
          <h3 class="file-name">
            {{ file.fileName || file.name || "Unnamed File" }}
          </h3>
          <div class="third-ptag-first">
            <p>
              Uploaded on {{ formatDate(file.createdAt || file.timestamp) }}
            </p>
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
            <!-- Display file type alongside storage info -->
            <p>{{ file.fileType || "Document" }} stored on IPFS</p>
          </div>
          <div class="third-first-right-actions">
            <!-- Action buttons remain the same -->
            <button @click="viewFile(file)" class="icon-btn" title="View file">
              <Icon
                icon="hugeicons:eye-01"
                class="icon-sec"
                :style="{ fontSize: '1.5rem', color: 'var(--accent-color)' }"
              />
            </button>
            <button
              @click="downloadFile(file)"
              class="icon-btn"
              title="Download file"
            >
              <Icon
                icon="hugeicons:download-01"
                class="icon-sec"
                :style="{ fontSize: '1.5rem', color: 'var(--accent-color)' }"
              />
            </button>
            <button
              @click="showShareModal(file)"
              class="icon-btn"
              title="Share file"
            >
              <Icon
                icon="hugeicons:share-02"
                class="icon-sec"
                :style="{ fontSize: '1.5rem', color: 'var(--accent-color)' }"
              />
            </button>
            <button
              @click="confirmDeleteFile(file)"
              class="icon-btn delete-btn"
              title="Delete file"
            >
              <Icon
                icon="hugeicons:trash-01"
                class="icon-sec"
                :style="{ fontSize: '1.5rem', color: '#ff5252' }"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Shared Links Tab -->
    <div v-if="activeTab === 'shared'" class="third-div">
      <h2>Active Shared Links</h2>
      <div v-if="loadingSharedLinks" class="loading">
        <p>Loading shared links...</p>
      </div>
      <div v-else-if="sharedLinks.length === 0" class="no-files">
        <p>No active shared links found</p>
      </div>
      <div
        v-for="(link, index) in sharedLinks"
        :key="link.shareId"
        class="third-first shared-link-item"
        :style="{ '--item-index': index }"
      >
        <div class="third-first-left">
          <div class="file-name">{{ link.fileName }}</div>
          <div class="third-ptag-first">
            <p>
              <span>Expires on: </span>
              <span v-if="link.expirationTime">{{
                formatExpiryDate(link.expirationTime)
              }}</span>
              <span v-else class="missing-data">No expiration set</span>
            </p>
          </div>
        </div>
        <div class="third-first-right">
          <div class="third-first-right-sec">
            <p v-if="link.expirationTime">
              {{ calculateTimeRemaining(link.expirationTime) }}
            </p>
            <p v-else class="missing-data">Expiration unknown</p>
          </div>

          <div class="third-first-right-actions">
            <button
              @click="copyShareLinkToClipboard(link)"
              class="icon-btn"
              title="Copy link"
            >
              <Icon
                icon="hugeicons:copy-02"
                class="icon-sec"
                :style="{ fontSize: '1.5rem', color: 'var(--accent-color)' }"
              />
            </button>
            <button
              @click="confirmExpireLink(link)"
              class="icon-btn delete-btn"
              title="Expire link now"
            >
              <Icon
                icon="hugeicons:cross-circle"
                class="icon-sec"
                :style="{ fontSize: '1.5rem', color: '#ff5252' }"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div
      v-if="shareModal.visible"
      class="modal-overlay"
      @click="shareModal.visible = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Share File</h3>
        <p>
          Create a time-limited share link for:
          <strong>{{
            shareModal.file?.fileName || shareModal.file?.name
          }}</strong>
        </p>

        <div class="modal-form">
          <label for="expiry">Link expires after:</label>
          <select id="expiry" v-model="shareModal.expirationHours">
            <option value="1">1 hour</option>
            <option value="6">6 hours</option>
            <option value="24">1 day</option>
            <option value="72">3 days</option>
            <option value="168">1 week</option>
          </select>

          <div v-if="shareModal.link" class="share-link-container">
            <p>Share this link:</p>
            <div class="share-link">
              <input
                type="text"
                readonly
                :value="shareModal.link"
                ref="shareLinkInput"
              />
              <button @click="copyShareLink" class="copy-btn">
                <Icon icon="hugeicons:copy-02" />
              </button>
            </div>
            <p class="expiry-note">
              This link will expire on
              {{ formatExpiryDate(shareModal.expiryTime) }}
            </p>
          </div>

          <div class="modal-actions">
            <button
              v-if="!shareModal.link"
              @click="generateShareLink"
              class="action-btn"
              :disabled="shareModal.isGenerating"
            >
              {{
                shareModal.isGenerating
                  ? "Generating..."
                  : "Generate Share Link"
              }}
            </button>
            <button
              v-else
              @click="shareModal.visible = false"
              class="action-btn close-btn"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="confirmModal.visible"
      class="modal-overlay"
      @click="confirmModal.visible = false"
    >
      <div class="modal-content confirm-modal" @click.stop>
        <h3>{{ confirmModal.title }}</h3>
        <p>{{ confirmModal.message }}</p>

        <div class="modal-actions">
          <button
            @click="confirmModal.visible = false"
            class="action-btn cancel-btn"
          >
            Cancel
          </button>
          <button
            @click="confirmModal.onConfirm"
            class="action-btn delete-confirm-btn"
            :disabled="confirmModal.isProcessing"
          >
            {{
              confirmModal.isProcessing
                ? "Processing..."
                : confirmModal.confirmText
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { fileAPI } from "./fileApi.js";

// Setup router
const router = useRouter();

// State
const fileInput = ref(null);
const storedFiles = ref([]);
const sharedLinks = ref([]);
const loading = ref(false);
const loadingSharedLinks = ref(false);
const uploadProgress = ref(0);
const shareLinkInput = ref(null);
const activeTab = ref("files");

// Share modal state
const shareModal = reactive({
  visible: false,
  file: null,
  expirationHours: 24,
  link: "",
  expiryTime: null,
  isGenerating: false,
});

// Confirmation modal state
const confirmModal = reactive({
  visible: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  onConfirm: () => {},
  isProcessing: false,
});

// Constants for Pinata Gateway
const PINATA_GATEWAY_URL =
  import.meta.env.VITE_PINATA_GATEWAY_URL || "https://gateway.pinata.cloud";

// Watch for tab changes to load appropriate data
watch(activeTab, (newTab) => {
  if (newTab === "shared") {
    fetchSharedLinks();
  } else if (newTab === "files") {
    fetchUserFiles();
  }
});

// Utility Functions
const formatDate = (timestamp) => {
  if (!timestamp) {
    console.warn("Empty timestamp value:", timestamp);
    return "Recently";
  }

  try {
    let date;

    // Handle different timestamp formats
    if (typeof timestamp === "number") {
      // If it's a Unix timestamp in seconds (before 2001)
      if (timestamp < 1000000000) {
        date = new Date(timestamp * 1000);
      } else {
        date = new Date(timestamp);
      }
    } else if (typeof timestamp === "string") {
      // PostgreSQL timestamps may be returned in a variety of formats
      if (timestamp.includes("T") || timestamp.includes("-")) {
        // ISO format or date with dashes
        date = new Date(timestamp);
      } else if (!isNaN(Number(timestamp))) {
        // Numeric string that could be a timestamp
        date = new Date(Number(timestamp));
      } else {
        // Other string formats
        date = new Date(timestamp);
      }
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      console.warn("Unrecognized timestamp format:", timestamp);
      return "Recently";
    }

    // Validate the parsed date
    if (isNaN(date.getTime())) {
      console.warn("Invalid date object created from:", timestamp);
      return "Recently";
    }

    // Only return formatted date if it's valid
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error, "for value:", timestamp);
    return "Recently";
  }
};

const formatExpiryDate = (timestamp) => {
  if (!timestamp) return "Not specified";

  // Handle different timestamp formats
  try {
    // If timestamp is already a date string
    if (typeof timestamp === "string" && timestamp.includes("T")) {
      return new Date(timestamp).toLocaleString();
    }

    // If timestamp is in seconds (Unix timestamp)
    if (typeof timestamp === "number" || !isNaN(Number(timestamp))) {
      const ts = Number(timestamp);
      // Check if it's in seconds (smaller value) or milliseconds
      const date = ts < 20000000000 ? new Date(ts * 1000) : new Date(ts);
      return date.toLocaleString();
    }

    // Fallback
    return "Invalid date";
  } catch (error) {
    console.error("Error formatting expiry date:", error, timestamp);
    return "Invalid date";
  }
};

const calculateTimeRemaining = (expiryTimestamp) => {
  if (!expiryTimestamp) return "Unknown";

  const now = Math.floor(Date.now() / 1000);
  const timeRemaining = expiryTimestamp - now;

  if (timeRemaining <= 0) return "Expired";

  // Convert to days, hours, minutes
  const days = Math.floor(timeRemaining / 86400);
  const hours = Math.floor((timeRemaining % 86400) / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileDrop = (e) => {
  const files = [...e.dataTransfer.files];
  handleFiles(files);
};

const handleFileSelect = (e) => {
  const files = [...e.target.files];
  handleFiles(files);
};

// File Upload Logic
const handleFiles = async (files) => {
  try {
    uploadProgress.value = 0;
    const totalFiles = files.length;
    let completedFiles = 0;

    for (const file of files) {
      // File size validation (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 10MB limit`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          theme: "colored",
        });
        continue;
      }

      try {
        // Upload file using our fileAPI service
        await fileAPI.uploadFile(file);

        completedFiles++;
        uploadProgress.value = Math.round((completedFiles / totalFiles) * 100);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          theme: "colored",
        });
      }
    }

    // Refresh the file list
    fetchUserFiles();

    setTimeout(() => {
      uploadProgress.value = 0;
    }, 1000);

    toast.success("Files uploaded successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  } catch (error) {
    console.error("Upload error:", error);
    toast.error(`Upload failed: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
    uploadProgress.value = 0;
  }
};

// Fetch files belonging to the user
const fetchUserFiles = async () => {
  loading.value = true;
  try {
    const files = await fileAPI.getUserFiles();

    // Log the first file object to see its structure
    if (Array.isArray(files) && files.length > 0) {
      console.log("File structure example:", files[0]);
      console.log("File name properties:", {
        fileName: files[0].fileName,
        filename: files[0].filename,
        name: files[0].name,
      });
    }

    // Make sure we have an array of files
    if (Array.isArray(files)) {
      // Map the files to ensure consistent property names
      storedFiles.value = files.map((file) => ({
        ...file,
        // Ensure file name is always available
        fileName: file.fileName || file.filename || file.name || "Unnamed File",
        // Ensure other properties are consistent
        fileId: file.fileId || file.fileid || file.id,
        fileType: file.fileType || file.filetype || "Unknown",
        createdAt: file.createdAt || file.createdat || file.timestamp,
      }));
    } else {
      console.error("Unexpected response format:", files);
      storedFiles.value = [];
      toast.error("Received unexpected data format from server", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: "colored",
      });
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    toast.error(`Failed to load your files: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
    storedFiles.value = [];
  } finally {
    loading.value = false;
  }
};

// Fetch shared links
const fetchSharedLinks = async () => {
  loadingSharedLinks.value = true;
  try {
    const links = await fileAPI.getSharedLinks();

    // Make sure we have an array of links
    if (Array.isArray(links)) {
      sharedLinks.value = links;
    } else {
      console.error("Unexpected response format for shared links:", links);
      sharedLinks.value = [];
    }
  } catch (error) {
    console.error("Error fetching shared links:", error);
    toast.error(`Failed to load shared links: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
    sharedLinks.value = [];
  } finally {
    loadingSharedLinks.value = false;
  }
};

// View the file
const viewFile = (file) => {
  try {
    // Check for ipfsHash in different possible property names/formats
    const ipfsHash = file.ipfsHash || file.ipfs_pin_hash || file.ipfshash;

    if (!ipfsHash) {
      throw new Error("File hash not found");
    }

    // Redirect to file viewer
    router.push({
      name: "FileViewer",
      params: {
        ipfsHash: ipfsHash,
        fileType: file.fileType || file.filetype || "",
        fileName: file.fileName || file.filename || "Document",
      },
    });
  } catch (error) {
    console.error("Error opening file:", error);
    toast.error(`Failed to open file: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  }
};

// Download file
const downloadFile = async (file) => {
  try {
    // Check for ipfsHash in different possible property names/formats
    const ipfsHash = file.ipfsHash || file.ipfs_pin_hash || file.ipfshash;

    if (!ipfsHash) {
      throw new Error("File hash not found");
    }

    // Make sure PINATA_GATEWAY_URL is properly set
    const gatewayUrl = PINATA_GATEWAY_URL;

    // Construct the URL
    const url = `${gatewayUrl}/ipfs/${ipfsHash}`;

    // Create a temporary link element for downloading
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.fileName || file.filename || "download");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      theme: "colored",
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error(`Failed to download file: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  }
};

// Delete file confirmation
const confirmDeleteFile = (file) => {
  confirmModal.title = "Delete File";
  confirmModal.message = `Are you sure you want to delete "${
    file.fileName || file.name
  }"? This action cannot be undone.`;
  confirmModal.confirmText = "Delete";
  confirmModal.onConfirm = () => deleteFile(file);
  confirmModal.visible = true;
};

// Delete file from backend and Pinata
const deleteFile = async (file) => {
  confirmModal.isProcessing = true;
  try {
    // Get file ID
    const fileId = file.fileId || file.id;

    if (!fileId) {
      throw new Error("File ID not found");
    }

    // Delete from backend
    await fileAPI.deleteFile(fileId);

    // Refresh the files list
    await fetchUserFiles();

    // Close the confirmation modal
    confirmModal.visible = false;

    toast.success("File deleted successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });

    // Also refresh shared links as they might be affected
    if (activeTab.value === "shared") {
      fetchSharedLinks();
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    toast.error(`Failed to delete file: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  } finally {
    confirmModal.isProcessing = false;
  }
};

// Expire link confirmation
const confirmExpireLink = (link) => {
  confirmModal.title = "Expire Shared Link";
  confirmModal.message = `Are you sure you want to expire the shared link for "${link.fileName}"? This will immediately revoke access for anyone with this link.`;
  confirmModal.confirmText = "Expire Now";
  confirmModal.onConfirm = () => expireSharedLink(link);
  confirmModal.visible = true;
};

// Expire a shared link
const expireSharedLink = async (link) => {
  confirmModal.isProcessing = true;
  try {
    // Get share ID
    const shareId = link.shareId;

    if (!shareId) {
      throw new Error("Share ID not found");
    }

    // Delete the shared link
    await fileAPI.deleteSharedLink(shareId);

    // Refresh the shared links list
    await fetchSharedLinks();

    // Close the confirmation modal
    confirmModal.visible = false;

    toast.success("Shared link expired successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  } catch (error) {
    console.error("Error expiring shared link:", error);
    toast.error(`Failed to expire shared link: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  } finally {
    confirmModal.isProcessing = false;
  }
};

// Copy shared link to clipboard
const copyShareLinkToClipboard = (link) => {
  try {
    // Format the share link
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/shared/${link.shareId}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareLink);

    toast.success("Link copied to clipboard!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      theme: "colored",
    });
  } catch (error) {
    console.error("Error copying link:", error);
    toast.error(`Failed to copy link: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  }
};

// Share modal functions
const showShareModal = (file) => {
  shareModal.file = file;
  shareModal.visible = true;
  shareModal.link = "";
  shareModal.expiryTime = null;
  shareModal.expirationHours = 24; // Default to 24 hours
};

// Generate share link
const generateShareLink = async () => {
  shareModal.isGenerating = true;

  try {
    // Debug the file object to see all properties
    console.log("File object being shared:", shareModal.file);

    // Try to identify the file ID using various possible property names
    let fileId = null;
    if (shareModal.file.fileId !== undefined) {
      fileId = shareModal.file.fileId;
    } else if (shareModal.file.id !== undefined) {
      fileId = shareModal.file.id;
    } else if (shareModal.file.file_id !== undefined) {
      fileId = shareModal.file.file_id;
    }

    console.log("Determined fileId:", fileId);

    if (!fileId) {
      throw new Error("Could not determine file ID from the file object");
    }

    // Call the API to generate a share link
    const result = await fileAPI.generateShareLink(
      fileId,
      shareModal.expirationHours
    );

    console.log("Share link API response:", result);

    if (!result || !result.shareId) {
      throw new Error("Failed to generate share ID. Response was incomplete.");
    }

    // Format the share link
    const baseUrl = window.location.origin;
    shareModal.link = `${baseUrl}/shared/${result.shareId}`;
    shareModal.expiryTime = result.expirationTime;

    // Wait for DOM update then select the link for easy copying
    setTimeout(() => {
      if (shareLinkInput.value) {
        shareLinkInput.value.select();
      }
    }, 100);

    // Also refresh shared links if we're on that tab
    if (activeTab.value === "shared") {
      fetchSharedLinks();
    }
  } catch (error) {
    console.error("Error generating share link:", error);
    toast.error(`Failed to generate share link: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
  } finally {
    shareModal.isGenerating = false;
  }
};

// Copy share link to clipboard
const copyShareLink = () => {
  if (shareLinkInput.value) {
    shareLinkInput.value.select();
    document.execCommand("copy");
    toast.success("Link copied to clipboard!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      theme: "colored",
    });
  }
};

// Initial load
onMounted(() => {
  // Check if user is authenticated
  const token = localStorage.getItem("authToken");
  if (!token) {
    toast.error("Please log in to access your storage vault", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
    // Redirect to login
    // router.push('/login');
    return;
  }

  // Fetch files list
  fetchUserFiles();
});
</script>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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
.main-div {
  width: 100%;
  height: 90vh;
  background-color: var(--main-bg);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  animation: fadeIn 0.6s ease-out;
}

.main-div h1 {
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  margin-bottom: 0.5rem;
  margin-left: 1rem;
  animation: fadeInUp 0.6s ease-out;
}

.file-name {
  font-size: 1.1rem;  /* Increased from font-size-base */
  font-family: "Poppins", sans-serif;
  color: var(--text-primary);
  font-weight: 600;  /* Increased from 500 to make it bolder */
  margin-bottom: 0.3rem;
  margin-top: 0;
  word-break: break-word;  /* Prevents long filenames from overflowing */
  max-width: 100%;
}

.missing-data {
  color: #ff9800;
  font-style: italic;
}

.second-div {
  width: 97%;
  height: 39%;
  background-color: var(--secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding-top: 1.2rem;
  margin-bottom: 0.5rem;
  margin-left: 1rem;
  animation: fadeInUp 0.8s ease-out;
}

.second-first {
  width: 95%;
  height: 90%;
  border: 0.1rem dashed rgb(180, 171, 171);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 1s ease-out;
}

/* Tab buttons */
.section-tabs {
  display: flex;
  width: 97%;
  margin-left: 1rem;
  margin-bottom: 0.5rem;
  animation: fadeInUp 0.9s ease-out;
}

.tab-button {
  flex: 1;
  padding: 0.8rem 1rem;
  background-color: var(--secondary-bg);
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  color: var(--text-secondary);
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-right: 0.3rem;
}

.tab-button:last-child {
  margin-right: 0;
}

.tab-button.active {
  background-color: var(--accent-color);
  color: var(--common-white);
}

.tab-button > svg {
  font-size: 1.2rem;
}

.third-div {
  width: 97%;
  min-height: 44%; /* Reduced height to accommodate tabs */
  background-color: var(--secondary-bg);
  border-radius: 0.5rem;
  margin-top: 0; /* Removed margin-top since tabs take that space */
  margin-left: 1rem;
  animation: fadeInUp 1s ease-out;
  padding-bottom: 1rem;
}

.third-div h2 {
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  margin: 1rem;
  animation: fadeInUp 1.2s ease-out;
}

.third-first {
  width: 95%;
  height: auto;
  min-height: 80px;
  margin-left: 1.7rem;
  background-color: var(--main-bg);
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
  animation-delay: calc(var(--item-index, 0) * 0.15s + 1.2s);
}

.file-name {
  font-size: var(--font-size-base);
  font-family: "Poppins", sans-serif;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.3rem;
}

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

.loading,
.no-files {
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

.sec-first-first {
  width: 100%;
  height: 50%;
  background-color: var(--secondary-bg);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sec-first-sec {
  width: 100%;
  height: 15%;
  background-color: var(--secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sec-first-sec p {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: var(--accent-color);
  margin-top: 0.7rem;
  font-size: var(--font-size-base);
  font-family: "Poppins", sans-serif;
}

.sec-first-third {
  width: 100%;
  height: 25%;
  background-color: var(--secondary-bg);
}

.sec-first-third p {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: var(--text-secondary);
  margin-top: 1rem;
  font-size: var(--font-size-base);
  font-family: "Poppins", sans-serif;
}

.third-first-left {
  width: 65%;  /* Increased from 60% */
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
}


.third-first-right {
  width: 35%;  /* Decreased from 40% to give more space to the filename */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  padding: 0.5rem;
}

.third-first-right-first {
  width: 5%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.third-first-right-sec {
  width: 40%; /* Increased for better text display */
  white-space: nowrap;
}

.third-first-right-sec p {
  font-size: var(--font-size-base);
  font-family: "Poppins", sans-serif;
  color: var(--text-secondary);
}

.third-ptag-first p {
  font-size: var(--font-size-base);
  font-family: "Poppins", sans-serif;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

/* Shared Link Styling */
.shared-link-item {
  background-color: var(--main-bg);
  border-left: 4px solid var(--accent-color);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--secondary-bg);
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.3s ease-out;
}

.modal-form {
  margin-top: 20px;
}

.modal-form label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-family: "Poppins", sans-serif;
}

.modal-form select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1.5px solid var(--border-color);
  background-color: var(--main-bg);
  color: var(--text-primary);
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
}

.share-link-container {
  background-color: var(--main-bg);
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.share-link {
  display: flex;
  margin-top: 10px;
}

.share-link input {
  flex-grow: 1;
  padding: 10px;
  border: 1.5px solid var(--border-color);
  border-radius: 6px 0 0 6px;
  background-color: var(--main-bg);
  color: var(--text-primary);
  font-family: "Poppins", sans-serif;
}

.copy-btn {
  padding: 10px 15px;
  border: none;
  background-color: var(--accent-color);
  color: var(--common-white);
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.copy-btn:hover {
  background-color: var(--hover-accent);
}

.expiry-note {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 10px;
  font-family: "Poppins", sans-serif;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-family: "Poppins", sans-serif;
  background-color: var(--accent-color);
  color: var(--common-white);
}

.action-btn:hover {
  background-color: var(--hover-accent);
  transform: translateY(-2px);
}

.action-btn:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
  transform: none;
}

.close-btn {
  background-color: var(--main-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.close-btn:hover {
  background-color: var(--secondary-bg);
}

.cancel-btn {
  background-color: var(--main-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.delete-confirm-btn {
  background-color: #ff5252;
}

.delete-confirm-btn:hover {
  background-color: #ff1a1a;
}

/* Confirmation modal styling */
.confirm-modal {
  max-width: 400px;
}

/* Action buttons in file list */
.third-first-right-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s, transform 0.2s;
}

.icon-btn:hover {
  background-color: var(--main-bg);
  transform: translateY(-2px);
}

.delete-btn:hover {
  background-color: rgba(255, 82, 82, 0.1);
}

/* Responsive Media Queries */
@media screen and (max-width: 768px) {
  .main-div {
    height: 100%;
    min-height: 100vh;
    padding: 0 1rem;
    animation: fadeIn 0.6s ease-out;
  }

  .main-div h1 {
    text-align: center;
    font-size: 1.5rem;
    margin: 1rem 0;
  }

  .second-div {
    width: 100%;
    height: auto;
    aspect-ratio: 3/2;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: center;
    margin-left: 0;
  }

  .second-first {
    width: 92%;
    height: 90%;
  }

  .sec-first-first {
    height: 40%;
    align-items: center;
  }

  .sec-first-first .icon-first {
    font-size: 3rem !important;
  }

  .sec-first-sec p,
  .sec-first-third p {
    font-size: 0.9rem;
  }

  .section-tabs {
    width: 100%;
    margin-left: 0;
  }

  .tab-button {
    font-size: 0.9rem;
    padding: 0.6rem 0.5rem;
  }

  .third-div {
    width: 100%;
    margin-left: 0;
    padding-bottom: 2rem;
  }

  .third-div h2 {
    font-size: 1.2rem;
    margin: 1rem;
    text-align: center;
  }

  .third-first {
    width: 94%;
    margin-left: 3%;
    flex-direction: column;
    height: auto;
    padding: 0.8rem;
    margin-bottom: 1rem;
  }

  .third-first-left {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .third-first-right {
    width: 100%;
    justify-content: space-between;
    padding: 0.5rem;
  }

  .third-first-right-sec {
    width: auto;
    flex-grow: 1;
    margin-right: 0.5rem;
  }

  .third-first-right-actions {
    width: auto;
    gap: 8px;
  }

  .modal-content {
    width: 95%;
    padding: 15px;
  }

  .action-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}
</style>
