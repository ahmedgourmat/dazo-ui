import type { ReactNode } from 'react'
import type { CommonProps } from 'styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface FileInputProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
  label?: string
  value?: string
  placeholder?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onPress?: () => void
  onClear?: () => void
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}