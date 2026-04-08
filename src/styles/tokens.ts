export const tokens = {
  colors: {

    // ─── Brand ───────────────────────────────────────────────
    blue50:  '#EFF6FF',
    blue100: '#DBEAFE',
    blue200: '#BFDBFE',
    blue300: '#93C5FD',
    blue400: '#60A5FA',
    blue500: '#3B82F6',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    blue800: '#1E40AF',
    blue900: '#1E3A8A',

    // ─── Neutrals / Black Scale ───────────────────────────────
    black50:  '#F8F8F8',
    black100: '#F2F2F2',
    black200: '#E5E5E5',
    black300: '#CCCCCC',
    black400: '#A3A3A3',
    black500: '#737373',
    black600: '#525252',
    black700: '#2B2B2B',
    black800: '#1A1A1A',
    black900: '#0F0F0F',
    black950: '#000000',

    gray50:  '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    gray950: '#030712',

    // ─── Red ──────────────────────────────────────────────────
    red50:  '#FEF2F2',
    red100: '#FEE2E2',
    red200: '#FECACA',
    red300: '#FCA5A5',
    red400: '#F87171',
    red500: '#EF4444',
    red600: '#DC2626',
    red700: '#B91C1C',
    red800: '#991B1B',
    red900: '#7F1D1D',

    // ─── Green ────────────────────────────────────────────────
    green50:  '#F0FDF4',
    green100: '#DCFCE7',
    green200: '#BBF7D0',
    green300: '#86EFAC',
    green400: '#4ADE80',
    green500: '#22C55E',
    green600: '#16A34A',
    green700: '#15803D',
    green800: '#166534',
    green900: '#14532D',

    // ─── Amber ────────────────────────────────────────────────
    amber50:  '#FFFBEB',
    amber100: '#FEF3C7',
    amber200: '#FDE68A',
    amber300: '#FCD34D',
    amber400: '#FBBF24',
    amber500: '#F59E0B',
    amber600: '#D97706',
    amber700: '#B45309',
    amber800: '#92400E',
    amber900: '#78350F',

    // ─── Orange ───────────────────────────────────────────────
    orange50:  '#FFF7ED',
    orange100: '#FFEDD5',
    orange200: '#FED7AA',
    orange300: '#FDBA74',
    orange400: '#FB923C',
    orange500: '#F97316',
    orange600: '#EA580C',
    orange700: '#C2410C',
    orange800: '#9A3412',
    orange900: '#7C2D12',

    // ─── Purple ───────────────────────────────────────────────
    purple50:  '#FAF5FF',
    purple100: '#F3E8FF',
    purple200: '#E9D5FF',
    purple300: '#D8B4FE',
    purple400: '#C084FC',
    purple500: '#A855F7',
    purple600: '#9333EA',
    purple700: '#7E22CE',
    purple800: '#6B21A8',
    purple900: '#581C87',

    // ─── Pink ─────────────────────────────────────────────────
    pink50:  '#FDF2F8',
    pink100: '#FCE7F3',
    pink200: '#FBCFE8',
    pink300: '#F9A8D4',
    pink400: '#F472B6',
    pink500: '#EC4899',
    pink600: '#DB2777',
    pink700: '#BE185D',
    pink800: '#9D174D',
    pink900: '#831843',

    // ─── Teal ─────────────────────────────────────────────────
    teal50:  '#F0FDFA',
    teal100: '#CCFBF1',
    teal200: '#99F6E4',
    teal300: '#5EEAD4',
    teal400: '#2DD4BF',
    teal500: '#14B8A6',
    teal600: '#0D9488',
    teal700: '#0F766E',
    teal800: '#115E59',
    teal900: '#134E4A',

    // ─── Cyan ─────────────────────────────────────────────────
    cyan50:  '#ECFEFF',
    cyan100: '#CFFAFE',
    cyan200: '#A5F3FC',
    cyan300: '#67E8F9',
    cyan400: '#22D3EE',
    cyan500: '#06B6D4',
    cyan600: '#0891B2',
    cyan700: '#0E7490',
    cyan800: '#155E75',
    cyan900: '#164E63',

    // ─── Absolute ─────────────────────────────────────────────
    white:       '#FFFFFF',
    black:       '#000000',
    transparent: 'transparent',
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
    sm:   2,
    md:   4,
    lg:   8,
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
    medium:  'system',
    bold:    'system',
  },

  lineHeight: {
    tight:  1.3,
    normal: 1.6,
    loose:  1.9,
  },
}

export type Tokens      = typeof tokens
export type SpacingKey  = keyof Tokens['spacing']
export type RadiusKey   = keyof Tokens['radius']
export type SpacingValue = SpacingKey | number