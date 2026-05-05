/**
 * Internationalization (i18n) Configuration
 * 
 * Supports multiple languages:
 * - English (en)
 * - Arabic (ar) - RTL support
 * - French (fr)
 * - Spanish (es)
 * - Japanese (ja)
 * 
 * Dynamically switches based on settings store
 */

import { I18n } from 'i18n-js'
import { getLocales } from 'expo-localization'
import useSettingsStore from '../store/settingsStore'

/**
 * i18n instance with all supported languages
 * Translation keys map to display strings
 */
const i18n = new I18n({
  en: {
    welcome: 'Welcome to ChaiCo 🍵',
    addToCart: 'Add to Cart 🛒',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    cart: 'My Cart 🛒',
    wishlist: 'My Wishlist ❤️',
    profile: 'My Profile 👤',
    checkout: 'Checkout 🛒',
    placeOrder: 'Place Order 🍵',
    orderHistory: '📋 Order History',
    settings: '🌍 Language & Currency',
    signOut: 'Sign Out',
    proceedToCheckout: 'Proceed to Checkout →',
    clearAll: 'Clear All',
    remove: 'Remove',
    total: 'Total',
    subtotal: 'Subtotal',
    deliveryInfo: 'Delivery Information',
    fullName: 'Full Name',
    address: 'Address',
    phone: 'Phone Number',
  },
  ar: {
    welcome: 'مرحباً بك في ChaiCo 🍵',
    addToCart: 'أضف إلى السلة 🛒',
    outOfStock: 'نفذ من المخزون',
    inStock: 'متوفر',
    cart: 'سلتي 🛒',
    wishlist: 'قائمة الأمنيات ❤️',
    profile: 'ملفي الشخصي 👤',
    checkout: 'الدفع 🛒',
    placeOrder: 'تأكيد الطلب 🍵',
    orderHistory: '📋 سجل الطلبات',
    settings: '🌍 اللغة والعملة',
    signOut: 'تسجيل الخروج',
    proceedToCheckout: 'المتابعة للدفع ←',
    clearAll: 'مسح الكل',
    remove: 'إزالة',
    total: 'المجموع',
    subtotal: 'المجموع الجزئي',
    deliveryInfo: 'معلومات التوصيل',
    fullName: 'الاسم الكامل',
    address: 'العنوان',
    phone: 'رقم الهاتف',
  },
  fr: {
    welcome: 'Bienvenue chez ChaiCo 🍵',
    addToCart: 'Ajouter au panier 🛒',
    outOfStock: 'Rupture de stock',
    inStock: 'En stock',
    cart: 'Mon panier 🛒',
    wishlist: 'Ma liste de souhaits ❤️',
    profile: 'Mon profil 👤',
    checkout: 'Paiement 🛒',
    placeOrder: 'Passer la commande 🍵',
    orderHistory: '📋 Historique des commandes',
    settings: '🌍 Langue et devise',
    signOut: 'Se déconnecter',
    proceedToCheckout: 'Procéder au paiement →',
    clearAll: 'Tout effacer',
    remove: 'Supprimer',
    total: 'Total',
    subtotal: 'Sous-total',
    deliveryInfo: 'Informations de livraison',
    fullName: 'Nom complet',
    address: 'Adresse',
    phone: 'Numéro de téléphone',
  },
  es: {
    welcome: 'Bienvenido a ChaiCo 🍵',
    addToCart: 'Añadir al carrito 🛒',
    outOfStock: 'Agotado',
    inStock: 'En stock',
    cart: 'Mi carrito 🛒',
    wishlist: 'Mi lista de deseos ❤️',
    profile: 'Mi perfil 👤',
    checkout: 'Pago 🛒',
    placeOrder: 'Realizar pedido 🍵',
    orderHistory: '📋 Historial de pedidos',
    settings: '🌍 Idioma y moneda',
    signOut: 'Cerrar sesión',
    proceedToCheckout: 'Proceder al pago →',
    clearAll: 'Borrar todo',
    remove: 'Eliminar',
    total: 'Total',
    subtotal: 'Subtotal',
    deliveryInfo: 'Información de entrega',
    fullName: 'Nombre completo',
    address: 'Dirección',
    phone: 'Número de teléfono',
  },
  ja: {
    welcome: 'ChaiCoへようこそ 🍵',
    addToCart: 'カートに追加 🛒',
    outOfStock: '在庫切れ',
    inStock: '在庫あり',
    cart: 'カート 🛒',
    wishlist: 'お気に入り ❤️',
    profile: 'プロフィール 👤',
    checkout: 'チェックアウト 🛒',
    placeOrder: '注文する 🍵',
    orderHistory: '📋 注文履歴',
    settings: '🌍 言語と通貨',
    signOut: 'サインアウト',
    proceedToCheckout: 'チェックアウトへ →',
    clearAll: 'すべて削除',
    remove: '削除',
    total: '合計',
    subtotal: '小計',
    deliveryInfo: '配送情報',
    fullName: '氏名',
    address: '住所',
    phone: '電話番号',
  },
})

// Set device locale as initial default
i18n.locale = getLocales()[0].languageCode ?? 'en'

// Enable fallback to English if translation missing
i18n.enableFallback = true

/**
 * Translate key to current language
 * Respects user's language preference from settings store
 * Falls back to English if translation not found
 * 
 * @param {string} key - Translation key
 * @returns {string} Translated string for current language
 * 
 * @example
 * t('welcome') // => "Welcome to ChaiCo 🍵" (if English)
 * t('welcome') // => "مرحباً بك في ChaiCo 🍵" (if Arabic)
 */
export function t(key: string): string {
  // Get user's language preference
  const language = useSettingsStore.getState().language
  
  // Set i18n locale to match
  i18n.locale = language
  
  // Return translation
  return i18n.t(key)
}

export default i18n