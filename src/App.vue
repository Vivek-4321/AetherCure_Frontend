<template>
  <div class="app" :class="currentTheme">
    <TheHeader 
      @toggle-theme="toggleTheme"
      @toggle-mobile-menu="toggleMobileMenu"
      :theme="theme"
      :mobile-menu-open="isMobileMenuOpen"
    />
    
    <div class="app-container">
      <TheSidebar 
        :active-tab="activeTab" 
        @change-tab="changeTab"
        :mobile-menu-open="isMobileMenuOpen"
        :theme="theme"
      />
      
      <main class="main-content">
        
        <keep-alive>
          <component :is="currentComponent" :key="activeTab">
        
          </component>
        </keep-alive>
      </main>
    
    </div>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import { Icon } from '@iconify/vue'

// Import all components dynamically
import Dashboard from './components/Dashboard.vue'
import SymptomChecker from './components/SymptomChecker.vue'
import DataCollection from './components/DataCollection.vue'
import StorageVault from './components/StorageVault.vue'
import EnvironmentalHealth from './components/EnvironmentalHealth.vue'
import HealthNews from './components/HealthNews.vue'
import HealthBot from './components/HealthBot.vue'
import Challenges from './components/Challenges.vue'
import HealthMap from './components/HealthMap.vue'
import OutbreakAlerts from './components/OutbreakAlerts.vue'
import TheHeader from './components/TheHeader.vue'
import TheSidebar from './components/TheSidebar.vue'

const theme = ref('dark')
const isMobileMenuOpen = ref(false)
const activeTab = ref('dashboard')

const components = {
  dashboard: Dashboard,
  symptoms: SymptomChecker,
   data:DataCollection,
  vault: StorageVault,
  environmental: EnvironmentalHealth,
  news: HealthNews,
  bot: HealthBot,
  challenges: Challenges,
  map: HealthMap,
  outbreaks: OutbreakAlerts
}

const currentComponent = computed(() => components[activeTab.value])

const currentTheme = computed(() => 
  theme.value === 'dark' ? 'dark-theme' : 'light-theme'
)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function changeTab(tab) {
  activeTab.value = tab
  isMobileMenuOpen.value = false
}
</script>

<style>

.app {
  min-height: 100vh;
  background-color: var(--main-bg);
  color: var(--text-primary);
}

.app-container {
  display: flex;
  padding-top: 73px;
}

.main-content {
  flex-grow: 1;
  margin-left: 17.5rem;
}

@media (max-width:768px) {
<<<<<<< HEAD
  .main-content {
    width: 100%;
    margin-left: 0rem;
  }
=======
 
  .main-content{
    display: block;
    margin-left: 0.1rem;
  }
  
>>>>>>> origin/f9dde7d9-1d82-4849-a00d-a3bb9cf11f57
}
</style>
