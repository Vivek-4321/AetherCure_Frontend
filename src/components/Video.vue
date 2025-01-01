<template>
    <div class="instant-meeting-container">
      <!-- Header -->
      <div class="video-header">
        <h1 class="page-title">Start Instant Meeting</h1>
        <div class="current-time">{{ currentTime }}</div>
      </div>
  
      <div class="meeting-content">
        <!-- Create Meeting Card -->
        <div class="meeting-card">
          <div class="card-content">
            <div class="meeting-icon">
              <Icon icon="hugeicons:video-02" class="icon-large" />
            </div>
            
            <h2 class="meeting-title">Create New Meeting</h2>
            <p class="meeting-description">
              Start an instant video meeting with a unique room ID
            </p>
  
            <div class="meeting-actions">
              <button @click="createMeeting" class="create-btn" v-if="!meetingId">
                <Icon 
                  icon="hugeicons:add-01" 
                  class="btn-icon"
                />
                Create Meeting
              </button>
  
              <!-- Meeting ID and Share Options -->
              <div v-if="meetingId" class="meeting-info">
                <div class="meeting-id">
                  <span>Meeting ID: {{ meetingId }}</span>
                  <button @click="copyMeetingId" class="icon-btn">
                    <Icon 
                      icon="hugeicons:copy-01" 
                      class="icon-small"

                    />
                  </button>
                </div>
  
                <div class="share-options">
                  <button @click="shareMeetingByEmail" class="share-btn">
                    <Icon 
                      icon="hugeicons:mail-02" 
                      class="btn-icon"
                    />
                    Share via Email
                  </button>
                  
                  <button @click="joinMeeting" class="create-btn">
                    <Icon 
                      icon="hugeicons:cloud-upload" 
                      class="btn-icon"
                    />
                    Join Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Icon } from '@iconify/vue';
  
  const router = useRouter();
  const currentTime = ref('');
  const meetingId = ref('');
  
  // Update time function
  const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  // Generate random meeting ID
  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 8);
  };
  
  // Create meeting without immediate redirect
  const createMeeting = () => {
    const newMeetingId = generateMeetingId();
    meetingId.value = newMeetingId;
  };
  
  // Join meeting function
  const joinMeeting = () => {
    router.push(`/videoCall/${meetingId.value}`);
  };
  
  // Copy meeting ID to clipboard
  const copyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(meetingId.value);
      alert('Meeting ID copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy meeting ID:', err);
    }
  };
  
  // Share meeting via email
  const shareMeetingByEmail = () => {
    const meetingLink = `${window.location.origin}/videoCall/${meetingId.value}`;
    const subject = 'Join My Video Meeting';
    const body = `Join my video meeting using this link: ${meetingLink}\n\nMeeting ID: ${meetingId.value}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  // Lifecycle hooks
  onMounted(() => {
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
  
    // Cleanup interval on unmount
    onUnmounted(() => {
      clearInterval(timeInterval);
    });
  });
  </script>
  
  <style scoped>
  .instant-meeting-container {
    min-height: 70vh;
    background-color: var(--main-bg);
    padding: 2rem;
    border-radius: 1rem;
  }
  
  .video-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }
  
  .page-title {
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .current-time {
    color: var(--text-primary);
    font-size: 1rem;
  }
  
  .meeting-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 8rem);
  }
  
  .meeting-card {
    background: var(--secondary-bg);
    border-radius: 20px;
    padding: 2.5rem;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .meeting-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
  }
  
  .meeting-icon {
    width: 80px;
    height: 80px;
    background: var(--accent-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
  }
  
  .icon-large {
    font-size: 48px;
  }
  
  .icon-small {
    font-size: 20px;
  }
  
  .btn-icon {
    font-size: 24px;
  }
  
  .meeting-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .meeting-description {
    color: var(--text-secondary);
    font-size: 1rem;
  }
  
  .meeting-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }
  
  .create-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    background: var(--accent-color);
    color: var(--text-primary);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background-color 0.2s ease;
  }
  
  .create-btn:hover {
    background: var(--accent-color);
  }
  
  .meeting-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .meeting-id {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--main-bg);
    border-radius: 12px;
    color: var(--text-primary);
  }
  
  .icon-btn {
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  
  .icon-btn:hover {
    background: var(--accent-color);
  }
  
  .share-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--secondary-bg);
    border: 1px solid var(--accent-color);
    color: var(--text-primary);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .share-btn:hover {
    background: var(--accent-color);
  }
  
  @media (max-width: 640px) {
    .instant-meeting-container {
      padding: 1rem;
    }
  
    .meeting-card {
      padding: 1.5rem;
    }
  
    .meeting-icon {
      width: 60px;
      height: 60px;
    }
  
    .icon-large {
      font-size: 36px;
    }
  
    .meeting-title {
      font-size: 1.25rem;
    }
    
    .create-btn,
    .share-btn {
      padding: 0.75rem;
    }
  }
  </style>