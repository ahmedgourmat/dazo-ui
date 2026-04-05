import React from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { useCheckboxStyles, useCheckboxLabelStyles } from './checkbox.hooks'
import type { CheckboxProps } from './checkbox.type'

export const Checkbox = React.forwardRef<View, CheckboxProps>(
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
      marginBottom,
      marginTop,
      marginVertical,
      marginHorizontal,
      paddingVertical,
      paddingHorizontal,
      padding,
    },
    ref
  ) => {
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

    const containerStyle: any = [
      styles.container,
      {
        marginBottom: marginBottom ?? marginVertical,
        marginTop: marginTop ?? marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        paddingVertical,
        paddingHorizontal,
        padding,
      },
      style,
    ]

    return (
      <Pressable
        ref={ref}
        style={containerStyle}
        onPress={handlePress}
        disabled={disabled}
        accessible
        accessibilityRole='checkbox'
        accessibilityState={{ checked, disabled }}
        accessibilityLabel={label || value}
      >
        <View style={styles.content}>
          <View style={[styles.box, boxStyle as any]}>
            {checked && <Text style={checkmarkStyle as any}>✓</Text>}
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
