<!-- <template>
    <div class="translate-widget">
    <div id="google_translate_element"></div>
  </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  
  function initGoogleTranslate() {
    const addScript = document.createElement('script')
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    )
    document.body.appendChild(addScript)
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          includedLanguages: '', // leave empty for all languages or specify comma-separated language codes
        },
        'google_translate_element'
      )
    }
  }
  
  onMounted(() => {
    initGoogleTranslate()
  })
  </script>
  
  <style scoped>
  .translate-widget {
    display: inline-block;
    margin-right: 1rem;
  }
  
  /* Modern styling for the translate widget */
  :deep(.goog-te-gadget) {
    font-family: inherit;
    color: transparent;
  }
  
  :deep(.goog-te-gadget .goog-te-combo) {
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
    background-color: var(--secondary-bg);
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    outline: none;
    appearance: none;
    padding-right: 2rem;
    margin: 0;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 0.7rem top 50%;
    background-size: 0.65rem auto;
  }
  
  :deep(.goog-te-gadget .goog-te-combo:hover) {
    border-color: var(--accent-color);
  }
  
  :deep(.goog-te-gadget .goog-te-combo:focus) {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.1);
  }
  
  /* Hide Google branding */
  :deep(.goog-te-gadget) span {
    display: none;
  }
  
  :deep(.goog-te-gadget) div {
    display: inline;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .translate-widget {
      margin-right: 0.5rem;
    }
    
    :deep(.goog-te-gadget .goog-te-combo) {
      font-size: 0.75rem;
      padding: 0.4rem;
      padding-right: 1.5rem;
      background-size: 0.5rem auto;
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    :deep(.goog-te-gadget .goog-te-combo) {
      background-color: var(--secondary-bg);
      color: var(--text-primary);
    }
  }
  </style> -->
  <template>
    <div class="translate-widget">
      <!-- Language selector with button to revert to English -->
      <div class="language-container">
        <select 
          class="language-select" 
          v-model="selectedLanguage" 
          @change="changeLanguage"
        >
          <option value="" disabled>Select Language</option>
          <option 
            v-for="lang in languages" 
            :key="lang.code" 
            :value="lang.code"
          >
            {{ lang.name }}
          </option>
        </select>
        
        <!-- English reset button - always visible and labeled in English -->
        <button 
          v-if="selectedLanguage && selectedLanguage !== 'en'" 
          class="reset-language-btn" 
          @click="resetToEnglish"
          title="Reset to English"
        >
          EN
        </button>
      </div>
  
      <!-- Hidden Google Translate Element (required for initialization) -->
      <div id="google_translate_element" style="display:none"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { languages } from './languages.js'
  
  const selectedLanguage = ref('')
  
  function initGoogleTranslate() {
    const addScript = document.createElement('script')
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    )
    document.body.appendChild(addScript)
    
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: languages.map(lang => lang.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      )
    }
  }
  
  function changeLanguage(event) {
    const lang = event.target.value
    setLanguageCookies(lang)
    location.reload()
  }
  
  function resetToEnglish() {
    // Clear all Google Translate cookies
    clearTranslateCookies()
    
    // Set to English
    selectedLanguage.value = 'en'
    localStorage.setItem('preferredLanguage', 'en')
    
    // Force reload to apply changes
    window.location.href = window.location.pathname
  }
  
  function clearTranslateCookies() {
    const domain = document.domain
    const cookieName = 'googtrans'
    const pathSuffixes = ['/', '/en', '/en/en', '/en/auto']
    const domains = [domain, `.${domain}`, '', '.']
    
    // Clear cookies with all possible combinations
    domains.forEach(d => {
      pathSuffixes.forEach(path => {
        document.cookie = `${cookieName}=; domain=${d}; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      })
    })
    
    // Additional cleanup for Google's other cookies
    document.cookie = `GOOGTRANS=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    document.cookie = `GOOGTRANS=; domain=.${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    
    // Also remove localStorage item to be thorough
    localStorage.removeItem('googtrans')
  }
  
  function setLanguageCookies(lang) {
    const domain = document.domain
    
    // First clear any existing translate cookies
    if (lang === 'en') {
      clearTranslateCookies()
      return
    }
    
    // Set cookies with and without subdomain
    document.cookie = `googtrans=/en/${lang}; domain=${domain}; path=/`
    document.cookie = `googtrans=/en/${lang}; domain=.${domain}; path=/`
    
    // Set a session cookie to remember the language selection
    localStorage.setItem('preferredLanguage', lang)
  }
  
  onMounted(() => {
    initGoogleTranslate()
    
    // Check for existing language cookie
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/)
    if (match && match[1] !== 'en') {
      selectedLanguage.value = match[1]
    } else {
      // Check localStorage for previously selected language
      const savedLang = localStorage.getItem('preferredLanguage')
      if (savedLang && savedLang !== 'en') {
        selectedLanguage.value = savedLang
        // Apply the saved language
        setLanguageCookies(savedLang)
      } else {
        // Default to English
        selectedLanguage.value = 'en'
        // Make sure we start with clean cookies for English
        clearTranslateCookies()
      }
    }
  })
  </script>
  
  <style>
  /* Hide Google Translate banner and popup - this needs to be global */
  .goog-te-banner-frame {
    display: none !important;
  }
  
  .goog-te-gadget-simple {
    display: none !important;
  }
  
  body {
    top: 0 !important;
  }
  
  .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
    display: none !important;
  }
  
  .VIpgJd-ZVi9od-aZ2wEe-OiiCO {
    display: none !important;
  }
  
  /* Hide the white space left by the banner */
  .skiptranslate {
    display: none !important;
  }
  
  /* Additional backup selectors for the popup */
  #goog-gt-tt, 
  .goog-te-balloon-frame {
    display: none !important;
  }
  
  .goog-text-highlight {
    background: none !important;
    box-shadow: none !important;
  }
  </style>
  
  <style scoped>
  .translate-widget {
    display: inline-block;
    position: relative;
  }
  
  .language-container {
    display: flex;
    align-items: center;
  }
  
  .language-select {
    appearance: none;
    background-color: var(--text-primary);
    border-radius: 0.5rem;
    padding: 0.5rem 2rem 0.5rem 1rem;
    font-size: 0.875rem;
    color: var(--secondary-bg);
    cursor: pointer;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 0.7rem top 50%;
    background-size: 0.65rem auto;
    min-width: 140px;
  }
  
  .language-select:hover {
    border-color: var(--accent-color);
  }
  
  .language-select:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  /* Reset to English button */
  .reset-language-btn {
    margin-left: 8px;
    padding: 0.3rem 0.5rem;
    background-color: #2c67c9; /* Blue color that stands out */
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s;
    /* Make sure the text stays in English */
    font-family: Arial, sans-serif !important;
  }
  
  .reset-language-btn:hover {
    background-color: #1a4fa0;
  }
  
  /* Custom scrollbar styles */
  .language-select::-webkit-scrollbar {
    width: 6px; /* Reduced scrollbar width */
  }
  
  .language-select::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .language-select::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 4px;
  }
  
  .language-select::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color-hover, var(--accent-color));
  }
  
  /* Style the dropdown options */
  .language-select option {
    background-color: var(--secondary-bg);
    color: var(--text-primary);
    padding: 8px;
  }
  
  /* Style the option hover state */
  .language-select option:hover,
  .language-select option:focus,
  .language-select option:checked {
    background-color: var(--accent-color) !important;
    color: white !important;
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .language-select {
      background-color: var(--secondary-bg);
      color: var(--text-primary);
      border-color: var(--border-color);
    }
    
    .language-select:hover {
      border-color: var(--accent-color);
    }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .language-select {
      font-size: 0.75rem;
      padding: 0.4rem 1.5rem 0.4rem 0.75rem;
      min-width: 120px;
    }
    
    .reset-language-btn {
      padding: 0.2rem 0.4rem;
      font-size: 0.7rem;
    }
  }
  </style>