import type { ViewStyle } from 'react-native'
import type { ShadowKey } from './shadow'

// Web: CSS box shadows, which react-native-web passes through as they are.
export const shadows: Record<ShadowKey, ViewStyle> = {
  none: { boxShadow: 'none' },
  sm: { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
  md: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' },
  lg: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' },
  xl: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' },
}
