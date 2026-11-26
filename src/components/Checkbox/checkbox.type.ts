import type { ReactNode, Ref } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle, View } from 'react-native'

export interface CheckboxProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The pressable checkbox. Use it to focus() it or measure it. */
  ref?: Ref<View>
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  value?: string
  checkedColor?: string
  uncheckedColor?: string
  checkmarkColor?: string
  textColor?: string
  icon?: ReactNode
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  checkboxSize?: number
}
