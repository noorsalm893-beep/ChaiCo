/**
 * Internationalization (i18n) Configuration
 *
 * Supports multiple languages:
 * - English (en)
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
    orderHistoryLoading: 'Loading orders... ⏳',
    orderHistoryNone: 'No orders yet!',
    orderHistoryPlaceFirstOrder: 'Place your first order!',
    orderHistoryOrderNumber: 'Order #',
    orderHistoryTotal: 'Total',
    orderHistoryLoadMore: 'Load More',
    orderHistoryNoMore: 'No more orders',
    orderStatus: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
    scan: {
      needCameraPermission: 'We need camera permission to scan barcodes',
      grantPermission: 'Grant Permission',
      error: 'Error',
      notFound: 'Not Found',
      noProductFound: 'No product found with this barcode!',
      ok: 'OK',
      productFound: 'Product Found!',
      scanAgain: 'Scan Again',
      scanAPrompt: 'Scan a Product',
      tapToScanAgain: 'Tap to Scan Again',
    },
    vendorOrders: {
      loading: 'Loading orders...',
      none: 'No orders yet!',
      willAppearHere: 'Orders will appear here',
      title: 'Orders',
      count: 'orders',
      orderNumber: 'Order #',
      total: 'Total',
      confirm: 'Confirm',
      cancel: 'Cancel',
      markDelivered: 'Mark Delivered',
    },
    vendorOrderStatus: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
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
    orderHistoryLoading: 'Chargement des commandes... ⏳',
    orderHistoryNone: 'Aucune commande pour le moment!',
    orderHistoryPlaceFirstOrder: 'Passez votre première commande!',
    orderHistoryOrderNumber: 'Commande #',
    orderHistoryTotal: 'Total',
    orderHistoryLoadMore: 'Charger plus',
    orderHistoryNoMore: 'Plus de commandes',
    orderStatus: {
      pending: 'En attente',
      confirmed: 'Confirmé',
      delivered: 'Livré',
      cancelled: 'Annulé',
    },
    scan: {
      needCameraPermission: 'Nous avons besoin de l\'autorisation de la caméra pour scanner les codes-barres',
      grantPermission: 'Autoriser',
      error: 'Erreur',
      notFound: 'Non trouvé',
      noProductFound: 'Aucun produit trouvé avec ce code-barres !',
      ok: 'OK',
      productFound: 'Produit trouvé !',
      scanAgain: 'Scanner à nouveau',
      scanAPrompt: 'Scanner un produit',
      tapToScanAgain: 'Appuyez pour scanner à nouveau',
    },
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
    orderHistoryLoading: 'Cargando pedidos... ⏳',
    orderHistoryNone: 'No hay pedidos aún!',
    orderHistoryPlaceFirstOrder: '¡Haz tu primer pedido!',
    orderHistoryOrderNumber: 'Pedido #',
    orderHistoryTotal: 'Total',
    orderHistoryLoadMore: 'Cargar más',
    orderHistoryNoMore: 'No hay más pedidos',
    orderStatus: {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    },
    scan: {
      needCameraPermission: 'Necesitamos permiso para usar la cámara para escanear códigos de barras',
      grantPermission: 'Dar permiso',
      error: 'Error',
      notFound: 'No encontrado',
      noProductFound: 'No se encontró ningún producto con este código de barras!',
      ok: 'OK',
      productFound: 'Producto encontrado!',
      scanAgain: 'Escanear nuevamente',
      scanAPrompt: 'Escanea un producto',
      tapToScanAgain: 'Toca para escanear nuevamente',
    },
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
    orderHistoryLoading: '注文を読み込み中... ⏳',
    orderHistoryNone: 'まだ注文はありません!',
    orderHistoryPlaceFirstOrder: '最初の注文をしてください!',
    orderHistoryOrderNumber: '注文 #',
    orderHistoryTotal: '合計',
    orderHistoryLoadMore: 'もっと読み込む',
    orderHistoryNoMore: 'これ以上注文はありません',
    orderStatus: {
      pending: '保留中',
      confirmed: '確認済み',
      delivered: '配達済み',
      cancelled: 'キャンセル済み',
    },
    scan: {
      needCameraPermission: 'バーコードをスキャンするためにカメラの権限が必要です',
      grantPermission: '許可する',
      error: 'エラー',
      notFound: '見つかりません',
      noProductFound: 'このバーコードに一致する商品が見つかりません！',
      ok: 'OK',
      productFound: '商品が見つかりました！',
      scanAgain: 'もう一度スキャン',
      scanAPrompt: '商品をスキャン',
      tapToScanAgain: 'タップしてもう一度スキャン',
    },
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

  // Return translation using the locale option to avoid changing global state
  return i18n.t(key, { locale: language })
}

export default i18n