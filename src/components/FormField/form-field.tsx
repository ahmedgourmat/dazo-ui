import { useId, useMemo, type JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { useTheme } from '../../providers'
import { HIDDEN_TEXT, SkeletonBox } from '../Skeleton/skeleton-box'
import { withSkeleton } from '../Skeleton/with-skeleton'
import { FormFieldContext } from './form-field.context'
import type { FormFieldProps } from './form-field.type'

/**
 * A label, helper text and error around one control, wired for screen
 * readers: the control is named by the label, described by the helper text
 * or error, and marked invalid, required or disabled. Works with any form
 * library; with react-hook-form, pass `fieldState.error?.message` as `error`.
 */
const FormFieldBase = ({
  ref,
  testID,
  label,
  children,
  helperText,
  error,
  required = false,
  disabled = false,
  style,
  labelStyle,
  helperTextStyle,
  ...commonProps
}: FormFieldProps): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  const id = useId()
  const description = error || helperText
  const field = useMemo(
    () => ({
      labelId: `${id}-label`,
      descriptionId: `${id}-description`,
      label,
      description,
      invalid: Boolean(error),
      required,
      disabled,
    }),
    [id, label, description, error, required, disabled],
  )

  return (
    <View ref={ref} testID={testID} style={[styles.field, { gap: theme.space[1.5] }, commonStyles, style]}>
      <Text
        nativeID={field.labelId}
        // On iOS and Android the control reads the label itself (see formFieldProps),
        // so the visible label isn't read a second time.
        importantForAccessibility='no'
        accessibilityElementsHidden
        style={[
          {
            color: theme.colors.foreground,
            fontSize: theme.fontSize.sm,
            lineHeight: theme.leading.sm,
            fontFamily: theme.fontFamily.medium,
            fontWeight: theme.fontWeight.medium,
          },
          labelStyle,
        ]}
      >
        {label}
        {/* aria-required already tells screen readers; the star is for the eye. */}
        {required ? <Text aria-hidden style={{ color: theme.colors.danger }}> *</Text> : null}
      </Text>

      <FormFieldContext.Provider value={field}>{children}</FormFieldContext.Provider>

      {/* Always rendered, so screen readers announce an error as soon as it appears. */}
      <View nativeID={field.descriptionId} aria-live='polite' accessibilityLiveRegion='polite'>
        {description ? (
          <Text
            style={[
              {
                color: error ? theme.colors.danger : theme.colors.foregroundMuted,
                fontSize: theme.fontSize.sm,
                lineHeight: theme.leading.sm,
                fontFamily: theme.fontFamily.regular,
              },
              helperTextStyle,
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

// Inside <Skeleton loading>: the label's and the description's width around the
// control, which draws its own placeholder.
const FormFieldSkeleton = (props: FormFieldProps): JSX.Element => {
  const theme = useTheme()
  const { label, children, helperText, error, style, labelStyle, helperTextStyle } = props
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])
  const description = error || helperText
  const line = (text: string, textStyle: FormFieldProps['labelStyle']) => (
    <SkeletonBox style={[styles.line, { borderRadius: theme.radius.sm }]}>
      <Text style={[{ fontSize: theme.fontSize.sm, lineHeight: theme.leading.sm }, textStyle, HIDDEN_TEXT]}>{text}</Text>
    </SkeletonBox>
  )

  return (
    <View style={[styles.field, { gap: theme.space[1.5] }, commonStyles, style]}>
      {line(label, labelStyle)}
      {children}
      {description ? line(description, helperTextStyle) : null}
    </View>
  )
}

export const FormField: (props: FormFieldProps) => JSX.Element = withSkeleton(FormFieldBase, FormFieldSkeleton)

const styles = StyleSheet.create({
  field: {
    alignSelf: 'stretch',
  },
  line: {
    alignSelf: 'flex-start',
  },
})
