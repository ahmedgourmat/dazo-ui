import type { ReactNode, Ref } from 'react'
import type { StyleProp, TextStyle, View } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'

export interface FormFieldProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The field's View. */
  ref?: Ref<View>
  testID?: string
  /** Shown above the control, and the control's name for screen readers. */
  label: string
  /** The control: Input, Textarea, Select, Checkbox, RadioGroup, Switch, FileInput, or your own (see useFormField). */
  children: ReactNode
  /** A hint under the control. Replaced by `error` when there is one. */
  helperText?: string
  /** The error message. When set, the control is marked invalid and the message is announced. */
  error?: string
  /** Marks the label with * and tells screen readers the field is required. */
  required?: boolean
  /** Disables the control inside. */
  disabled?: boolean
  labelStyle?: StyleProp<TextStyle>
  helperTextStyle?: StyleProp<TextStyle>
}
