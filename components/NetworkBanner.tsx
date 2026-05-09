/**
 * Network Status Banner Component
 * Displays when device loses internet connection
 * Polls network status every 3 seconds
 */

import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as Network from 'expo-network'
import { palette } from '../lib/theme'

/**
 * NetworkBanner Component - Shows offline warning
 * @returns {JSX.Element|null} Banner if offline, null if connected
 */
export default function NetworkBanner() {
  // State: Network connectivity
  const [isConnected, setIsConnected] = useState(true)

  /**
   * Effect: Monitor network status
   * Checks connection every 3 seconds
   */
  useEffect(() => {
    // Check network status immediately on mount
    checkNetwork()
    
    // Poll for network status every 3 seconds
    const interval = setInterval(checkNetwork, 3000)
    
    return () => clearInterval(interval)
  }, [])

  /**
   * Check current network connection status
   * @async
   */
  async function checkNetwork() {
    const networkState = await Network.getNetworkStateAsync()
    setIsConnected(networkState.isConnected ?? true)
  }

  // Don't render if connected
  if (isConnected) return null

  // Render offline warning banner
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        No Internet Connection
      </Text>
    </View>
  )
}

/**
 * Styles for NetworkBanner
 */
const styles = StyleSheet.create({
  banner: {
    backgroundColor: palette.rosyBrown,
    paddingTop: 50,      // Accounts for status bar
    paddingBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  bannerText: {
    color: palette.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
})