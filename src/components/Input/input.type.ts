import type { ReactNode } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native'

type NativeInputProps = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'>

export interface InputProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'>, NativeInputProps {
  value?: string
  onChangeText?: (text: string) => void
  variant?: 'solid' | 'outline' | 'ghost'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  style?: StyleProp<ViewStyle>
  textColor?: string
  inputStyle?: StyleProp<TextStyle>
}