/**
 * Authentication Component
 * Handles user login and signup with role selection
 * - Email/password authentication via Supabase
 * - Role selection (buyer/vendor)
 * - Profile creation on signup
 */

import { useState } from 'react'
import {
  Alert, StyleSheet, View, Text,
  TextInput, TouchableOpacity
} from 'react-native'
import { palette } from '../lib/theme'

// Services
import { supabase } from '../lib/supabase'

/**
 * Auth Component - Displays login/signup form
 * @returns {JSX.Element} Authentication UI with form and role selector
 */
export default function Auth() {
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState<'buyer' | 'vendor' | null>(null)

  /**
   * Sign in with email and password
   * Authenticates user via Supabase auth service
   */
  async function signInWithEmail() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        Alert.alert('Sign In Failed', error.message)
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign up with email, password, and role
   * Creates new user account and saves profile data
   * @async
   */
  async function signUpWithEmail() {
    // Validate role is selected
    if (!role) {
      Alert.alert('Role Required', 'Please select if you are a buyer or vendor')
      return
    }

    setLoading(true)

    try {
      // Create new user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        Alert.alert('Sign Up Failed', error.message)
        return
      }

      // Save user profile with role (only if user was created)
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            role: role,
          })

        if (profileError) {
          console.error('❌ Profile creation error:', profileError)
          Alert.alert('Profile Error', 'Could not save your profile')
        } else {
          console.log('✅ Profile created with role:', role)
        }
      }

      // Check if email verification is required
      if (!data.session) {
        Alert.alert(
          'Verify Email',
          'Check your inbox for a verification link to complete your signup'
        )
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Text style={styles.logo}>🍵</Text>
      <Text style={styles.appName}>ChaiCo</Text>
      <Text style={styles.subtitle}>
        {isLogin ? 'Welcome Back!' : 'Create Account'}
      </Text>

      {/* Form Inputs */}
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={palette.mossGreen}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          editable={!loading}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={palette.mossGreen}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={palette.mossGreen}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      {/* Role Selection (signup only) */}
      {!isLogin && (
        <View style={styles.roleContainer}>
          <Text style={styles.roleTitle}>I am a:</Text>
          <View style={styles.roleRow}>
            {/* Buyer Role Button */}
            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === 'buyer' && styles.roleBtnActive
              ]}
              onPress={() => setRole('buyer')}
              disabled={loading}
            >
              <Text style={styles.roleEmoji}>🛍️</Text>
              <Text style={[
                styles.roleText,
                role === 'buyer' && styles.roleTextActive
              ]}>
                Buyer
              </Text>
            </TouchableOpacity>

            {/* Vendor Role Button */}
            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === 'vendor' && styles.roleBtnActive
              ]}
              onPress={() => setRole('vendor')}
              disabled={loading}
            >
              <Text style={styles.roleEmoji}>🏪</Text>
              <Text style={[
                styles.roleText,
                role === 'vendor' && styles.roleTextActive
              ]}>
                Vendor
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={isLogin ? signInWithEmail : signUpWithEmail}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      {/* Toggle Between Login and Signup */}
      <TouchableOpacity 
        onPress={() => setIsLogin(!isLogin)}
        disabled={loading}
      >
        <Text style={styles.switchText}>
          {isLogin 
            ? "Don't have an account? Sign Up" 
            : 'Already have an account? Sign In'
          }
        </Text>
      </TouchableOpacity>
    </View>
  )
}

/**
 * Styles for Auth component
 * Follows dark theme consistent with app branding
 */
const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: palette.midnightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  
  // Header
  logo: {
    fontSize: 60,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: palette.rosyBrown,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: palette.beige,
    marginBottom: 24,
  },
  
  // Form inputs
  input: {
    width: '100%',
    backgroundColor: palette.darkGreen,
    color: palette.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: palette.rosyBrown,
  },
  
  // Role selection
  roleContainer: {
    width: '100%',
    marginBottom: 16,
  },
  roleTitle: {
    color: palette.rosyBrown,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleBtn: {
    flex: 1,
    backgroundColor: palette.darkGreen,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: palette.rosyBrown,
  },
  roleBtnActive: {
    borderColor: palette.beige,
    backgroundColor: palette.midnightGreen,
  },
  roleEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  roleText: {
    color: palette.beige,
    fontSize: 16,
    fontWeight: '600',
  },
  roleTextActive: {
    color: palette.rosyBrown,
  },
  
  // Buttons
  button: {
    width: '100%',
    backgroundColor: palette.darkGreen,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: palette.rosyBrown,
    fontSize: 14,
  },
})