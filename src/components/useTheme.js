import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const theme = ref('light') // default theme
  
  // Load theme from localStorage on mount
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
      applyTheme(savedTheme)
    }
  })
  
  // Watch for theme changes and update localStorage
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  })
  
  // Function to apply theme to document
  const applyTheme = (newTheme) => {
    // Since .light-theme class contains dark theme colors,
    // we add it when theme is 'dark'
    if (newTheme === 'dark') {
      document.documentElement.classList.add('light-theme')
      // Optional: also add to body to ensure full coverage
      document.body.classList.add('light-theme')
    } else {
      document.documentElement.classList.remove('light-theme')
      document.body.classList.remove('light-theme')
    }
    
    // For debugging
    console.log('Current theme:', newTheme)
    console.log('light-theme class present:', document.documentElement.classList.contains('light-theme'))
  }
  
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  
  return {
    theme,
    toggleTheme
  }
}
