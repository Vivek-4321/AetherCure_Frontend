<!-- TheHeader.vue -->
<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <img src="/logo.png" alt="Aether Cure Logo" class="logo-image" />
      </div>
      
      <div class="header-actions">                     
        <TranslateWidget />
        
        <button @click="toggleTheme" class="theme-toggle">
          <Icon
            :icon="theme === 'dark' ? 'hugeicons:moon-02': 'hugeicons:sun-02'"
            :style="{ fontSize: '25px', color: 'var(--text-secondary)' }"
          />
        </button>
        
        <button
          @click="$emit('toggle-mobile-menu')"
          class="mobile-menu-toggle"
        >
          <Icon :icon="mobileMenuOpen ? 'mdi:close' : 'mdi:menu'" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useTheme } from './useTheme.js'
import TranslateWidget from './TranslateWidget.vue'

const { theme, toggleTheme } = useTheme()

defineProps({
  theme: { type: String, default: 'dark' },
  mobileMenuOpen: { type: Boolean, default: false }
})

defineEmits(['toggle-theme', 'toggle-mobile-menu'])

const showNotifications = ref(false)
const notifications = [
  {
    id: 1,
    title: 'New Disease Outbreak Alert',
    message: 'Influenza A outbreak detected in Metropolitan Area',
    type: 'alert',
    time: '2 hours ago'
  },
  {
    id: 2,
    title: 'Health Tip',
    message: 'High pollen count today. Take necessary precautions if allergic.',
    type: 'info',
    time: '5 hours ago'
  }
]

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

</script>

<style scoped>
.app-header {
  background-color: var(--secondary-bg);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 50;
  height: 4.1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.logo-section {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin-left: 1.2rem;
}

.logo-image {
  height: 2rem;
  width: 5rem;
  margin-right: 0.5rem;
  object-fit: cover; /* Changed from 'cover' to 'contain' */
  image-rendering: -webkit-optimize-contrast; /* Improves image rendering in Chrome */
  image-rendering: crisp-edges; /* Improves image rendering in Firefox */
}

.header-actions {
  display: flex;
  align-items: center;
}

.notifications {
  position: relative;
  margin-right: 1rem;
  
  svg {
    color: var(--text-secondary);
  }
}

.notification-btn {
  background: none;
  border: none;
  cursor: pointer;
  
  svg{
    font-size: 24px;
  }
}

.notification-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 20rem;
}

.notification-list {
  max-height: 15rem;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.notification-item p {
  margin: 0;
}

.mobile-menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: none;
}

.mobile-menu-toggle svg {
  font-size: 1rem;
}
 
.theme-toggle{
  margin-left: 0.6rem;
  background: none;
  border: none;
  color: var(--text-primary);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  
  svg{
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .logo-section{
    margin-left: 0.6rem;
    font-size: 10px;
    
    h1{
      display: none;
    }
  }
  
  .logo-image {
    height: 1.8rem;
  }
  
  .mobile-menu-toggle{
    display: block;
    color: var(--text-primary);
    margin-left: 0.6rem;
    
    svg {
      font-size: 2rem;
    }
  }
}
 
</style>