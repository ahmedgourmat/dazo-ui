import type { ReactNode, Ref } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle, View } from 'react-native'

export type RadioOption = {
  label: string
  value: string
  disabled?: boolean
  icon?: ReactNode
}

export interface RadioGroupProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
  /** The View that holds the options. */
  ref?: Ref<View>
  /** Finds the component in end-to-end tests (Detox, Maestro, Playwright). Set on the same element as `ref`; on the web it becomes `data-testid`. */
  testID?: string
  options: RadioOption[]
  /** The selected option's value, when you control it (with `onChange`). `null` means nothing is selected. */
  value?: string | null
  /** The option selected at first when you don't control it. */
  defaultValue?: string
  /** Called with the option's value when the user picks it. */
  onChange?: (value: string) => void
  disabled?: boolean
  direction?: 'row' | 'column'
  textColor?: string
  circleColor?: string
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  /** Name screen readers announce for the whole group, e.g. "Role". */
  accessibilityLabel?: string
}