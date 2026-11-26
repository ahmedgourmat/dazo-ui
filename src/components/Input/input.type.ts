import type { ReactNode, Ref } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextInputProps, TextStyle, ViewStyle, TextInput } from 'react-native'

type NativeInputProps = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'>

export interface InputProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'>, NativeInputProps {
  /** The TextInput itself, so you can focus() it, e.g. to move to the next field. */
  ref?: Ref<TextInput>
  value?: string
  onChangeText?: (text: string) => void
  /** outline: bordered (default). solid: filled, with a bottom edge. ghost: no edge. */
  variant?: 'solid' | 'outline' | 'ghost'
  /** Height 32 / 40 / 48 / 56. Default md. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Shows the field as having an error: a danger-colored edge, and aria-invalid for screen readers. */
  invalid?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  style?: StyleProp<ViewStyle>
  textColor?: string
  inputStyle?: StyleProp<TextStyle>
}