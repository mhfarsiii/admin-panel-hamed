/**
 * Theme Store - Dark mode management
 * Handles theme state and persistence
 */

import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: localStorage.getItem('darkMode') === 'true' || false,
  }),

  getters: {
    /**
     * Get current theme mode
     */
    themeMode: (state): 'light' | 'dark' => {
      return state.isDarkMode ? 'dark' : 'light'
    },
  },

  actions: {
    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('darkMode', String(this.isDarkMode))
      this.applyTheme()
      // Force re-render by triggering a small delay
      setTimeout(() => {
        this.applyTheme()
      }, 0)
    },

    /**
     * Set dark mode
     */
    setDarkMode(value: boolean) {
      this.isDarkMode = value
      localStorage.setItem('darkMode', String(this.isDarkMode))
      this.applyTheme()
    },

    /**
     * Apply theme to document
     */
    applyTheme() {
      const html = document.documentElement
      if (this.isDarkMode) {
        html.classList.add('dark')
        html.setAttribute('data-theme', 'dark')
      } else {
        html.classList.remove('dark')
        html.setAttribute('data-theme', 'light')
      }
    },

    /**
     * Initialize theme on app load
     */
    initTheme() {
      this.applyTheme()
    },
  },
})

