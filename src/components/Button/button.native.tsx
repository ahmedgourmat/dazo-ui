import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useButtonStyles } from './button.hooks'
import type { ButtonProps } from './button.type'

export const Button = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  style,
  labelStyle,
}: ButtonProps) => {

  const computed = useButtonStyles({ variant, size, disabled, fullWidth })

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        computed.container,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator size='small' color={computed.indicator} />
        : <Text style={[styles.label, computed.label, labelStyle]}>
          {label}
        </Text>
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
})