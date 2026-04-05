import { Pressable, Text, ActivityIndicator, StyleSheet, Platform, View } from 'react-native'
import { useButtonStyles } from './button.hooks'
import type { ButtonProps } from './button.type'
import { useCommonStyles } from 'hooks/common.hooks'

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
}: ButtonProps) => {

  const computed = useButtonStyles({ variant, size, disabled, fullWidth })
  const commonStyles = useCommonStyles(commonProps)
  const resolvedLeftIcon = leftIcon ?? icon
  const resolvedRightIcon = rightIcon

  // Web platform rendering
  if (Platform.OS === 'web') {
    return (
      <button
        onClick={onPress}
        disabled={disabled || loading}
        style={{
          ...computed.container as React.CSSProperties,
          ...commonStyles as React.CSSProperties,
          width: fullWidth ? '100%' : 'auto',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          ...(style as object),
        }}
      >
        {loading && (
          <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex' }}>
            <ActivityIndicator size='small' color={computed.indicator} />
          </span>
        )}
        <span style={{ display: 'inline-flex', alignItems: 'center', opacity: loading ? 0 : 1 }}>
          {resolvedLeftIcon ? (
            <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>
              {resolvedLeftIcon}
            </span>
          ) : null}
          <span style={{
            ...computed.label as React.CSSProperties,
            ...(labelStyle as object),
          }}>
            {label}
          </span>
          {resolvedRightIcon ? (
            <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}>
              {resolvedRightIcon}
            </span>
          ) : null}
        </span>
      </button>
    )
  }

  // Native platform rendering
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