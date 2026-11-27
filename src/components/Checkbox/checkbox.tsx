import type { JSX } from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { useCheckboxStyles, useCheckboxLabelStyles } from './checkbox.hooks'
import { formFieldProps, useFormField } from '../FormField/form-field.context'
import type { CheckboxProps } from './checkbox.type'
import { spaceKeyActivates } from '../../hooks/keyboard'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { isFocusVisible, useFocusVisibleTracking } from '../../hooks/focusVisible'
import { useTheme } from '../../providers'
import { focusRing, type InteractionState } from '../../styles/interaction'
import { HIDDEN_TEXT, SkeletonBox } from '../Skeleton/skeleton-box'
import { withSkeleton } from '../Skeleton/with-skeleton'

const CheckboxBase = ({
  ref,
  label,
  checked = false,
  onChange,
  disabled: disabledProp = false,
  value,
  checkedColor,
  uncheckedColor,
  checkmarkColor,
  textColor,
  icon,
  style,
  labelStyle,
  checkboxSize = 20,
  ...commonProps
}: CheckboxProps): JSX.Element => {
  // Spacing, size, border and color props go through the same path as every
  // other component, so tokens like padding="md" resolve to theme values.
  const commonStyles = useCommonStyles(commonProps)
  const theme = useTheme()
  const formField = useFormField()
  const disabled = disabledProp || Boolean(formField?.disabled)
  useFocusVisibleTracking()
  const { boxStyle, checkmarkStyle } = useCheckboxStyles({
    checked,
    disabled,
    checkedColor,
    uncheckedColor,
    checkmarkColor,
    checkboxSize,
  })

  const labelStyles = useCheckboxLabelStyles({
    disabled,
    textColor,
  })

  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  return (
    <Pressable
      ref={ref}
      style={({ focused }: InteractionState) => [
        styles.container,
        { borderRadius: theme.radius.sm },
        commonStyles,
        style,
        isFocusVisible(focused) && focusRing(theme),
      ]}
      onPress={handlePress}
      disabled={disabled}
      // role and aria-* work on iOS, Android and web; react-native-web
      // ignores the older accessibilityState.
      role='checkbox'
      aria-checked={checked}
      aria-disabled={disabled}
      aria-label={label || value}
      {...formFieldProps(formField, 'own', { requiredAllowed: true })}
      {...spaceKeyActivates(handlePress, disabled)}
    >
      <View style={styles.content}>
        <View style={[styles.box, boxStyle]}>
          {checked && <Text style={checkmarkStyle}>✓</Text>}
        </View>

        <View style={styles.labelContainer}>
          {icon && <View style={styles.icon}>{icon}</View>}
          {label && (
            <Text style={[styles.label, labelStyles, labelStyle]}>
              {label}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    // The 44-point touch height is centered on the row, not left as a gap below it.
    justifyContent: 'center',
    minHeight: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  box: {
    marginRight: 12,
    flexShrink: 0,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
})

// Inside <Skeleton loading>: the box and the label's width.
const CheckboxSkeleton = (props: CheckboxProps): JSX.Element => {
  const theme = useTheme()
  const { label, checkboxSize = 20, style, labelStyle, textColor } = props
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])
  const labelStyles = useCheckboxLabelStyles({ textColor })

  return (
    <View aria-hidden style={[styles.container, commonStyles, style]}>
      <View style={styles.content}>
        <SkeletonBox style={[styles.box, { width: checkboxSize, height: checkboxSize, borderRadius: theme.radius.sm }]} />
        {label ? (
          <SkeletonBox style={{ borderRadius: theme.radius.sm, flexShrink: 1 }}>
            <Text style={[labelStyles, labelStyle, HIDDEN_TEXT]}>{label}</Text>
          </SkeletonBox>
        ) : null}
      </View>
    </View>
  )
}

export const Checkbox: (props: CheckboxProps) => JSX.Element = withSkeleton(CheckboxBase, CheckboxSkeleton)
