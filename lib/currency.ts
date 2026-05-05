/**
 * Currency Utility Functions
 * 
 * Handles:
 * - Exchange rate conversion from USD to selected currency
 * - Locale-aware currency formatting
 * - Dynamic currency selection via settings store
 */

import useSettingsStore from '../store/settingsStore'
import { getLocales } from 'expo-localization'

// Get device locale for number formatting
const locale = getLocales()[0]

/**
 * Exchange rates from USD
 * Updated regularly based on market rates
 * Add more currencies as needed
 */
const exchangeRates: Record<string, number> = {
  USD: 1,
  EGP: 48.5,
  GBP: 0.79,
  EUR: 0.92,
  AED: 3.67,
  SAR: 3.75,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
}

/**
 * Format price with currency conversion and localization
 * 
 * Converts from USD to selected currency and formats
 * using device locale for proper number/currency symbols
 * 
 * @param {number} priceInUSD - Price in USD
 * @returns {string} Formatted price string (e.g., "$19.99", "€18.35")
 * 
 * @example
 * formatPrice(100) // => "$100.00" (USD)
 * formatPrice(100) // => "€92.00" (EUR, if EUR selected)
 */
export function formatPrice(priceInUSD: number): string {
  // Get selected currency from settings store
  const currency = useSettingsStore.getState().currency
  
  // Get exchange rate (default to 1 if currency not found)
  const rate = exchangeRates[currency] ?? 1
  
  // Convert price from USD to target currency
  const converted = priceInUSD * rate

  // Format using Intl API for proper locale-specific formatting
  return new Intl.NumberFormat(locale.languageTag, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(converted)
}