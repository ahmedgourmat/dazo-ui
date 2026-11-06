import { tokens, type Tokens } from './tokens'

export type ThemeMode = 'light' | 'dark'

export interface ThemeColors {
  background: string
  backgroundSurface: string
  backgroundSunken: string
  textPrimary: string
  textSecondary: string
  textDisabled: string
  textInverse: string
  primary: string
  primaryLight: string
  primaryDark: string
  border: string
  borderStrong: string
  danger: string
  success: string
  warning: string
}

// this is the shape every component reads from (what useTheme() returns)
// every component types against this, never against raw tokens
export interface Theme {
  mode: ThemeMode
  colors: ThemeColors
  spacing: Tokens['spacing']
  radius: Tokens['radius']
  fontSize: Tokens['fontSize']
  fontWeight: Tokens['fontWeight']
  fontFamily: Tokens['fontFamily']
  lineHeight: Tokens['lineHeight']
}

// semantic names — not raw values
const buildTheme = (mode: ThemeMode): Theme => ({
  mode: mode,
  colors: {
    // backgrounds - Material logic: elevated surfaces are lighter in dark mode
    background:        mode === 'light' ? tokens.colors.white      : tokens.colors.black900,
    backgroundSurface: mode === 'light' ? tokens.colors.white      : tokens.colors.black800,
    backgroundSunken:  mode === 'light' ? tokens.colors.black50    : tokens.colors.black950,

    // text
    textPrimary:   mode === 'light' ? tokens.colors.black900   : tokens.colors.black50,
    textSecondary: mode === 'light' ? tokens.colors.black600   : tokens.colors.black300,
    textDisabled:  mode === 'light' ? tokens.colors.black400   : tokens.colors.black500,
    textInverse:   tokens.colors.white,

    // brand
    primary:       tokens.colors.purple600,
    primaryLight:  tokens.colors.purple400,
    primaryDark:   tokens.colors.purple800,

    // borders
    border:        mode === 'light' ? tokens.colors.black200   : tokens.colors.black700,
    borderStrong:  mode === 'light' ? tokens.colors.black300   : tokens.colors.black600,

    // semantic states
    danger:  tokens.colors.red500,
    success: tokens.colors.green500,
    warning: tokens.colors.amber500,
  },
  spacing:    tokens.spacing,
  radius:     tokens.radius,
  fontSize:   tokens.fontSize,
  fontWeight: tokens.fontWeight,
  fontFamily: tokens.fontFamily,
  lineHeight: tokens.lineHeight,
})

export const lightTheme: Theme = buildTheme('light')
export const darkTheme: Theme  = buildTheme('dark')