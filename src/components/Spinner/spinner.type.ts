import type { Ref } from 'react'
import type { View } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'

export interface SpinnerProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The View around the indicator. */
  ref?: Ref<View>
  testID?: string
  /** sm 16 · md 20 · lg 36. Default md. */
  size?: 'sm' | 'md' | 'lg'
  /** A theme color name ('primary', 'foregroundMuted', …) or any color. Default `foreground`. */
  color?: string
  /** What screen readers announce. Default "Loading". */
  label?: string
}
