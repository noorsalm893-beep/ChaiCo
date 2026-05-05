/**
 * Settings Store - Zustand State Management
 * Manages user preferences: currency, language, theme
 * Persists to AsyncStorage across sessions
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import { Appearance } from 'react-native'

// Get device locale for default language
const locale = getLocales()[0]

/**
 * Settings store interface
 */
interface SettingsStore {
  currency: string
  language: string
  theme: 'light' | 'dark'
  setCurrency: (currency: string) => void
  setLanguage: (language: string) => void
  setTheme: (theme: 'light' | 'dark') => void
}

/**
 * Settings store using Zustand with persistent storage
 * Defaults: USD, device locale, device theme preference
 */
const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Default currency
      currency: 'USD',
      
      // Default language from device locale
      language: locale.languageCode ?? 'en',
      
      // Default theme from device appearance
      theme: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',

      /**
       * Set preferred currency for price display
       * @param {string} currency - Currency code (e.g., 'USD', 'EUR', 'EGP')
       */
      setCurrency: (currency) => set({ currency }),

      /**
       * Set preferred language for app UI
       * @param {string} language - Language code (e.g., 'en', 'ar', 'fr')
       */
      setLanguage: (language) => set({ language }),

      /**
       * Set preferred theme (light or dark mode)
       * @param {'light' | 'dark'} theme - Theme preference
       */
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage',  // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export default useSettingsStore