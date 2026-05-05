/**
 * Root Application Component
 * Handles authentication state, user roles, deep linking, and notifications
 */

import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'

// Services
import { supabase } from './lib/supabase'
import { registerForPushNotifications } from './lib/notifications'
import { palette } from './lib/theme'

// Components
import Auth from './components/Auth'
import NetworkBanner from './components/NetworkBanner'
import BatterySync from './components/BatterySync'
import TabNavigator from './navigation/TabNavigator'

/**
 * Root App Component
 * @returns {JSX.Element} App layout with conditional authentication UI
 */
export default function App() {
  // State: Authentication
  const [session, setSession] = useState<any>(null)
  const [role, setRole] = useState<string>('buyer')
  const [loading, setLoading] = useState(true)

  /**
   * Effect: Initialize authentication and setup listeners
   * Restores session, monitors auth changes, handles deep links and notifications
   */
  useEffect(() => {
    // Restore existing session on app start
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        getRole(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Subscribe to auth state changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        getRole(session.user.id)
      } else {
        setRole('buyer')
        setLoading(false)
      }
    })

    // Handle deep linking (e.g., chaico://cart from external apps)
    const linkSub = Linking.addEventListener('url', ({ url }) => {
      console.log('🔗 Deep link received:', url)
      // Navigation handled by deep linking config in TabNavigator
    })

    // Initialize push notifications
    registerForPushNotifications()

    // Listen for notifications received in foreground
    const notifSub = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received:', notification)
    })

    // Listen for user interactions with notifications
    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response)
    })

    // Cleanup all listeners on component unmount
    return () => {
      subscription.unsubscribe()
      linkSub.remove()
      notifSub.remove()
      responseSub.remove()
    }
  }, [])

  /**
   * Fetch user's role from profiles table
   * Determines if user sees buyer or vendor interface
   * @param {string} userId - Authenticated user ID
   */
  async function getRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Error fetching user role:', error.message)
        setRole('buyer') // Default to buyer role if fetch fails
      } else {
        setRole(data?.role ?? 'buyer')
      }
    } finally {
      setLoading(false)
    }
  }

  // Render: Loading spinner while restoring session
  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: palette.darkGreen,
      }}>
        <ActivityIndicator size="large" color={palette.rosyBrown} />
      </View>
    )
  }

  // Render: Auth screen if user is not authenticated
  if (!session) {
    return (
      <View style={{ flex: 1 }}>
        <NetworkBanner />
        <BatterySync />
        <Auth />
      </View>
    )
  }

  // Render: Main app with navigation if user is authenticated
  return (
    <View style={{ flex: 1 }}>
      <NetworkBanner />
      <BatterySync />
      <TabNavigator role={role} />
    </View>
  )
}