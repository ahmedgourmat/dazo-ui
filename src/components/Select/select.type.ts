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
  /** Finds the component in end-to-end tests (Detox, Maestro, Playwright). Set on the same element as `ref`; on the web it becomes `data-testid`. */
  testID?: string
  label?: string
  placeholder?: string
  /** The selected option's value, when you control it (with `onChange`). `null` means nothing is selected. */
  value?: string | null
  /** The option selected at first when you don't control it. */
  defaultValue?: string
  options: SelectOption[]
  /** Called with the option's value when the user picks it. */
  onChange?: (value: string) => void
  disabled?: boolean
  /** Height 32 / 40 / 48 / 56 (it grows to fit a label). Default md. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  leftIcon?: ReactNode
  /** Replaces the default chevron. */
  rightIcon?: ReactNode
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}