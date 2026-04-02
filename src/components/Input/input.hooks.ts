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
  const modeTextColor = theme.mode === 'light' ? '#000000' : '#FFFFFF'

  return useMemo(() => {
    const variantStyles = {
      solid: {
        container: {
          backgroundColor: editable ? theme.colors.backgroundSunken : theme.colors.backgroundSunken,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        input: {
          color: textColor ?? modeTextColor,
          fontFamily: theme.fontFamily.regular,
        },
        placeholderColor: editable
          ? modeTextColor
          : modeTextColor,
      },
      outline: {
        container: {
          backgroundColor: theme.colors.backgroundSurface,
          borderWidth: 1,
          borderColor: editable ? theme.colors.primary : theme.colors.textDisabled,
        },
        input: {
          color: textColor ?? modeTextColor,
          fontFamily: theme.fontFamily.regular,
        },
        placeholderColor: modeTextColor,
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
        placeholderColor: modeTextColor,
      },
    } as const

    return variantStyles[variant]
  }, [editable, theme, textColor, variant])
}

export type { InputVariant }