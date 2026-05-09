/**
 * Cart Screen Component
 * 
 * Displays shopping cart with:
 * - List of products in cart
 * - Quantity adjustment controls
 * - Item removal
 * - Total price calculation
 * - Checkout navigation
 */

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import * as Haptics from 'expo-haptics'

// Services & Utilities
import { formatPrice } from '../lib/currency'
import { t } from '../lib/i18n'
import { lightTheme, darkTheme } from '../lib/theme'

// State Management
import useCartStore from '../store/cartStore'
import useSettingsStore from '../store/settingsStore'

/**
 * Cart Screen Component
 * @param {object} props - Component props
 * @param {any} props.navigation - Navigation object from React Navigation
 * @returns {JSX.Element} Cart UI
 */
export default function CartScreen({ navigation }: any) {
  // Get cart actions and state
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice, clearCart } = useCartStore()
  
  // Get user settings
  const currency = useSettingsStore((state) => state.currency)
  const language = useSettingsStore((state) => state.language)
  const theme = useSettingsStore((state) => state.theme)
  const colors = theme === 'dark' ? darkTheme : lightTheme

  // Render: Empty cart state
  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.primary }]}>
          Your cart is empty
        </Text>
        <Text style={[styles.emptySubText, { color: colors.subtext }]}>
          Go add some teas!
        </Text>
      </View>
    )
  }

  // Render: Cart with items
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {t('cart')}
        </Text>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            clearCart()
          }}
        >
          <Text style={[styles.clearText, { color: colors.error }]}> 
            {t('clearAll')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Product Image */}
            <Image
              source={{ uri: item.image_url }}
              style={styles.image}
              contentFit="cover"
            />
            
            {/* Product Details */}
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>
                {item.name}
              </Text>
              
              <Text style={[styles.price, { color: colors.price }]}>
                {formatPrice(item.price)}
              </Text>

              {/* Quantity Controls */}
              <View style={styles.quantityRow}>
                {/* Decrease Button */}
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: colors.success }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    decreaseQuantity(item.id)
                  }}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>

                {/* Quantity Display */}
                <Text style={[styles.qtyText, { color: colors.text }]}>
                  {item.quantity}
                </Text>

                {/* Increase Button */}
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: colors.success }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    increaseQuantity(item.id)
                  }}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>

                {/* Remove Button */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    removeFromCart(item.id)
                  }}
                >
                  <Text style={[styles.removeBtnText, { color: colors.error }]}> 
                    {t('remove')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Subtotal */}
              <Text style={[styles.subtotal, { color: colors.subtext }]}>
                {t('subtotal')}: {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Footer with Total and Checkout */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.total, { color: colors.primary }]}>
          {t('total')}: {formatPrice(getTotalPrice())}
        </Text>
        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            navigation.navigate('Checkout')
          }}
        >
          <Text style={styles.checkoutText}>
            {t('proceedToCheckout')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

/**
 * Styles for Cart Screen
 */
const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 16,
    marginTop: 8,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Cart Item Card
  card: {
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // Quantity Controls
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
    marginRight: 8,
  },
  removeBtn: {
    marginLeft: 8,
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Pricing
  subtotal: {
    fontSize: 13,
    marginTop: 4,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  // Checkout
  checkoutBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Footer
  footer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
  },
})