import type { ReactNode } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export type SelectOption = {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
}

export interface SelectProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
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