import type { ReactNode, Ref } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle, View } from 'react-native'

export interface CheckboxProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The pressable checkbox. Use it to focus() it or measure it. */
  ref?: Ref<View>
  /** Finds the component in end-to-end tests (Detox, Maestro, Playwright). Set on the same element as `ref`; on the web it becomes `data-testid`. */
  testID?: string
  label?: string
  /** Checked or not, when you control it (with `onChange`). */
  checked?: boolean
  /** The starting state when you don't control it. Default false. */
  defaultChecked?: boolean
  /** Called with the new state when the user toggles it. */
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
