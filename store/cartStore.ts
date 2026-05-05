/**
 * Cart Store - Zustand State Management
 * Handles shopping cart state with persistent storage in AsyncStorage
 * 
 * Features:
 * - Add/remove items from cart
 * - Adjust item quantities
 * - Calculate total price and item count
 * - Persistent storage across app sessions
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Cart item interface
 */
export interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  quantity: number
}

/**
 * Cart store interface
 * Defines all state and actions available
 */
interface CartStore {
  items: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (id: number) => void
  increaseQuantity: (id: number) => void
  decreaseQuantity: (id: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

/**
 * Cart store using Zustand
 * Persists to AsyncStorage with key 'cart-storage'
 */
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add product to cart or increase quantity if exists
       * @param {CartItem} product - Product to add
       */
      addToCart: (product) => {
        const existing = get().items.find((i) => i.id === product.id)
        if (existing) {
          // Increment quantity if item already in cart
          set({
            items: get().items.map((i) =>
              i.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          // Add new item to cart
          set({ items: [...get().items, { ...product, quantity: 1 }] })
        }
      },

      /**
       * Remove item from cart by ID
       * @param {number} id - Product ID to remove
       */
      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      /**
       * Increase quantity of item in cart
       * @param {number} id - Product ID
       */
      increaseQuantity: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })
      },

      /**
       * Decrease quantity of item (minimum 1)
       * @param {number} id - Product ID
       */
      decreaseQuantity: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id && i.quantity > 1
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ),
        })
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => set({ items: [] }),

      /**
       * Calculate total price of all items
       * @returns {number} Total price in USD
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (total, i) => total + i.price * i.quantity, 
          0
        )
      },

      /**
       * Calculate total quantity of all items
       * @returns {number} Total number of items
       */
      getTotalItems: () => {
        return get().items.reduce((total, i) => total + i.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',        // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export default useCartStore