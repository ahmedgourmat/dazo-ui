import {
  Pressable, Text, ActivityIndicator,
  StyleSheet, type StyleProp, type ViewStyle, type TextStyle
} from 'react-native'
import { useMemo } from 'react'
import { useTheme } from '../../Providers'
import type { ButtonProps } from './button.type'

const Button = ({
  label,
  onPress,
  disabled  = false,
  loading   = false,
  variant   = 'solid',
  size      = 'md',
  style,
  labelStyle,
}: ButtonProps) => {

  const theme = useTheme()

  
  const computed = useMemo(() => {
    const sizeStyles = {
      sm: {
        paddingVertical:   theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        fontSize:          theme.fontSize.sm,
      },
      md: {
        paddingVertical:   theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        fontSize:          theme.fontSize.md,
      },
      lg: {
        paddingVertical:   theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        fontSize:          theme.fontSize.lg,
      },
    } as const

    const variantStyles = {
      solid: {
        container: {
          backgroundColor: disabled
            ? theme.colors.textDisabled
            : theme.colors.primary,
          borderWidth: 0,
        },
        label: {
          color: theme.colors.textInverse,
        },
        indicator: theme.colors.textInverse,
      },
      outline: {
        container: {
          backgroundColor: 'transparent' as const,
          borderWidth: 1,
          borderColor: disabled
            ? theme.colors.textDisabled
            : theme.colors.primary,
        },
        label: {
          color: disabled
            ? theme.colors.textDisabled
            : theme.colors.primary,
        },
        indicator: theme.colors.primary,
      },
      ghost: {
        container: {
          backgroundColor: 'transparent' as const,
          borderWidth: 0,
        },
        label: {
          color: disabled
            ? theme.colors.textDisabled
            : theme.colors.primary,
        },
        indicator: theme.colors.primary,
      },
    } as const

    return {
      container: {
        ...sizeStyles[size],
        ...variantStyles[variant].container,
        borderRadius: theme.radius.md
      },
      label: {
        ...variantStyles[variant].label,
        fontSize:   sizeStyles[size].fontSize,
        fontWeight: theme.fontWeight.medium,
      },
      indicator: variantStyles[variant].indicator,
    }
  }, [theme, variant, size, disabled])

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
        ? <ActivityIndicator size="small" color={computed.indicator} />
        : <Text style={[styles.label, computed.label, labelStyle]}>
            {label}
          </Text>
      }
    </Pressable>
  )
}

export default Button

// created ONCE when the module loads — never recreated
// only put values here that never depend on theme or props
const styles = StyleSheet.create({
  base: {
    alignItems:     'center',
    justifyContent: 'center',
    flexDirection:  'row',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    includeFontPadding: false,  // android fix — removes extra padding around text
  },
})