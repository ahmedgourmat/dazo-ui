import React from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { useCheckboxStyles, useCheckboxLabelStyles } from './checkbox.hooks'
import type { CheckboxProps } from './checkbox.type'
import { spaceKeyActivates } from '../../hooks/keyboard'
import { useCommonStyles } from '../../hooks/common.hooks'

export const Checkbox: React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<View>
> = React.forwardRef<View, CheckboxProps>(
  (
    {
      label,
      checked = false,
      onChange,
      disabled = false,
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
    },
    ref
  ) => {
    // Spacing, size, border and color props go through the same path as every
    // other component, so tokens like padding="md" resolve to theme values.
    const commonStyles = useCommonStyles(commonProps)
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
        style={[styles.container, commonStyles, style]}
        onPress={handlePress}
        disabled={disabled}
        // role and aria-* work on iOS, Android and web; react-native-web
        // ignores the older accessibilityState.
        role='checkbox'
        aria-checked={checked}
        aria-disabled={disabled}
        aria-label={label || value}
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
)

Checkbox.displayName = 'Checkbox'

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
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
    fontSize: 15,
  },
})
