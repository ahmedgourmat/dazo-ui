import type { ViewStyle } from 'react-native'

export type ShadowKey = 'none' | 'sm' | 'md' | 'lg' | 'xl'

// iOS and Android. iOS draws the shadow* values; Android draws `elevation`.
// The web build uses shadow.web.ts. The levels match in how raised they look,
// not in exact values.
export const shadows: Record<ShadowKey, ViewStyle> = {
  none: { shadowColor: '#000000', shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 },
  sm: { shadowColor: '#000000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  md: { shadowColor: '#000000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  lg: { shadowColor: '#000000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  xl: { shadowColor: '#000000', shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
}
