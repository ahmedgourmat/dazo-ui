import { Theme } from "./theme"

export const tokens = {
  colors: {
    // brand
    blue300: '#93C5FD',
    blue500: '#3B82F6',
    blue700: '#1D4ED8',

    // neutrals
    gray50:  '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray400: '#9CA3AF',
    gray600: '#4B5563',
    gray800: '#1F2937',
    gray900: '#111827',

    // semantic
    red500:   '#EF4444',
    green500: '#22C55E',
    amber500: '#F59E0B',

    // absolute
    white: '#FFFFFF',
    black: '#000000',
  },
  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
  },
  radius: {
    sm:   4,
    md:   8,
    lg:   12,
    full: 9999,
  },
  fontSize: {
    xs:  11,
    sm:  13,
    md:  15,
    lg:  17,
    xl:  20,
    xxl: 24,
  },
  fontWeight: {
    regular: '400' as const,
    medium:  '500' as const,
    bold:    '700' as const,
  },
  fontFamily: {
    regular: 'system',
    medium: 'system',
    bold: 'system',
  },
  lineHeight: {
    tight:  1.3,
    normal: 1.6,
    loose:  1.9,
  },
}

export type Tokens = typeof tokens



export type SpacingKey = keyof Theme['spacing']
export type RadiusKey = keyof Theme['radius']
export type SpacingValue = SpacingKey | number