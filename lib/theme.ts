/**
 * Theme Configuration
 * Uses the ChaiCo color palette across the app
 */
export const palette = {
  darkGreen: '#0A3323',
  mossGreen: '#2E7D32',
  beige: '#F7F4D5',
  rosyBrown: '#C62828',
  midnightGreen: '#105666',
  white: '#FFFFFF',
  black: '#000000',
}

/**
 * Light theme color palette
 */
export const lightTheme = {
  background: palette.beige,
  card: palette.white,
  text: palette.midnightGreen,
  subtext: palette.mossGreen,
  primary: palette.darkGreen,
  price: palette.black,
  border: palette.mossGreen,
  filterBtn: palette.beige,
  inputBg: palette.beige,
  error: palette.rosyBrown,
  success: palette.mossGreen,
  black: palette.black,
}

/**
 * Dark theme color palette
 */
export const darkTheme = {
  background: palette.darkGreen,
  card: palette.midnightGreen,
  text: palette.beige,
  subtext: palette.beige,
  primary: palette.mossGreen,
  price: palette.white,
  border: palette.midnightGreen,
  filterBtn: palette.mossGreen,
  inputBg: palette.darkGreen,
  error: palette.rosyBrown,
  success: palette.mossGreen,
  black: palette.black,
}

/**
 * Type definition for theme object
 * Used for TypeScript type checking
 */
export type Theme = typeof lightTheme
