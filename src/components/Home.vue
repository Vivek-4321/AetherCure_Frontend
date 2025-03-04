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
          <component :is="currentComponent" :key="activeTab"> </component>
        </keep-alive>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from "vue";
import { Icon } from "@iconify/vue";

// Import all components dynamically
import Dashboard from "./Dashboard.vue";
import SymptomChecker from "./SymptomChecker.vue";
import DataCollection from "./DataCollection.vue";
import StorageVault from "./StorageVault.vue";
import EnvironmentalHealth from "./EnvironmentalHealth.vue";
import HealthNews from "./HealthNews.vue";
import HealthBot from "./HealthBot.vue";
import Challenges from "./Challenges.vue";
import HealthMap from "./HealthMap.vue";
import OutbreakAlerts from "./OutbreakAlerts.vue";
import TheHeader from "./TheHeader.vue";
import TheSidebar from "./TheSidebar.vue";
import Video from "./Video.vue";

const theme = ref("dark");
const isMobileMenuOpen = ref(false);
const activeTab = ref("dashboard");

const components = {
  dashboard: Dashboard,
  symptoms: SymptomChecker,
  data: DataCollection,
  vault: StorageVault,
  environmental: EnvironmentalHealth,
  news: HealthNews,
  bot: HealthBot,
  challenges: Challenges,
  map: HealthMap,
  outbreaks: OutbreakAlerts,
  video: Video,
};

const currentComponent = computed(() => components[activeTab.value]);

const currentTheme = computed(() =>
  theme.value === "dark" ? "dark-theme" : "light-theme"
);

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function changeTab(tab) {
  activeTab.value = tab;
  isMobileMenuOpen.value = false;
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
  padding-top: 73px; /* Account for fixed header */
}

.main-content {
 
  margin-left: 10rem; /* Match sidebar width */
  width: 83vw !important;
}

@media (max-width: 768px) {
  .main-content {
    width: 100%;
    margin-left: 0;
  }
}
</style>
