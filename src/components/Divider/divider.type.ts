import type { Ref } from 'react'
import type { StyleProp, TextStyle, View } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'

export interface DividerProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The separator's View (with a label: the row around it). */
  ref?: Ref<View>
  testID?: string
  /** Default horizontal. A vertical divider fills the height of its row. */
  orientation?: 'horizontal' | 'vertical'
  /** Text in the middle of a horizontal divider, e.g. "or". */
  label?: string
  /** Hide it from screen readers when it only decorates. Default false. */
  decorative?: boolean
  /** A theme color name or any color. Default `border`. */
  color?: string
  labelStyle?: StyleProp<TextStyle>
}
