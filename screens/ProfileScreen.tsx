import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'
import { t } from '../lib/i18n'
import useSettingsStore from '../store/settingsStore'
import { lightTheme, darkTheme } from '../lib/theme'

export default function ProfileScreen({ navigation }: any) {
  const language = useSettingsStore((state) => state.language)
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const colors = theme === 'dark' ? darkTheme : lightTheme

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>{t('profile')}</Text>

      {/* Theme Toggle */}
      <View style={[styles.themeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.themeLabel, { color: colors.text }]}>
          {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </Text>
        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: colors.primary }]}
          onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Text style={styles.toggleText}>
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('OrderHistory')}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>{t('orderHistory')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('StoreLocator')}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>📍 Store Locator</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>{t('settings')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.signOutBtn, { backgroundColor: colors.error }]}
        onPress={signOut}
      >
        <Text style={styles.signOutText}>{t('signOut')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  btn: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signOutBtn: {
    backgroundColor: '#D3968C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})