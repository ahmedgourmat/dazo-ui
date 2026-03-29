import { tokens } from './tokens'

// this is the shape every component reads from
// semantic names — not raw values
const buildTheme = (mode: 'light' | 'dark') => ({
  mode,
  colors: {
    // backgrounds
    background:        mode === 'light' ? tokens.colors.white      : tokens.colors.gray900,
    backgroundSurface: mode === 'light' ? tokens.colors.gray50     : tokens.colors.gray800,
    backgroundSunken:  mode === 'light' ? tokens.colors.gray100    : tokens.colors.gray900,

    // text
    textPrimary:   mode === 'light' ? tokens.colors.gray900   : tokens.colors.gray50,
    textSecondary: mode === 'light' ? tokens.colors.gray600   : tokens.colors.gray400,
    textDisabled:  mode === 'light' ? tokens.colors.gray400   : tokens.colors.gray600,
    textInverse:   mode === 'light' ? tokens.colors.white     : tokens.colors.gray900,

    // brand
    primary:       tokens.colors.blue500,
    primaryLight:  tokens.colors.blue300,
    primaryDark:   tokens.colors.blue700,

    // borders
    border:        mode === 'light' ? tokens.colors.gray200   : tokens.colors.gray600,
    borderStrong:  mode === 'light' ? tokens.colors.gray400   : tokens.colors.gray400,

    // semantic states
    danger:  tokens.colors.red500,
    success: tokens.colors.green500,
    warning: tokens.colors.amber500,
  },
  spacing:    tokens.spacing,
  radius:     tokens.radius,
  fontSize:   tokens.fontSize,
  fontWeight: tokens.fontWeight,
  lineHeight: tokens.lineHeight,
})

export const lightTheme = buildTheme('light')
export const darkTheme  = buildTheme('dark')

// this type is what useTheme() returns
// every component types against this, never against raw tokens
export type Theme = ReturnType<typeof buildTheme>