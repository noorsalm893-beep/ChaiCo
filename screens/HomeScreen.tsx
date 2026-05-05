/**
 * Home Screen Component
 * 
 * Displays products with features:
 * - Dynamic category filtering
 * - Wishlist management (buyers only)
 * - Cart integration with haptic feedback
 * - Offline support with caching
 * - Battery optimization (pauses sync when low)
 * - Real-time product updates (when battery allows)
 * - Vendor dashboard for managing products
 */

import { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Image } from 'expo-image'
import * as Haptics from 'expo-haptics'
import * as Battery from 'expo-battery'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Services & Utilities
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/currency'
import { t } from '../lib/i18n'
import { lightTheme, darkTheme } from '../lib/theme'

// State Management
import useCartStore from '../store/cartStore'
import useSettingsStore from '../store/settingsStore'

// Product categories available for filtering
const categories = ['All', 'Green Tea', 'Black Tea', 'Herbal Tea']

/**
 * Home Screen Component
 * Shows product listings with category filtering and buyer/vendor functionality
 * 
 * @param {object} props - Component props
 * @param {string|null} props.role - User role ('buyer' or 'vendor')
 * @returns {JSX.Element} Home screen view
 */
export default function HomeScreen({ role }: { role?: string | null }) {
  // State: Product data
  const [products, setProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [wishlistedIds, setWishlistedIds] = useState<number[]>([])
  const [isLowBattery, setIsLowBattery] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  // Store selectors
  const addToCart = useCartStore((state) => state.addToCart)
  const currency = useSettingsStore((state) => state.currency)
  const language = useSettingsStore((state) => state.language)
  const theme = useSettingsStore((state) => state.theme)
  const colors = theme === 'dark' ? darkTheme : lightTheme

  /**
   * Effect: Initialize products, wishlist, battery monitoring, and realtime sync
   * Sets up:
   * - Product loading and caching
   * - Wishlist loading
   * - Battery level monitoring
   * - Real-time product subscription (when battery > 20%)
   * - Proper cleanup on unmount
   */
  useEffect(() => {
    // Load initial data
    getProducts('All')
    loadWishlistedIds()
    checkBattery()

    // Monitor battery level
    const batterySub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      const low = batteryLevel <= 0.2
      setIsLowBattery(low)
      console.log(`🔋 Battery: ${Math.round(batteryLevel * 100)}% - Sync ${low ? 'PAUSED' : 'ACTIVE'}`)
    })

    // Setup realtime sync if battery is sufficient
    let channel: any = null

    Battery.getBatteryLevelAsync().then((level) => {
      if (level > 0.2) {
        // Subscribe to realtime product changes
        channel = supabase
          .channel(`products-changes-${Date.now()}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            (payload) => {
              console.log('📡 Product change received:', payload.eventType)
              getProducts(selectedCategory)
            }
          )
          .subscribe()
        console.log('✅ Realtime sync started')
      } else {
        console.log('⏸ Low battery - Realtime sync paused')
      }
    })

    // Cleanup subscriptions on unmount
    return () => {
      batterySub.remove()
      if (channel) channel.unsubscribe()
    }
  }, [])

  /**
   * Check current battery level
   * @async
   */
  async function checkBattery() {
    const level = await Battery.getBatteryLevelAsync()
    setIsLowBattery(level <= 0.2)
  }

  /**
   * Fetch products from Supabase or load from cache on failure
   * Implements offline-first pattern with timeout for offline detection
   * 
   * @param {string} category - Product category to filter ('All' for all products)
   * @async
   */
  async function getProducts(category: string = 'All') {
    try {
      // Build query
      let query = supabase.from('products').select()
      if (category !== 'All') {
        query = query.eq('category', category)
      }

      // Set 5 second timeout to detect offline state
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), 5000)
      )

      // Race between query and timeout
      const { data, error } = await Promise.race([query, timeout]) as any

      if (error) throw error

      if (data) {
        setProducts(data)
        setIsOffline(false)
        
        // Cache products for offline use
        await AsyncStorage.setItem(
          `products_cache_${category}`,
          JSON.stringify(data)
        )
        console.log(`✅ ${data.length} products loaded and cached`)
      }
    } catch (err) {
      // Load from cache if network error
      console.log('⚠️ Network error, loading from cache...')
      try {
        const cached = await AsyncStorage.getItem(`products_cache_${category}`)
        if (cached) {
          setProducts(JSON.parse(cached))
          setIsOffline(true)
          console.log('📦 Loaded from local cache')
        }
      } catch (cacheErr) {
        console.error('❌ Cache error:', cacheErr)
      }
    }
  }

  /**
   * Load wishlist product IDs for current user
   * Used to show/hide heart icons on products
   * @async
   */
  async function loadWishlistedIds() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id)

      if (data) {
        setWishlistedIds(data.map((w) => w.product_id))
      }
    } catch (err) {
      console.error('❌ Error loading wishlist:', err)
    }
  }

  /**
   * Add or remove product from wishlist
   * Toggles wishlist status for a product
   * 
   * @param {number} productId - ID of product to wishlist
   * @async
   */
  async function addToWishlist(productId: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (wishlistedIds.includes(productId)) {
        // Remove from wishlist
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
        setWishlistedIds(wishlistedIds.filter((id) => id !== productId))
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId })
        if (!error) {
          setWishlistedIds([...wishlistedIds, productId])
        }
      }
    } catch (err) {
      console.error('❌ Error updating wishlist:', err)
    }
  }

  /**
   * Delete product (vendor only)
   * Shows confirmation alert before deletion
   * 
   * @param {number} productId - ID of product to delete
   * @async
   */
  async function deleteProduct(productId: number) {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)
              
              if (error) {
                Alert.alert('Error', error.message)
              } else {
                getProducts(selectedCategory)
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to delete product')
            }
          }
        }
      ]
    )
  }
  // Render: Main screen
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.welcome, { color: colors.primary }]}>
          {role === 'vendor' ? 'Vendor Dashboard' : t('welcome')}
        </Text>
        {isLowBattery && (
          <Text style={[styles.batteryWarning, { color: colors.error }]}> 
            🔋 Low Battery — Sync Paused
          </Text>
        )}
      </View>

      {/* Offline Warning Banner */}
      {isOffline && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.filterBtn, borderColor: colors.border }]}> 
          <Text style={[styles.offlineBannerText, { color: colors.text }]}> 
            📦 Viewing cached products — No internet
          </Text>
        </View>
      )}

      {/* Category Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
        style={{ marginBottom: 16, flexGrow: 0 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => {
              setSelectedCategory(cat)
              getProducts(cat)
            }}
            style={[
              styles.filterBtn,
              { backgroundColor: colors.filterBtn, borderColor: colors.border },
              selectedCategory === cat && { backgroundColor: colors.success, borderColor: colors.success }
            ]}
          >
            <Text style={[
              styles.filterText,
              { color: colors.text },
              selectedCategory === cat && { color: colors.black, fontWeight: '700' }
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Product Image */}
            <Image
              source={{ uri: item.image_url }}
              style={styles.image}
              contentFit="cover"
            />

            {/* Wishlist Heart (buyers only) */}
            {role !== 'vendor' && (
              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => addToWishlist(item.id)}
              >
                <Text style={styles.heartText}>
                  {wishlistedIds.includes(item.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Product Information */}
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>
                {item.name}
              </Text>
              
              <Text style={[styles.category, { color: colors.text }]}> 
                {item.category}
              </Text>
              
              <Text style={[styles.price, { color: colors.black }]}> 
                {item.description}
              </Text>

              {/* Stock Status */}
              <Text style={[
                styles.stock,
                item.stock === 0 ? { color: colors.error } : { color: colors.success }
              ]}>
                {item.stock === 0
                  ? t('outOfStock') + ' ❌'
                  : `${t('inStock')}: ${item.stock} ✅`
                }
              </Text>

              {/* Action Buttons - Vendor or Buyer */}
              {role === 'vendor' ? (
                // Vendor: Edit and Delete buttons
                <View style={styles.vendorButtons}>
                  <TouchableOpacity
                    style={[styles.editBtn, { backgroundColor: colors.primary }]}
                    onPress={() => Alert.alert('Edit', `Edit ${item.name} - coming soon!`)}
                  >
                    <Text style={styles.editBtnText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deleteBtn, { backgroundColor: colors.error }]}
                    onPress={() => deleteProduct(item.id)}
                  >
                    <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Buyer: Add to Cart button
                <TouchableOpacity
                  style={[
                    styles.addToCartBtn,
                    { backgroundColor: item.stock === 0 ? colors.border : colors.success }
                  ]}
                  onPress={() => {
                    // Haptic feedback for user action
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image_url: item.image_url,
                      quantity: 1,
                    })
                  }}
                  disabled={item.stock === 0}
                >
                  <Text style={styles.addToCartText}>
                    {item.stock === 0 ? t('outOfStock') : t('addToCart')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  )
}
/**
 * Styles for Home Screen
 */
const styles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },

  // Header Section
  header: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  batteryWarning: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },

  // Offline Banner
  offlineBanner: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  offlineBannerText: {
    fontWeight: '600',
    fontSize: 13,
  },

  // Product Card
  card: {
    borderRadius: 14,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 180,
  },

  // Wishlist Heart Button
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: {
    fontSize: 18,
  },

  // Product Information
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 13,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    marginTop: 4,
  },
  
  // Stock Status
  stock: {
    fontSize: 13,
    color: '#038956',
    marginTop: 4,
    fontWeight: '600',
  },
  outOfStock: {
    color: '#D3968C',
  },

  // Add to Cart Button (Buyer)
  addToCartBtn: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartBtnDisabled: {
    opacity: 0.7,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Vendor Buttons (Edit/Delete)
  vendorButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Category Filter Buttons
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    height: 36,
  },
  filterBtnActive: {
    backgroundColor: '#0A3323',
    borderColor: '#0A3323',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#f7efef',
  },
})