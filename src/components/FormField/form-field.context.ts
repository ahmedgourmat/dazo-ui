import { createContext, useContext, type Context } from 'react'
import { Platform } from 'react-native'

export type FormFieldState = {
  /** The id of the label, for aria-labelledby. */
  labelId: string
  /** The id of the helper text / error, for aria-describedby. */
  descriptionId: string
  label: string
  /** The error if there is one, otherwise the helper text. */
  description?: string
  invalid: boolean
  required: boolean
  disabled: boolean
}

export const FormFieldContext: Context<FormFieldState | null> = createContext<FormFieldState | null>(null)

/**
 * The FormField around a control, or null. Every dazo-ui control reads it;
 * use it to wire your own controls to a FormField's label, description and state.
 */
export const useFormField = (): FormFieldState | null => useContext(FormFieldContext)

/**
 * How a control is named:
 * - text: by the field's label (Input, Textarea)
 * - value: by the label and the control's current value (Select, FileInput)
 * - group: by the label, unless it has its own name (RadioGroup)
 * - own: by its own label; the field only describes it (Checkbox, Switch)
 */
type Kind = 'text' | 'value' | 'group' | 'own'

/** Roles that may carry aria-required (ARIA: textbox, checkbox, radiogroup, …). */
const REQUIRED_ALLOWED: ReadonlySet<Kind> = new Set(['text', 'group'])

/**
 * The accessibility props that connect a control to its FormField. Web gets
 * aria-labelledby / aria-describedby; iOS and Android, which have no ids to
 * point at, get an accessibility label and hint built from the texts.
 */
export const formFieldProps = (
  field: FormFieldState | null,
  kind: Kind,
  options: { valueId?: string; value?: string; ownDescriptionId?: string; hasOwnName?: boolean; requiredAllowed?: boolean } = {},
): object => {
  if (!field) return {}
  const describedBy = [field.description ? field.descriptionId : undefined, options.ownDescriptionId].filter(Boolean).join(' ')
  const required = field.required && (options.requiredAllowed ?? REQUIRED_ALLOWED.has(kind))

  if (Platform.OS === 'web') {
    const labelledBy =
      kind === 'text' ? field.labelId
        : kind === 'value' ? [field.labelId, options.valueId].filter(Boolean).join(' ')
          : kind === 'group' && !options.hasOwnName ? field.labelId
            : undefined
    return {
      ...(labelledBy && { 'aria-labelledby': labelledBy }),
      ...(describedBy && { 'aria-describedby': describedBy }),
      ...(field.invalid && { 'aria-invalid': true }),
      ...(required && { 'aria-required': true }),
    }
  }

  const label =
    kind === 'text' ? field.label
      : kind === 'value' ? [field.label, options.value].filter(Boolean).join(', ')
        : kind === 'group' && !options.hasOwnName ? field.label
          : undefined
  return {
    ...(label && { 'aria-label': field.required ? `${label}, required` : label }),
    ...(field.description && { accessibilityHint: field.description }),
  }
}
