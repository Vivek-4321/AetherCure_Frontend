<template>
  <div class="dashboard-container">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="user-welcome">
        <h1>Welcome back, {{ userData?.userName || "User" }}</h1>
        <p>Last login: {{ formatDate(userData?.lastLoginDate) || "Today" }}</p>
      </div>
      <div class="system-stats">
        <div class="stat-item">
          <Icon icon="mdi-light:file" />
          <span>{{ fileStats.total }} Files</span>
        </div>
        <div class="stat-item">
          <Icon icon="hugeicons:share-03" />
          <span>{{ fileStats.shared }} Shared</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <span class="loading-text">Loading your dashboard...</span>
    </div>

    <div v-else>
      <!-- File & System Metrics Summary Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">
            <Icon icon="mdi-light:file" />
          </div>
          <div class="metric-content">
            <h3>Files Stored</h3>
            <div class="metric-value">{{ fileStats.total }}</div>
            <p>{{ fileStats.recent }} added recently</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <Icon icon="hugeicons:share-03" />
          </div>
          <div class="metric-content">
            <h3>Shared Files</h3>
            <div class="metric-value">{{ fileStats.shared }}</div>
            <p>Available to others</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <Icon icon="tdesign:object-storage" />
          </div>
          <div class="metric-content">
            <h3>Storage Usage</h3>
            <div class="metric-value">
              {{ formatFileSize(storageSummary.used) }}
            </div>
            <p>of {{ formatFileSize(storageSummary.total) }}</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <Icon icon="stash:last-updates" />
          </div>
          <div class="metric-content">
            <h3>Last Upload</h3>
            <div class="metric-value last-upload">
              {{ getLastUploadTime() }}
            </div>
            <p>{{ recentFiles[0]?.fileName || "No files yet" }}</p>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content Grid -->
      <div class="dashboard-grid">
        <!-- Recent Files -->
        <div class="dashboard-card recent-files">
          <div class="card-header">
            <h2>Recent Files</h2>
            <div class="card-actions">
              <router-link to="/storage" class="accent-button">
                <span>View All</span>
                <Icon icon="hugeicons:arrow-right" />
              </router-link>
            </div>
          </div>
          <div class="card-content">
            <div v-if="!recentFiles.length" class="empty-files">
              <Icon icon="hugeicons:file-upload-03" class="empty-icon" />
              <p>No files have been uploaded yet</p>
              <router-link to="/storage" class="accent-button">
                <Icon icon="hugeicons:upload-04" />
                <span>Upload Files</span>
              </router-link>
            </div>
            <div v-else class="files-list">
              <div
                v-for="(file, index) in recentFiles"
                :key="index"
                class="file-item"
              >
                <div class="file-icon">
                  <Icon :icon="getFileIcon(file.fileType)" />
                </div>
                <div class="file-details">
                  <h4>
                    {{
                      file.fileName ||
                      file.filename ||
                      file.name ||
                      "Unnamed File"
                    }}
                  </h4>
                  <p>
                    Uploaded
                    {{
                      formatDate(
                        file.createdAt || file.createdat || file.timestamp
                      )
                    }}
                  </p>
                </div>
                <div class="file-actions">
                  <button
                    @click="viewFile(file)"
                    class="icon-button"
                    title="View"
                  >
                    <Icon icon="carbon:view" />
                  </button>
                  <button
                    @click="downloadFile(file)"
                    class="icon-button"
                    title="Download"
                  >
                    <Icon icon="hugeicons:download-02" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Storage Usage Analysis -->
        <div class="dashboard-card storage-analysis">
          <div class="card-header">
            <h2>Storage Usage</h2>
            <div class="card-actions">
              <router-link to="/storage" class="accent-button">
                <span>Manage Storage</span>
                <Icon icon="hugeicons:arrow-right" />
              </router-link>
            </div>
          </div>
          <div class="card-content">
            <div v-if="!fileTypeBreakdown.length" class="no-data">
              <p>No storage data available</p>
            </div>
            <div v-else>
              <div class="storage-progress">
                <div class="progress-info">
                  <span
                    >{{ formatFileSize(storageSummary.used) }} used of
                    {{ formatFileSize(storageSummary.total) }}</span
                  >
                  <span
                    >{{
                      Math.round(
                        (storageSummary.used / storageSummary.total) * 100
                      )
                    }}%</span
                  >
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width: `${
                        (storageSummary.used / storageSummary.total) * 100
                      }%`,
                    }"
                  ></div>
                </div>
              </div>

              <h4 class="section-title">File Type Breakdown</h4>
              <div class="file-type-breakdown">
                <div
                  v-for="(type, index) in fileTypeBreakdown"
                  :key="index"
                  class="file-type-item"
                >
                  <div class="type-icon" :class="type.id">
                    <Icon :icon="getFileTypeIcon(type.id)" />
                  </div>
                  <div class="type-bar">
                    <div class="type-info">
                      <span class="type-name">{{ type.name }}</span>
                      <span class="type-size">{{
                        formatFileSize(type.size)
                      }}</span>
                    </div>
                    <div class="type-progress-bar">
                      <div
                        class="type-progress-fill"
                        :class="type.id"
                        :style="{
                          width: `${(type.size / storageSummary.used) * 100}%`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="dashboard-card quick-actions">
          <div class="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="card-content">
            <div class="actions-grid">
              <router-link to="/storage" class="action-button">
                <Icon icon="hugeicons:upload-03" />
                <span>Upload File</span>
              </router-link>
              <router-link to="/storage" class="action-button">
                <Icon icon="mynaui:share" />
                <span>Share Records</span>
              </router-link>
              <router-link to="/chat" class="action-button">
                <Icon icon="fluent:chat-24-regular" />
                <span>Chat with AI</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
// Import the fileAPI from your actual file structure
import { fileAPI } from "./fileApi.js";
import { authAPI } from "./api.js"; // Import authAPI for user data

// Router for navigation
const router = useRouter();

// State data
const isLoading = ref(true);
const userData = ref(null);
const fileStats = ref({ total: 0, shared: 0, recent: 0 });
const recentFiles = ref([]);
const storageSummary = ref({ used: 0, total: 5 * 1024 * 1024 * 1024 }); // 5GB default
const fileTypeBreakdown = ref([]);
const sharedLinks = ref([]);

// Store IPFS gateway URL
const PINATA_GATEWAY_URL =
  import.meta.env.VITE_PINATA_GATEWAY_URL || "https://gateway.pinata.cloud";

// Format numbers with commas
const formatNumber = (num) => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format date to readable string
const formatDate = (dateString) => {
  if (!dateString) return "Today";
  const date = new Date(dateString);

  // Check if it's today
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Check if it's yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Otherwise return formatted date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get file icon based on file type
const getFileIcon = (fileType) => {
  if (!fileType) return "hugeicons:document-1";

  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return "hugeicons:file-pdf-01";
  if (type.includes("image") || type.includes("jpg") || type.includes("png"))
    return "hugeicons:image-01";
  if (type.includes("doc") || type.includes("word"))
    return "hugeicons:file-text-02";
  if (type.includes("xls") || type.includes("sheet"))
    return "hugeicons:file-spreadsheet-01";
  if (type.includes("ppt") || type.includes("presentation"))
    return "hugeicons:file-presentation-01";

  return "hugeicons:document-1";
};

// Format file size to human readable format
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

// Get last upload time in a readable format
const getLastUploadTime = () => {
  if (!recentFiles.value.length) return "N/A";

  const lastFile = recentFiles.value[0];
  const uploadDate = new Date(
    lastFile.createdAt || lastFile.createdat || lastFile.timestamp
  );
  const now = new Date();

  // If today
  if (uploadDate.toDateString() === now.toDateString()) {
    return `Today, ${uploadDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // If yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (uploadDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // If within last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  if (uploadDate > sevenDaysAgo) {
    return uploadDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  return uploadDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Get icon for file type
const getFileTypeIcon = (type) => {
  switch (type) {
    case "pdf":
      return "hugeicons:file-pdf-01";
    case "image":
      return "hugeicons:image-01";
    case "doc":
      return "hugeicons:file-text-02";
    case "spreadsheet":
      return "hugeicons:file-spreadsheet-01";
    case "presentation":
      return "hugeicons:file-presentation-01";
    case "archive":
      return "hugeicons:file-zip-01";
    case "video":
      return "hugeicons:video-01";
    case "audio":
      return "hugeicons:music-note-01";
    default:
      return "hugeicons:document-1";
  }
};

// Fetch user data
const fetchUserData = async () => {
  try {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to view your dashboard", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        theme: "colored",
      });
      router.push("/login");
      return;
    }

    try {
      // Use authAPI to get user data
      const data = await authAPI.getUserData();

      if (data) {
        // Handle case sensitivity in property names
        userData.value = {
          userId: data.userId || data.userid || data.userID,
          userName: data.userName || data.username || data.name || "User",
          email: data.email || data.Email,
          lastLoginDate: new Date(), // Since lastLoginDate is not stored in your backend
        };
        console.log("User data loaded:", userData.value);
        return;
      }
    } catch (apiError) {
      console.warn("Could not fetch user data:", apiError.message);
    }

    // Fallback to localStorage if API call fails
    const userName = localStorage.getItem("userName");

    if (userName) {
      userData.value = {
        userName: userName,
        email: localStorage.getItem("userEmail") || "",
        lastLoginDate: new Date(),
      };
      return;
    }

    // Final fallback
    userData.value = {
      userName: "AetherCure User",
      lastLoginDate: new Date(),
    };
  } catch (error) {
    console.error("Error in user data handling:", error);

    // Final fallback if everything fails
    userData.value = {
      userName: "User",
      lastLoginDate: new Date(),
    };
  }
};

// Fetch user files
const fetchUserFiles = async () => {
  try {
    // Use the fileAPI service to get user files
    const files = await fileAPI.getUserFiles();

    if (Array.isArray(files)) {
      // Normalize file objects for consistent property names
      const normalizedFiles = files.map((file) => ({
        ...file,
        fileId: file.fileId || file.fileid || file.id,
        fileName: file.fileName || file.filename || file.name || "Unnamed File",
        fileType: file.fileType || file.filetype || "application/octet-stream",
        fileSize: file.fileSize || file.filesize || 0,
        createdAt:
          file.createdAt || file.createdat || file.timestamp || new Date(),
        url: file.url || "",
        ipfsHash: file.ipfsHash || file.ipfshash || file.ipfs_pin_hash || "",
      }));

      // Sort by created date (newest first)
      const sortedFiles = [...normalizedFiles].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Take first 3 for recent files
      recentFiles.value = sortedFiles.slice(0, 3);

      // Calculate file statistics
      const now = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      fileStats.value = {
        total: normalizedFiles.length,
        recent: normalizedFiles.filter(
          (file) => new Date(file.createdAt) > weekAgo
        ).length,
        shared: 0, // Will update this with shared links count
      };

      // Calculate storage usage and breakdown
      calculateStorageStats(normalizedFiles);
    } else {
      console.error("Unexpected response format for files:", files);
      recentFiles.value = [];
    }
  } catch (error) {
    console.error("Error fetching user files:", error);
    toast.error(`Failed to load your files: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      theme: "colored",
    });
    recentFiles.value = [];
  }
};

// Fetch shared links
const fetchSharedLinks = async () => {
  try {
    // Use the fileAPI service to get shared links
    const links = await fileAPI.getSharedLinks();

    if (Array.isArray(links)) {
      sharedLinks.value = links;

      // Update shared files count with the actual number of shared links
      fileStats.value.shared = links.length;

      console.log(`Updated shared files count: ${links.length}`);
    } else {
      console.error("Unexpected response format for shared links:", links);
      sharedLinks.value = [];
      fileStats.value.shared = 0;
    }
  } catch (error) {
    console.error("Error fetching shared links:", error);
    sharedLinks.value = [];
    fileStats.value.shared = 0;
  }
};

// Calculate storage usage and file type breakdown
const calculateStorageStats = (files) => {
  if (!files || !files.length) return;

  // Calculate total used storage
  const totalSize = files.reduce(
    (total, file) => total + (file.fileSize || 0),
    0
  );
  storageSummary.value.used = totalSize;

  // Calculate breakdowns by file type
  const typeMap = new Map();

  files.forEach((file) => {
    const type = getFileTypeCategory(file.fileType);

    if (!typeMap.has(type.id)) {
      typeMap.set(type.id, {
        id: type.id,
        name: type.name,
        size: 0,
        count: 0,
      });
    }

    const typeData = typeMap.get(type.id);
    typeData.size += file.fileSize || 0;
    typeData.count += 1;
  });

  // Convert map to array and sort by size (largest first)
  fileTypeBreakdown.value = Array.from(typeMap.values()).sort(
    (a, b) => b.size - a.size
  );
};

// Get standardized file type category from MIME type
const getFileTypeCategory = (mimeType) => {
  if (!mimeType) return { id: "other", name: "Other" };

  const type = mimeType.toLowerCase();

  if (type.includes("pdf")) return { id: "pdf", name: "PDF Documents" };
  if (
    type.includes("image") ||
    type.includes("jpg") ||
    type.includes("png") ||
    type.includes("gif")
  )
    return { id: "image", name: "Images" };
  if (
    type.includes("word") ||
    type.includes("doc") ||
    type.includes("text/plain") ||
    type.includes("rtf")
  )
    return { id: "doc", name: "Documents" };
  if (
    type.includes("excel") ||
    type.includes("spreadsheet") ||
    type.includes("csv")
  )
    return { id: "spreadsheet", name: "Spreadsheets" };
  if (
    type.includes("presentation") ||
    type.includes("powerpoint") ||
    type.includes("ppt")
  )
    return { id: "presentation", name: "Presentations" };
  if (
    type.includes("zip") ||
    type.includes("rar") ||
    type.includes("tar") ||
    type.includes("gzip")
  )
    return { id: "archive", name: "Archives" };
  if (type.includes("video")) return { id: "video", name: "Videos" };
  if (type.includes("audio")) return { id: "audio", name: "Audio" };

  return { id: "other", name: "Other Files" };
};

// View file
const viewFile = (file) => {
  try {
    // Check for ipfsHash in different possible property names
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
    // Check for ipfsHash in different possible property names
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

// Load all data for dashboard
const loadDashboardData = async () => {
  isLoading.value = true;

  try {
    await Promise.all([fetchUserData(), fetchUserFiles(), fetchSharedLinks()]);

    isLoading.value = false;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    isLoading.value = false;

    toast.error("Failed to load dashboard data. Please refresh the page.", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      theme: "colored",
    });
  }
};

// Lifecycle hooks
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
/* Dashboard Layout */

.dashboard-container {
  padding: 1.5rem;
  margin-left: 0; /* Remove this margin - already handled by parent */
  margin-top: 30rem; /* Remove this margin - already handled by parent */
  width: 100%; /* Full width */
  max-width: 100%;
  overflow-x: hidden;
}

/* Welcome Banner */
.welcome-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    to right,
    var(--accent-color),
    var(--accent-color-secondary, #9c88ff)
  );
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%; /* Ensure full width of container */
}

.user-welcome h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-welcome p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.system-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  padding: 0.5rem 1rem;
}

.stat-item svg {
  font-size: 1.25rem;
}

.stat-item span {
  font-weight: 500;
}

.metric-value.last-upload {
  font-size: 1.2rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background-color: var(--secondary-bg);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: var(--accent-bg, rgba(var(--accent-color-rgb), 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.metric-icon svg {
  font-size: 1.5rem;
  color: var(--accent-color);
}

.metric-content {
  flex: 1;
}

.metric-content h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.metric-content p {
  font-size: 0.8rem;
  color: var(--text-tertiary, #999);
}

/* Dashboard Cards Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background-color: var(--secondary-bg);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.dashboard-card.recent-files {
  grid-column: span 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-content {
  padding: 1.25rem;
  flex: 1;
}

/* Storage Stats Section */
.storage-progress {
  margin-bottom: 1.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.progress-bar {
  height: 0.5rem;
  background-color: var(--main-bg);
  border-radius: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #36a2eb, #8884d8);
  border-radius: 1rem;
  transition: width 1s ease;
}

.section-title {
  font-size: 1rem;
  margin: 1.5rem 0 1rem;
  color: var(--text-secondary);
}

.file-type-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .dashboard-container {
    margin-left: 0;
    width: 100%;
  }
}

.file-type-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.type-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-bg);
}

.type-icon svg {
  font-size: 1.25rem;
  color: var(--accent-color);
}

.type-icon.pdf svg {
  color: #ff6384;
}

.type-icon.image svg {
  color: #36a2eb;
}

.type-icon.doc svg {
  color: #4bc0c0;
}

.type-icon.spreadsheet svg {
  color: #97e265;
}

.type-icon.presentation svg {
  color: #ff9f40;
}

.type-icon.archive svg {
  color: #8884d8;
}

.type-icon.video svg {
  color: #ff6384;
}

.type-icon.audio svg {
  color: #ffcd56;
}

.type-bar {
  flex: 1;
}

.type-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.type-name {
  font-size: 0.9rem;
}

.type-size {
  font-size: 0.8rem;
  color: var(--text-tertiary, #999);
}

.type-progress-bar {
  height: 0.35rem;
  background-color: var(--main-bg);
  border-radius: 0.5rem;
  overflow: hidden;
}

.type-progress-fill {
  height: 100%;
  background-color: var(--accent-color);
  border-radius: 0.5rem;
  transition: width 1s ease;
}

.type-progress-fill.pdf {
  background-color: #ff6384;
}

.type-progress-fill.image {
  background-color: #36a2eb;
}

.type-progress-fill.doc {
  background-color: #4bc0c0;
}

.type-progress-fill.spreadsheet {
  background-color: #97e265;
}

.type-progress-fill.presentation {
  background-color: #ff9f40;
}

.type-progress-fill.archive {
  background-color: #8884d8;
}

.type-progress-fill.video {
  background-color: #ff6384;
}

.type-progress-fill.audio {
  background-color: #ffcd56;
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--main-bg);
  border: none;
  border-radius: 0.75rem;
  padding: 1.25rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: var(--text-primary);
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: var(--accent-bg, rgba(var(--accent-color-rgb), 0.1));
}

.action-button svg {
  font-size: 1.5rem;
  color: var(--accent-color);
  margin-bottom: 0.75rem;
}

.action-button span {
  font-size: 0.85rem;
  font-weight: 500;
}

/* Recent Files */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  background-color: var(--main-bg);
  padding: 0.75rem;
  border-radius: 0.75rem;
}

.file-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.file-icon svg {
  font-size: 1.5rem;
  color: var(--accent-color);
}

.file-details {
  flex: 1;
}

.file-details h4 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.file-details p {
  font-size: 0.75rem;
  color: var(--text-tertiary, #999);
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: var(--accent-bg, rgba(var(--accent-color-rgb), 0.1));
}

.icon-button svg {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

/* Empty States */
.empty-files {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  height: 100%;
  min-height: 200px;
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-files p {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.accent-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  font-size: 0.9rem;
  text-decoration: none;
}

.accent-button:hover {
  opacity: 0.9;
}

.accent-button svg {
  font-size: 1rem;
}

/* No Data States */
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: var(--text-secondary);
}

/* Loading Animation */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 1.5rem;
  justify-content: center;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  animation-delay: -0.9s;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-card.recent-files {
    grid-column: span 1;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
