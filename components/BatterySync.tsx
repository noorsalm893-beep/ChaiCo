/**
 * Battery Status Banner Component
 * Shows warning when battery is low and pauses syncing
 * Helps preserve battery life on low power devices
 */

import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as Battery from 'expo-battery'
import { palette } from '../lib/theme'

/**
 * Threshold for considering battery as "low" (20%)
 * When battery reaches this level, syncing operations pause
 */
const LOW_BATTERY_THRESHOLD = 0.2

/**
 * BatterySync Component - Shows low battery warning
 * @returns {JSX.Element|null} Banner if battery low, null otherwise
 */
export default function BatterySync() {
  // State: Battery status
  const [batteryLevel, setBatteryLevel] = useState<number>(1)
  const [isLow, setIsLow] = useState(false)

  /**
   * Effect: Monitor device battery level
   * Listens for battery changes and updates state
   */
  useEffect(() => {
    // Check battery immediately on mount
    checkBattery()

    // Subscribe to battery level changes
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel)
      setIsLow(batteryLevel <= LOW_BATTERY_THRESHOLD)
    })

    // Cleanup listener on unmount
    return () => subscription.remove()
  }, [])

  /**
   * Check current battery level
   * @async
   */
  async function checkBattery() {
    const level = await Battery.getBatteryLevelAsync()
    setBatteryLevel(level)
    setIsLow(level <= LOW_BATTERY_THRESHOLD)
  }

  // Don't render if battery is not low
  if (!isLow) return null

  // Render low battery warning banner
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        🔋 Low Battery ({Math.round(batteryLevel * 100)}%) — Sync Paused
      </Text>
    </View>
  )
}

/**
 * Styles for BatterySync banner
 */
const styles = StyleSheet.create({
  banner: {
    backgroundColor: palette.beige,
    paddingTop: 50,
    paddingBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  bannerText: {
    color: palette.darkGreen,
    fontWeight: 'bold',
    fontSize: 14,
  },
})