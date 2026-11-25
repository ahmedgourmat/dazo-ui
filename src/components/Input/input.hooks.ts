import { useMemo } from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '../../providers'

type InputVariant = 'solid' | 'outline' | 'ghost'

export type InputStyles = {
  container: ViewStyle
  input: TextStyle
  placeholderColor: string
  /** Added to the container while the field has focus. */
  focusRing: ViewStyle
}

type UseInputStylesParams = {
  variant?: InputVariant
  editable?: boolean
  textColor?: string
}

export const useInputStyles = ({
  variant = 'outline',
  editable = true,
  textColor,
}: UseInputStylesParams): InputStyles => {
  const theme = useTheme()

  return useMemo(() => {
    const modeTextColor = theme.colors.textPrimary
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

    return {
      ...variantStyles[variant],
      // A 2px ring in the primary color around the whole field, for every variant.
      // Contrast is 5.4:1 on the light backgrounds and 3.2–3.6:1 on the dark
      // ones (WCAG asks for 3:1). An outline doesn't change the layout, unlike a
      // thicker border. iOS and Android draw it too (New Architecture).
      focusRing: {
        outlineColor: theme.colors.primary,
        outlineStyle: 'solid',
        outlineWidth: 2,
        outlineOffset: 2,
      },
    }
  }, [editable, theme, textColor, variant])
}

export type { InputVariant }