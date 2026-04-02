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

  return useMemo(() => {
    const variantStyles = {
      solid: {
        container: {
          backgroundColor: editable ? theme.colors.primary : theme.colors.textDisabled,
          borderWidth: 0,
          borderColor: 'transparent',
        },
        input: {
          color: textColor ?? theme.colors.textInverse,
        },
        placeholderColor: editable
          ? 'rgba(255,255,255,0.75)'
          : theme.colors.textInverse,
      },
      outline: {
        container: {
          backgroundColor: theme.colors.backgroundSurface,
          borderWidth: 1,
          borderColor: editable ? theme.colors.primary : theme.colors.textDisabled,
        },
        input: {
          color: textColor ?? (editable ? theme.colors.textPrimary : theme.colors.textDisabled),
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
          color: textColor ?? (editable ? theme.colors.textPrimary : theme.colors.textDisabled),
        },
        placeholderColor: editable ? theme.colors.textSecondary : theme.colors.textDisabled,
      },
    } as const

    return variantStyles[variant]
  }, [editable, theme, textColor, variant])
}

export type { InputVariant }