<template>
  <aside 
    class="app-sidebar" 
    :class="{ 'mobile-open': mobileMenuOpen }"
  >
    <nav class="sidebar-nav">
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
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 1rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  margin: 0.5rem 0;
  background-color: var(--secondary-bg);
  color: var(--text-secondary);
  font-size: var(--font-size-base);
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
</style>
  
  <script setup>
  import { Icon } from '@iconify/vue'
  
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
    { id: 'video', label: 'Video Call', icon: 'hugeicons:video-01' }
  ]
  </script>