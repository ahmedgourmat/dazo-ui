import type { InputProps } from '../Input/input.type'

export interface TextareaProps extends Omit<InputProps, 'multiline' | 'numberOfLines' | 'leftIcon' | 'rightIcon'> {
  /** The text when you don't control it (no `value`). */
  defaultValue?: string
  /** Lines shown when the field is empty. Default 3. */
  rows?: number
  /** The field grows with its text up to this many lines, then scrolls. Default `rows` (no growing). */
  maxRows?: number
  /** Shows "120 / 280" under the text (or just the length without `maxLength`). */
  showCount?: boolean
}
