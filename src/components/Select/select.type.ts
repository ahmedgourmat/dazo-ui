import type { ReactNode, Ref } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle, View } from 'react-native'

export type SelectOption = {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
}

export interface SelectProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
  /** The pressable field that opens the menu. Use it to focus() or measure it. */
  ref?: Ref<View>
  label?: string
  placeholder?: string
  value?: string
  options: SelectOption[]
  onChange?: (value: string) => void
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}