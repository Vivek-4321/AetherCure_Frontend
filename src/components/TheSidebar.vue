<template>
  <aside
    class="app-sidebar"
    :class="{ 'mobile-open': mobileMenuOpen }"
  >
    <nav class="sidebar-nav">
      <div class="nav-sections">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="$emit('change-tab', item.id)"
          class="sidebar-item"
          :class="{ 'active': activeTab === item.id }"
        >
          <Icon :icon="item.icon" />
          <span>{{ item.label }}</span>
        </button>
      </div>
      
      <div class="logout-container">
        <div class="divider"></div>
        <button @click="handleLogout" class="sidebar-item logout-btn">
          <Icon icon="mdi-light:logout" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.app-sidebar {
  background-color: var(--secondary-bg);
  width: 270px;
  height: calc(100vh - 73px);
  position: fixed;
  top: 73px;
  border-right: 1px solid var(--border-color);
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    z-index: 4000;
  }
  
  .app-sidebar.mobile-open {
    transform: translateX(0);
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 1rem;
}

.nav-sections {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  margin: 0.5rem 0;
  background-color: var(--secondary-bg);
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  text-align: left;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease-in;
}

.sidebar-item span {
  margin-left: 0.7rem;
}

.sidebar-item svg {
  font-size: 24px;
}

.sidebar-item:hover {
  background-color: var(--accent-color);
  color: var(--common-white);
}

.sidebar-item.active {
  background-color: var(--accent-color);
  color: var(--common-white);
}

.logout-container {
  margin-top: auto;
  width: 100%;
}

.divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 0.5rem 0;
  width: 100%;
}

.logout-btn {
  color: #e53e3e;
  font-weight: 500;
}

.logout-btn:hover {
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  border: 1px solid #e53e3e;
}
</style>
    
<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()

defineProps({
  activeTab: { type: String, default: 'dashboard' },
  mobileMenuOpen: { type: Boolean, default: false },
  theme: { type: String, default: 'dark' }
})
    
defineEmits(['change-tab'])
    
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'hugeicons:home-03' },
  { id: 'symptoms', label: 'Symptom Checker', icon: 'hugeicons:heart-add' },
  { id: 'data', label: 'Data Collection', icon: 'hugeicons:clipboard' },
  { id: 'vault', label: 'Storage Vault', icon: 'hugeicons:folder-file-storage' },
  { id: 'environmental', label: 'Environmental Health', icon: 'hugeicons:fast-wind' },
  { id: 'news', label: 'Health News', icon: 'hugeicons:news' },
  { id: 'bot', label: 'Health Bot', icon: 'hugeicons:bubble-chat' },
  // { id: 'challenges', label: 'Challenges', icon: 'hugeicons:workout-run' },
  { id: 'map', label: 'Health Map', icon: 'hugeicons:maps-location-02' },
  { id: 'outbreaks', label: 'Outbreak Alerts', icon: 'hugeicons:triangle' },
  // { id: 'video', label: 'Video Call', icon: 'hugeicons:video-01' }
]

const handleLogout = () => {
  // Clear authentication data
  localStorage.removeItem('authToken')
  localStorage.removeItem('userId')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  
  // Show success message
  toast.success('Logged out successfully', {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    theme: 'colored'
  })
  
  // Redirect to login page
  router.push('/login')
}
</script>