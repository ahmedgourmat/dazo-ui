import type { TextStyle, ViewStyle } from 'react-native'
import { shadows, type ShadowKey } from './shadow'
import { accentPalettes, palette, tokens, type AccentName, type AccentPalette, type Tokens } from './tokens'

export type ThemeMode = 'light' | 'dark'

/** 'neutral' (the default, monochrome), a built-in accent palette, or your own shades. */
export type ThemeAccent = 'neutral' | AccentName | AccentPalette

/**
 * Semantic color roles. Components read these, never raw palette values, so
 * a theme can change what a role looks like everywhere at once.
 */
export interface ThemeColors {
  /** Main application background. */
  background: string
  /** Main text and icon color. */
  foreground: string
  /** Default component surface. */
  surface: string
  /** Subtle or secondary surface: table headers, filled inputs, stripes. */
  surfaceMuted: string
  /** Raised surface such as a menu or popover. */
  surfaceElevated: string
  /** Surface with inverted contrast. */
  surfaceInverse: string
  /** Secondary text: labels, placeholders, captions. */
  foregroundMuted: string
  /** Low-emphasis text and icons, such as disabled content. */
  foregroundSubtle: string
  /** Default border, for dividers and containers. */
  border: string
  /** Emphasized border. */
  borderStrong: string
  /** Boundary of inputs, checkboxes and radios (3:1 against the background). */
  input: string
  /** Keyboard focus indicator. */
  ring: string
  /** Main action color. */
  primary: string
  /** Content placed on `primary`. */
  primaryForeground: string
  /** Secondary action surface. */
  secondary: string
  /** Content placed on `secondary`. */
  secondaryForeground: string
  /** Destructive actions and errors. */
  danger: string
  success: string
  warning: string
  info: string
  /** Text and icons placed on `danger`. */
  dangerForeground: string
  /** Text and icons placed on `success`. */
  successForeground: string
  /** Text and icons placed on `warning`. */
  warningForeground: string
  /** Text and icons placed on `info`. */
  infoForeground: string

  /** @deprecated Use `surface`. Follows it. */
  backgroundSurface: string
  /** @deprecated Use `surfaceMuted`. Follows it. */
  backgroundSunken: string
  /** @deprecated Use `foreground`. Follows it. */
  textPrimary: string
  /** @deprecated Use `foregroundMuted`. Follows it. */
  textSecondary: string
  /** @deprecated Use `foregroundSubtle`. Follows it. */
  textDisabled: string
  /** @deprecated Use `primaryForeground`. Follows it. */
  textInverse: string
  /** @deprecated Use `primary`. Follows it. */
  primaryLight: string
  /** @deprecated Use `primary`. Follows it. */
  primaryDark: string
}

// this is the shape every component reads from (what useTheme() returns)
// every component types against this, never against raw tokens
export interface Theme {
  mode: ThemeMode
  colors: ThemeColors
  /** The names spacing props accept: padding="md". */
  spacing: Tokens['spacing']
  /** The full spacing scale in 4px steps (2px half steps): space[1.5] is 6. */
  space: Tokens['space']
  radius: Tokens['radius']
  borderWidth: Tokens['borderWidth']
  fontSize: Tokens['fontSize']
  /** Line height in px for each font size. */
  leading: Tokens['leading']
  // Any React Native weight, not only the token values ('400' | '500' | …),
  // so a theme can override e.g. bold with '800'.
  fontWeight: { [K in keyof Tokens['fontWeight']]: NonNullable<TextStyle['fontWeight']> }
  fontFamily: Tokens['fontFamily']
  lineHeight: Tokens['lineHeight']
  controlHeight: Tokens['controlHeight']
  iconSize: Tokens['iconSize']
  /** Elevation levels: shadow* and elevation on iOS/Android, boxShadow on web. */
  shadow: Record<ShadowKey, ViewStyle>
  motion: Tokens['motion']
}

type SemanticColors = Omit<ThemeColors, keyof typeof COLOR_ALIASES>

/** Each deprecated color name and the role it now follows. */
export const COLOR_ALIASES = {
  backgroundSurface: 'surface',
  backgroundSunken: 'surfaceMuted',
  textPrimary: 'foreground',
  textSecondary: 'foregroundMuted',
  textDisabled: 'foregroundSubtle',
  textInverse: 'primaryForeground',
  primaryLight: 'primary',
  primaryDark: 'primary',
} as const

/** Each deprecated font size name and the step it now follows (also for `leading`). */
export const FONT_SIZE_ALIASES = {
  md: 'base',
  xxl: '2xl',
} as const

/** Copies every role's value to its deprecated names, so old names always match. */
export const syncAliases = (theme: Theme): Theme => {
  const colors = { ...theme.colors }
  for (const [alias, role] of Object.entries(COLOR_ALIASES)) {
    colors[alias as keyof typeof COLOR_ALIASES] = colors[role]
  }
  const fontSize = { ...theme.fontSize }
  const leading = { ...theme.leading }
  for (const [alias, step] of Object.entries(FONT_SIZE_ALIASES)) {
    fontSize[alias as keyof typeof FONT_SIZE_ALIASES] = fontSize[step]
    leading[alias as keyof typeof FONT_SIZE_ALIASES] = leading[step]
  }
  return { ...theme, colors, fontSize, leading }
}

const gray = palette.gray

/** The roles an accent sets. Light themes use the 700 shade so white text on it passes 4.5:1. */
const accentColors = (mode: ThemeMode, accent: ThemeAccent): Pick<SemanticColors, 'primary' | 'primaryForeground' | 'ring'> => {
  if (accent === 'neutral') {
    return mode === 'light'
      ? { primary: gray[900], primaryForeground: palette.white, ring: gray[900] }
      : { primary: gray[50], primaryForeground: gray[900], ring: gray[400] }
  }
  const shades = typeof accent === 'string' ? accentPalettes[accent] : accent
  return mode === 'light'
    ? { primary: shades[700], primaryForeground: palette.white, ring: shades[600] }
    : { primary: shades[400], primaryForeground: gray[950], ring: shades[400] }
}

const semanticColors = (mode: ThemeMode, accent: ThemeAccent): SemanticColors => {
  const light = mode === 'light'
  return {
    background: light ? palette.white : gray[950],
    foreground: light ? gray[900] : gray[50],
    surface: light ? palette.white : gray[900],
    surfaceMuted: light ? gray[50] : gray[800],
    surfaceElevated: light ? palette.white : gray[800],
    surfaceInverse: light ? gray[900] : gray[50],
    foregroundMuted: light ? gray[600] : gray[400],
    foregroundSubtle: gray[500],
    border: light ? gray[200] : gray[800],
    borderStrong: light ? gray[300] : gray[700],
    // gray[500] rather than a lighter gray: a field's edge is what shows where
    // it is, so it needs 3:1 against the page (WCAG 1.4.11) in both modes.
    input: gray[500],
    secondary: light ? gray[100] : gray[800],
    secondaryForeground: light ? gray[900] : gray[50],
    danger: light ? palette.red[600] : palette.red[400],
    success: light ? palette.green[600] : palette.green[400],
    warning: light ? palette.amber[600] : palette.amber[400],
    info: light ? palette.blue[600] : palette.blue[400],
    // White only where it reaches 4.5:1; the lighter green and amber, and
    // every dark-mode status color, take near-black text.
    dangerForeground: light ? palette.white : gray[950],
    successForeground: gray[950],
    warningForeground: gray[950],
    infoForeground: light ? palette.white : gray[950],
    ...accentColors(mode, accent),
  }
}

/** Builds the light or dark theme, with an optional accent palette. */
export const buildTheme = (mode: ThemeMode, accent: ThemeAccent = 'neutral'): Theme =>
  syncAliases({
    mode,
    colors: semanticColors(mode, accent) as ThemeColors,
    spacing: tokens.spacing,
    space: tokens.space,
    radius: tokens.radius,
    borderWidth: tokens.borderWidth,
    fontSize: tokens.fontSize,
    leading: tokens.leading,
    fontWeight: tokens.fontWeight,
    fontFamily: tokens.fontFamily,
    lineHeight: tokens.lineHeight,
    controlHeight: tokens.controlHeight,
    iconSize: tokens.iconSize,
    shadow: shadows,
    motion: tokens.motion,
  })

export const lightTheme: Theme = buildTheme('light')
export const darkTheme: Theme = buildTheme('dark')
