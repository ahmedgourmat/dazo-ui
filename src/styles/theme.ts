import { tokens } from './tokens'

// this is the shape every component reads from
// semantic names — not raw values
const buildTheme = (mode: 'light' | 'dark') => ({
  mode,
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

export const lightTheme = buildTheme('light')
export const darkTheme  = buildTheme('dark')

// this type is what useTheme() returns
// every component types against this, never against raw tokens
export type Theme = ReturnType<typeof buildTheme>