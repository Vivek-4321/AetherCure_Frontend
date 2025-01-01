<template>
  <div class="app-container">
    <!-- Header -->
    <div class="header">
      <button @click="goBack" class="back-btn">
        <Icon icon="hugeicons:arrow-left-02" style="font-size: 24px" />
      </button>
      <div class="current-time">{{ currentTime }}</div>
    </div>

    <!-- Username Modal -->
    <div v-if="!username" class="username-modal">
      <div class="username-modal-content">
        <h2>Enter Your Name</h2>
        <input
          v-model="usernameInput"
          @keyup.enter="setUsername"
          placeholder="Enter your name"
          class="username-input"
        />
        <button @click="setUsername" class="primary-btn">Join Room</button>
      </div>
    </div>

    <!-- Main video grid -->
    <div v-else class="video-grid">
      <!-- Local video -->
      <div class="video-container local" :class="{ 'video-off': isVideoOff }">
        <video ref="localVideo" autoplay muted></video>
        <div class="video-overlay">
          <div class="user-info">
            <div class="user-avatar" v-if="isVideoOff">
              {{ username.slice(0, 1).toUpperCase() }}
            </div>
            <span class="user-name">You ({{ username }})</span>
          </div>
        </div>
      </div>

      <!-- Remote video -->
      <div
        class="video-container remote"
        :class="{ 'no-user': !hasRemoteStream }"
      >
        <video ref="remoteVideo" autoplay></video>
        <div class="video-overlay">
          <div v-if="!hasRemoteStream" class="waiting-message">
            <div class="pulse-animation"></div>
            <span>Waiting for someone to join...</span>
          </div>
          <div v-else class="user-info">
            <div class="user-avatar" v-if="!hasRemoteVideo">
              {{ remoteUsername?.slice(0, 1).toUpperCase() }}
            </div>
            <span class="user-name">{{ remoteUsername }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Control bar (now directly under videos) -->
    <div v-if="username" class="control-bar">
      <div class="control-buttons">
        <button
          @click="toggleMute"
          :class="{ active: !isAudioMuted }"
          class="control-btn"
        >
          <Icon
            :icon="isAudioMuted ? 'hugeicons:mic-off-01' : 'hugeicons:mic-01'"
            style="font-size: 24px"
            class="btn-icon"
          />
          <!-- <span class="btn-text">{{ isAudioMuted ? 'Unmute' : 'Mute' }}</span> -->
        </button>

        <button
          @click="toggleVideo"
          :class="{ active: !isVideoOff }"
          class="control-btn"
        >
          <Icon
            :icon="isVideoOff ? 'hugeicons:video-off' : 'hugeicons:video-02'"
            style="font-size: 24px"
            class="btn-icon"
          />
          <!-- <span class="btn-text">{{ isVideoOff ? 'Start Video' : 'Stop Video' }}</span> -->
        </button>

        <button
          @click="toggleScreenShare"
          :class="{ active: isScreenSharing }"
          class="control-btn"
        >
          <Icon
            icon="hugeicons:presentation-01"
            style="font-size: 24px"
            class="btn-icon"
          />
        </button>

        <button @click="endCall" class="control-btn end-call">
          <Icon
            icon="hugeicons:call-disabled-02"
            class="btn-icon"
            style="font-size: 24px"
          />
          <!-- <span class="btn-text">End Call</span> -->
        </button>

        <div class="user-controls" v-if="!isCallActive && users.length > 0">
          <select
            v-model="selectedUser"
            :disabled="!isRoomJoined"
            class="user-select"
          >
            <option :value="null">Select user to call</option>
            <option v-for="user in users" :key="user.id" :value="user">
              {{ user.username }}
            </option>
          </select>
          <button
            @click="startCall"
            :disabled="!isRoomJoined || !selectedUser"
            class="call-btn"
          >
            Start Call
          </button>
        </div>
      </div>
    </div>

    <Transition name="slide-fade">
      <div v-if="showIncomingCall" class="incoming-call">
        <div class="incoming-call-content">
          <div class="caller-info">
            <div class="caller-avatar">
              {{ incomingCallData?.fromUsername.slice(0, 1).toUpperCase() }}
            </div>
            <h3>Incoming Call</h3>
            <p>from {{ incomingCallData?.fromUsername }}</p>
          </div>
          <div class="call-actions">
            <button @click="answerCall" class="answer-btn">
              <Icon icon="hugeicons:mic-01" class="btn-icon" />
              Accept
            </button>
            <button @click="rejectCall" class="reject-btn">
              <Icon icon="hugeicons:call-disabled-02" class="btn-icon" />
              Decline
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";
import { Icon } from "@iconify/vue";

const route = useRoute();
const router = useRouter();
const socket = io("https://socket-server-arh3.onrender.com");

// Refs for videos and state
const localVideo = ref(null);
const remoteVideo = ref(null);
const selectedUser = ref(null);
const users = ref([]);
const showIncomingCall = ref(false);
const isRoomJoined = ref(false);
const isAudioMuted = ref(false);
const isVideoOff = ref(false);
const hasRemoteVideo = ref(false);
const username = ref("");
const usernameInput = ref("");
const hasRemoteStream = ref(false);
const remoteUsername = ref("");
const isScreenSharing = ref(false);
const isCallActive = ref(false);
let screenStream = null;

const toggleScreenShare = async () => {
  try {
    if (!isScreenSharing.value) {
      // Start screen sharing
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Store the original video track enabled state
      const originalVideoEnabled = localStream.getVideoTracks()[0]?.enabled;

      // Replace video track in all peer connections
      const screenVideoTrack = screenStream.getVideoTracks()[0];

      if (peerConnection) {
        const senders = peerConnection.getSenders();
        const videoSender = senders.find(
          (sender) => sender.track?.kind === "video"
        );
        if (videoSender) {
          videoSender.replaceTrack(screenVideoTrack);
        }
      }

      // Show screen share in local video without affecting the video-off state
      localVideo.value.srcObject = screenStream;
      isScreenSharing.value = true;

      // Maintain original video enabled state
      screenVideoTrack.enabled = true;
      isVideoOff.value = false; // Don't blur the screen share preview

      // Listen for screen share stop
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenSharing(originalVideoEnabled);
      };
    } else {
      stopScreenSharing();
    }
  } catch (error) {
    console.error("Error sharing screen:", error);
    isScreenSharing.value = false;
  }
};

const stopScreenSharing = async (restoreVideoState = true) => {
  if (screenStream) {
    screenStream.getTracks().forEach((track) => track.stop());

    // Restore original video track
    if (peerConnection && localStream) {
      const senders = peerConnection.getSenders();
      const videoSender = senders.find(
        (sender) => sender.track?.kind === "video"
      );
      if (videoSender) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoSender.replaceTrack(videoTrack);
          // Restore the original video state if specified
          videoTrack.enabled = restoreVideoState;
          isVideoOff.value = !restoreVideoState;
        }
      }
    }

    // Restore local video preview
    localVideo.value.srcObject = localStream;
    screenStream = null;
    isScreenSharing.value = false;
  }
};

const toggleVideo = () => {
  if (isScreenSharing.value) {
    // If screen sharing is active, stop it first
    stopScreenSharing(false); // Pass false to indicate we want video off after stopping
  }

  if (localStream) {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      isVideoOff.value = !videoTrack.enabled;
    }
  }
};

// Update these functions to manage call state
const startCall = async () => {
  if (!selectedUser.value) return;

  peerConnection = new RTCPeerConnection(configuration);
  setupPeerConnection();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("call-user", {
      to: selectedUser.value.id,
      offer: offer,
      fromUsername: username.value,
    });
    isCallActive.value = true; // Set call as active when starting call
  } catch (error) {
    console.error("Error creating offer:", error);
  }
};

function goBack() {
  window.location.href = "/";
}

let localStream = null;
let peerConnection = null;
let incomingCallData = null;

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "f5baae95181d1a3b2947f791",
      credential: "n67tiC1skstIO4zc",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "f5baae95181d1a3b2947f791",
      credential: "n67tiC1skstIO4zc",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "f5baae95181d1a3b2947f791",
      credential: "n67tiC1skstIO4zc",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "f5baae95181d1a3b2947f791",
      credential: "n67tiC1skstIO4zc",
    },
  ],
};

// Add current time ref and function
const currentTime = ref("");

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const setUsername = async () => {
  if (usernameInput.value.trim()) {
    username.value = usernameInput.value.trim();
    await joinRoom();
  }
};

// Main functions
const joinRoom = async () => {
  const roomId = route.params.roomId;
  if (!roomId) {
    window.location.href = "/";
    return;
  }

  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.value.srcObject = localStream;

    socket.emit("join-room", {
      roomId,
      username: username.value,
    });
    isRoomJoined.value = true;
  } catch (error) {
    console.error("Error accessing media devices:", error);
    window.location.href = "/";
  }
};

const toggleMute = () => {
  if (localStream) {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    isAudioMuted.value = !audioTrack.enabled;
  }
};

const setupPeerConnection = () => {
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        to: incomingCallData ? incomingCallData.from : selectedUser.value.id,
        candidate: event.candidate,
      });
    }
  };

  peerConnection.ontrack = (event) => {
    remoteVideo.value.srcObject = event.streams[0];
    hasRemoteVideo.value = true;
    hasRemoteStream.value = true;
    // Set remote username based on who initiated the call
    remoteUsername.value = incomingCallData
      ? incomingCallData.fromUsername
      : selectedUser.value.username;
  };
};

const answerCall = async () => {
  showIncomingCall.value = false;

  peerConnection = new RTCPeerConnection(configuration);
  setupPeerConnection();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  try {
    await peerConnection.setRemoteDescription(incomingCallData.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("call-accepted", {
      to: incomingCallData.from,
      answer: answer,
      fromUsername: username.value,
    });
    isCallActive.value = true; // Set call as active when answering call
  } catch (error) {
    console.error("Error answering call:", error);
  }
};

const endCall = () => {
  if (peerConnection) {
    peerConnection.close();
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
  if (screenStream) {
    screenStream.getTracks().forEach((track) => track.stop());
  }
  // Reset states
  hasRemoteStream.value = false;
  remoteUsername.value = "";
  hasRemoteVideo.value = false;
  isCallActive.value = false; // Reset call active state
  window.location.href = "/";
};

const rejectCall = () => {
  showIncomingCall.value = false;
  incomingCallData = null;
};

// Socket event listeners
onMounted(() => {
  socket.on("user-connected", (connectedUsers) => {
    users.value = connectedUsers.filter((user) => user.id !== socket.id);
  });

  // Add time update interval
  updateTime();
  const timeInterval = setInterval(updateTime, 60000);

  socket.on("user-joined", (user) => {
    if (user.id !== socket.id) {
      users.value.push(user);
    }
  });

  socket.on("incoming-call", async (data) => {
    incomingCallData = data;
    showIncomingCall.value = true;
  });

  socket.on("call-accepted", async (data) => {
    try {
      await peerConnection.setRemoteDescription(data.answer);
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  });

  socket.on("ice-candidate", async (data) => {
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(data.candidate);
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  });

  socket.on("user-disconnected", (user) => {
    users.value = users.value.filter((u) => u.id !== user.id);
  });
});

onUnmounted(() => {
  clearInterval(timeInterval);
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
  if (screenStream) {
    screenStream.getTracks().forEach((track) => track.stop());
  }
  if (peerConnection) {
    peerConnection.close();
  }
  socket.disconnect();
});
</script>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  padding-top: -1rem;
  z-index: 100;
  background-color: var(--main-bg);
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--common-white);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.current-time {
  color: var(--common-white);
  font-size: 1rem;
  font-weight: 500;
}

.username-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.username-modal-content {
  background: var(--secondary-bg);
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.username-input {
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--main-bg);
  color: var(--text-primary);
}

.primary-btn {
  background: var(--accent-color);
  color: var(--common-white);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

/* Enhanced Video Grid */
.video-grid {
  padding-top: 2rem; /* Reduced from 4rem */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 1.5rem;
  margin-top: -1rem;
  height: calc(100vh - 160px); /* Adjusted to account for reduced top padding */
}

.video-container {
  position: relative;
  background: var(--secondary-bg);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.video-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.video-container.video-off video {
  filter: blur(10px);
}

.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-container:hover .video-overlay {
  opacity: 1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--common-white);
}

.user-avatar {
  width: 42px;
  height: 42px;
  background: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Enhanced Control Bar */
.control-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main-bg);
}

.control-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  background: var(--main-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.control-btn.share-screen {
  position: relative;
  overflow: hidden;
}

.control-btn.share-screen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--accent-color);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.control-btn.share-screen:hover::before {
  opacity: 0.1;
}

/* Responsive adjustments for screen sharing */
@media (max-width: 768px) {
  .video-grid {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .control-buttons {
    grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
    padding: 0.5rem;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .control-btn {
    width: 48px;
    height: 48px;
    padding: 0.5rem;
  }

  .btn-icon {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .control-buttons {
    gap: 0.25rem;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }

  .btn-icon {
    font-size: 18px;
  }
}

/* Active state for screen sharing */
.control-btn.active {
  background: var(--accent-color);
  color: var(--common-white);
  transform: scale(1.05);
}

.control-btn:hover {
  background: var(--accent-color);
  color: var(--common-white);
  transform: translateY(-2px);
}

.control-btn.active {
  background: var(--accent-color);
  color: var(--common-white);
}

.end-call {
  background: #ea4335;
  color: var(--common-white);
}

.end-call:hover {
  background: #dc2626;
}

/* Enhanced User Controls */
.user-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-select {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--main-bg);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all 0.2s ease;
}

.user-select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.call-btn {
  background: var(--accent-color);
  color: var(--common-white);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.call-btn:hover:not(:disabled) {
  background: var(--hover-accent);
  transform: translateY(-2px);
}

.call-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

/* Incoming Call Animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Enhanced Incoming Call UI */
.incoming-call {
  position: fixed;
  top: 4rem;
  right: 2rem;
  background: var(--secondary-bg);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  animation: slideUp 0.3s ease-out;
  border: 1px solid var(--border-color);
  max-width: 300px;
  width: calc(100% - 2rem);
  color: var(--text-primary);
}

/* Vibrating call animation */
@keyframes vibrate {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

.incoming-call-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: vibrate 0.3s linear infinite;
}

/* Enhanced caller avatar animation */
@keyframes ringPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb), 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(var(--accent-color-rgb), 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb), 0);
  }
}

.caller-avatar {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.5rem;
  animation: ringPulse 1.5s infinite;
  position: relative;
}

/* Add ringing circles animation */
.caller-avatar::before,
.caller-avatar::after {
  content: "";
  position: absolute;
  border: 3px solid var(--accent-color);
  border-radius: 50%;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  animation: ripple 1.5s linear infinite;
}

.caller-avatar::after {
  animation-delay: 0.75s;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.caller-info {
  text-align: center;
}

.call-actions {
  display: flex;
  gap: 1rem;
}

.answer-btn,
.reject-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.answer-btn {
  background: var(--accent-color);
  color: var(--common-white);
}

.reject-btn {
  background: #ea4335;
  color: var(--common-white);
}

/* Responsive Design */
@media (max-width: 768px) {
  .video-grid {
    padding-top: 1rem;
    height: calc(100vh - 120px);
  }

  .control-bar {
    padding: 0.75rem;
  }

  .control-buttons {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .user-controls {
    width: 100%;
    margin-top: 0.5rem;
  }

  .btn-text {
    display: none;
  }

  .control-btn {
    padding: 0.5rem;
  }

  .video-container {
    height: 50vh;
  }

  .video-container.remote {
    height: calc(50vh - 70px);
  }
}

/* Loading Animation */
.waiting-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--common-white);
}

.pulse-animation {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent-color);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 16px rgba(79, 70, 229, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
  }
}
</style>
