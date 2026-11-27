import type { Ref } from 'react'
import type { StyleProp, TextStyle, View } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'

export interface SwitchProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The pressable row (label and track). */
  ref?: Ref<View>
  testID?: string
  /** On or off, when you control it (with `onChange`). */
  checked?: boolean
  /** The starting state when you don't control it. Default false. */
  defaultChecked?: boolean
  /** Called with the new state when the user toggles it. */
  onChange?: (checked: boolean) => void
  disabled?: boolean
  /** Text next to the switch. Tapping it toggles the switch too. */
  label?: string
  /**
   * start: label first, switch at the far end, as in a settings row (default).
   * end: switch first, then the label.
   */
  labelPosition?: 'start' | 'end'
  /** sm: 32 × 18 track · md: 44 × 24 track. Default md. */
  size?: 'sm' | 'md'
  /** The name screen readers use when there is no visible label. */
  accessibilityLabel?: string
  labelStyle?: StyleProp<TextStyle>
}
