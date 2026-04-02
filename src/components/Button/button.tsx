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
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          border: 'none',
          ...(style as object),
        }}
      >
        {
          loading
            ? <ActivityIndicator size='small' color={computed.indicator} />
            : <>
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
            </>
        }
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
      {loading
        ? <ActivityIndicator size='small' color={computed.indicator} />
        : <>
          {resolvedLeftIcon ? <View style={styles.leftIcon}>{resolvedLeftIcon}</View> : null}
          <Text style={[styles.label, computed.label, labelStyle]}>
            {label}
          </Text>
          {resolvedRightIcon ? <View style={styles.rightIcon}>{resolvedRightIcon}</View> : null}
        </>
      }
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