import type { JSX } from 'react'
import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native'
import { useButtonStyles } from './button.hooks'
import type { ButtonProps } from './button.type'
import { useCommonStyles } from '../../hooks/common.hooks'

// Native version of Button (iOS/Android). The web build uses button.web.tsx.
export const Button = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  icon,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  style,
  labelStyle,
  ...commonProps
}: ButtonProps): JSX.Element => {

  const computed = useButtonStyles({ variant, size, disabled, fullWidth })
  const commonStyles = useCommonStyles(commonProps)
  const resolvedLeftIcon = leftIcon ?? icon
  const resolvedRightIcon = rightIcon

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        computed.container,
        commonStyles,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading && (
        <View style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='small' color={computed.indicator} />
          </View>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', opacity: loading ? 0 : 1 }}>
        {resolvedLeftIcon ? <View style={styles.leftIcon}>{resolvedLeftIcon}</View> : null}
        <Text style={[styles.label, computed.label, labelStyle]}>
          {label}
        </Text>
        {resolvedRightIcon ? <View style={styles.rightIcon}>{resolvedRightIcon}</View> : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    includeFontPadding: false,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
})