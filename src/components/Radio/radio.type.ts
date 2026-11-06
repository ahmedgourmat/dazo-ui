import type { ReactNode } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export type RadioOption = {
  label: string
  value: string
  disabled?: boolean
  icon?: ReactNode
}

export interface RadioGroupProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  direction?: 'row' | 'column'
  textColor?: string
  circleColor?: string
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}