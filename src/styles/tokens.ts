import { systemFont } from './systemFont'

// ─── Primitive tokens ─────────────────────────────────────────────────────────
// Raw values. Components never read these directly: they read the semantic
// theme (theme.ts), which maps these values to roles such as `foreground`.

/** The neutral palette the default monochrome themes are built from. */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  // Status colors: the light themes use 600, the dark themes 400.
  red: { 400: '#F87171', 600: '#DC2626' },
  green: { 400: '#4ADE80', 600: '#16A34A' },
  amber: { 400: '#FBBF24', 600: '#D97706' },
  blue: { 400: '#60A5FA', 600: '#2563EB' },
}

/** The shades an accent palette provides. */
export type AccentPalette = {
  50: string
  200: string
  400: string
  600: string
  700: string
}

/**
 * Optional accent palettes for primary actions, selected states and focus
 * rings. The default theme stays monochrome; an accent changes only those
 * roles, never the neutral surfaces or text.
 */
export const accentPalettes: {
  blue: AccentPalette
  green: AccentPalette
  violet: AccentPalette
  orange: AccentPalette
} = {
  blue: { 50: '#EFF6FF', 200: '#BFDBFE', 400: '#60A5FA', 600: '#2563EB', 700: '#1D4ED8' },
  green: { 50: '#ECFDF5', 200: '#A7F3D0', 400: '#6EE7B7', 600: '#059669', 700: '#047857' },
  violet: { 50: '#F5F3FF', 200: '#DDD6FE', 400: '#A78BFA', 600: '#7C3AED', 700: '#6D28D9' },
  orange: { 50: '#FFF7ED', 200: '#FED7AA', 400: '#FDBA74', 600: '#EA580C', 700: '#C2410C' },
}

export type AccentName = keyof typeof accentPalettes

/** The full 4px spacing scale (with 2px half steps): `space[1.5]` is 6. */
export type SpaceStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24

export const tokens = {
  space: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  } as Record<SpaceStep, number>,

  // The names that spacing props accept (padding="md"), each a step of the scale above.
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },

  borderWidth: {
    none: 0,
    thin: 1,
    medium: 2,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    /** @deprecated Use `base`. Kept equal to it. */
    md: 16,
    /** @deprecated Use `2xl`. Kept equal to it. */
    xxl: 24,
  },

  /** Line height in px for each font size: `fontSize.sm` (14) uses `leading.sm` (20). */
  leading: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 53, // 48 × 1.1
    /** @deprecated Use `base`. Kept equal to it. */
    md: 24,
    /** @deprecated Use `2xl`. Kept equal to it. */
    xxl: 32,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // The system font on every platform; see systemFont.ts and systemFont.web.ts.
  // Themes can set any family, e.g. { fontFamily: { regular: 'Inter' } }.
  fontFamily: {
    regular: systemFont as string | undefined,
    medium: systemFont as string | undefined,
    semibold: systemFont as string | undefined,
    bold: systemFont as string | undefined,
  },

  /** Line height multipliers, for long-form text that sets its own size. */
  lineHeight: {
    tight: 1.3,
    normal: 1.6,
    loose: 1.9,
  },

  /** Heights of buttons, inputs and other controls. */
  controlHeight: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  },

  iconSize: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },

  motion: {
    /** Milliseconds. */
    duration: {
      instant: 0,
      fast: 100,
      normal: 180,
      slow: 250,
      slower: 350,
    },
    /** Cubic bézier control points (x1, y1, x2, y2), e.g. for Easing.bezier(...). */
    easing: {
      standard: [0.2, 0, 0, 1] as [number, number, number, number],
      enter: [0, 0, 0.2, 1] as [number, number, number, number],
      exit: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
}

export type Tokens = typeof tokens
export type SpacingKey = keyof Tokens['spacing']
export type RadiusKey = keyof Tokens['radius']
export type BorderWidthKey = keyof Tokens['borderWidth']
export type FontSizeKey = keyof Tokens['fontSize']
export type ControlSize = keyof Tokens['controlHeight']
export type SpacingValue = SpacingKey | number
