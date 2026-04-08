import { useMemo } from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '../../providers'

type InputVariant = 'solid' | 'outline' | 'ghost'

type UseInputStylesParams = {
  variant?: InputVariant
  editable?: boolean
  textColor?: string
}

export const useInputStyles = ({
  variant = 'outline',
  editable = true,
  textColor,
}: UseInputStylesParams) => {
  const theme = useTheme()
  const modeTextColor = theme.colors.textPrimary

  return useMemo(() => {
    const variantStyles = {
      solid: {
        container: {
          backgroundColor: theme.colors.backgroundSunken,
          borderWidth: 0,
          borderBottomWidth: editable ? 2 : 1,
          borderColor: editable ? theme.colors.primary : theme.colors.borderStrong,
          borderRadius: theme.radius.sm,
        },
        input: {
          color: textColor ?? modeTextColor,
          fontFamily: theme.fontFamily.regular,
        },
        placeholderColor: editable ? theme.colors.textSecondary : theme.colors.textDisabled,
      },
      outline: {
        container: {
          backgroundColor: 'transparent' as const,
          borderWidth: 1,
          borderColor: editable ? theme.colors.borderStrong : theme.colors.border,
          borderRadius: theme.radius.md,
        },
        input: {
          color: textColor ?? modeTextColor,
          fontFamily: theme.fontFamily.regular,
        },
        placeholderColor: editable ? theme.colors.textSecondary : theme.colors.textDisabled,
      },
      ghost: {
        container: {
          backgroundColor: 'transparent' as const,
          borderWidth: 0,
          borderColor: 'transparent',
        },
        input: {
          color: textColor ?? modeTextColor,
          fontFamily: theme.fontFamily.regular,
        },
        placeholderColor: editable ? theme.colors.textSecondary : theme.colors.textDisabled,
      },
    } as const

    return variantStyles[variant]
  }, [editable, theme, textColor, variant])
}

export type { InputVariant }