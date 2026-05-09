/**
 * Navigation Stack and Tab Navigator
 * 
 * Structure:
 * - Root Stack: Handles modal screens (Checkout, Settings, etc.)
 * - Tab Navigation: Separate tabs for Buyer and Vendor roles
 * - Deep Linking: Supports deep links via chaico:// scheme
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, LinkingOptions } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { palette } from '../lib/theme'

// Screens
import HomeScreen from '../screens/HomeScreen'
import ScanScreen from '../screens/ScanScreen'
import CartScreen from '../screens/CartScreen'
import WishlistScreen from '../screens/WishlistScreen'
import ProfileScreen from '../screens/ProfileScreen'
import CheckoutScreen from '../screens/CheckoutScreen'
import OrderHistoryScreen from '../screens/OrderHistoryScreen'
import SettingsScreen from '../screens/SettingsScreen'
import VendorAddProductScreen from '../screens/VendorAddProductScreen'
import VendorOrdersScreen from '../screens/VendorOrdersScreen'
import StoreLocatorScreen from '../screens/StoreLocatorScreen'

// Navigation containers
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

/**
 * Deep linking configuration
 * Maps external URLs to app navigation
 * Example: chaico://cart -> CartScreen
 */
const linking: LinkingOptions<any> = {
  prefixes: ['chaico://'],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: 'home',
          Cart: 'cart',
          Wishlist: 'wishlist',
          Profile: 'profile',
          Scan: 'scan',
          Orders: 'orders',
        }
      },
      Checkout: 'checkout',
      OrderHistory: 'order-history',
      Settings: 'settings',
      VendorAddProduct: 'add-product',
      StoreLocator: 'store-locator',
    }
  }
}

/**
 * Get icon name for tab based on route and focus state
 * @param {string} routeName - Tab route name
 * @param {boolean} focused - Whether tab is currently focused
 * @returns {string} Icon name from Ionicons
 */
function getTabBarIcon(routeName: string, focused: boolean): string {
  const iconMap: Record<string, { focused: string; unfocused: string }> = {
    Home: { focused: 'home', unfocused: 'home-outline' },
    Scan: { focused: 'barcode', unfocused: 'barcode-outline' },
    Cart: { focused: 'cart', unfocused: 'cart-outline' },
    Wishlist: { focused: 'heart', unfocused: 'heart-outline' },
    Profile: { focused: 'person', unfocused: 'person-outline' },
    AddProduct: { focused: 'add-circle', unfocused: 'add-circle-outline' },
    Orders: { focused: 'receipt', unfocused: 'receipt-outline' },
  }

  const icons = iconMap[routeName]
  return focused ? icons.focused : icons.unfocused
}

/**
 * Tab screen options (styling, headers, etc.)
 */
const tabNavigatorScreenOptions = {
  tabBarActiveTintColor: palette.darkGreen,
  tabBarInactiveTintColor: palette.mossGreen,
  headerShown: false,
}

/**
 * Buyer Tab Navigator
 * Shows: Home, Scan, Cart, Wishlist, Profile
 * 
 * @param {object} props - Component props
 * @param {string|null} props.role - User role
 * @returns {JSX.Element} Bottom tab navigation for buyers
 */
function BuyerTabs({ role }: { role: string | null }): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabBarIcon(route.name, focused)
          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        ...tabNavigatorScreenOptions,
      })}
    >
      <Tab.Screen 
        name="Home"
        options={{ title: 'Home' }}
      >
        {() => <HomeScreen role={role} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Scan"
        component={ScanScreen}
        options={{ title: 'Scan' }}
      />
      
      <Tab.Screen 
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{ title: 'Wishlist' }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />

    </Tab.Navigator>
  )
}

/**
 * Vendor Tab Navigator
 * Shows: Home, Add Product, Orders, Profile
 * 
 * @param {object} props - Component props
 * @param {string|null} props.role - User role
 * @returns {JSX.Element} Bottom tab navigation for vendors
 */
function VendorTabs({ role }: { role: string | null }): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabBarIcon(route.name, focused)
          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        ...tabNavigatorScreenOptions,
      })}
    >
      <Tab.Screen 
        name="Home"
        options={{ title: 'Home' }}
      >
        {() => <HomeScreen role={role} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="AddProduct"
        component={VendorAddProductScreen}
        options={{ title: 'Add Product' }}
      />
      
      <Tab.Screen
        name="Orders"
        component={VendorOrdersScreen}
        options={{ title: 'Orders' }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />

    </Tab.Navigator>
  )
}

/**
 * Tab Navigator - Main navigation component
 * Conditionally renders Buyer or Vendor tabs based on user role
 * 
 * @param {object} props - Component props
 * @param {string|null} props.role - User role ('buyer' or 'vendor')
 * @returns {JSX.Element} Stack navigator with tab navigation
 */
export default function TabNavigator({ role }: { role: string | null }): JSX.Element {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main tabs screen - switches between buyer/vendor tabs */}
        <Stack.Screen 
          name="Tabs"
          options={{ title: 'Home' }}
        >
          {() => role === 'vendor' 
            ? <VendorTabs role={role} /> 
            : <BuyerTabs role={role} />
          }
        </Stack.Screen>

        {/* Modal screens (shown on top of tabs) */}
        <Stack.Screen 
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
        
        <Stack.Screen 
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ title: 'Order History' }}
        />
        
        <Stack.Screen 
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
        
        <Stack.Screen 
          name="VendorAddProduct"
          component={VendorAddProductScreen}
          options={{ title: 'Add Product' }}
        />
        
        <Stack.Screen 
          name="StoreLocator"
          component={StoreLocatorScreen}
          options={{ title: 'Store Locator' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}