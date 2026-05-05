/**
 * Supabase Client Configuration
 * 
 * Initializes Supabase client with:
 * - Auth: Session persistence and auto-refresh
 * - localStorage: Uses expo-sqlite for session storage
 * - Auto-refresh: Tokens refreshed automatically on expiry
 */

import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import 'expo-sqlite/localStorage/install'

// Supabase project credentials from environment
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/**
 * Supabase client instance
 * Configured for React Native with session persistence
 */
export const supabase = createClient(supabaseUrl!, supabasePublishableKey!, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,    // Auto-refresh tokens when expired
    persistSession: true,      // Persist session between app restarts
    detectSessionInUrl: false, // Don't detect session from URL (mobile app)
  },
})