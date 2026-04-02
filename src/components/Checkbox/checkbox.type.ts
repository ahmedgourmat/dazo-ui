import type { ReactNode } from 'react'
import type { CommonProps } from 'styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface CheckboxProps extends Omit<CommonProps, 'children' | 'scrollable'> {
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
