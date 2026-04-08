// src/components/Button/Button.hooks.ts
import { useMemo } from 'react'
import { useTheme } from '../../providers'
import type { ButtonProps } from './button.type'
import { ViewStyle } from 'react-native'

type UseButtonStylesParams = Pick<ButtonProps,
    'variant' | 'size' | 'disabled' | 'fullWidth'
>

export const useButtonStyles = ({
    variant = 'solid',
    size = 'md',
    disabled = false,
    fullWidth = false,
}: UseButtonStylesParams) => {

    const theme = useTheme()

    return useMemo(() => {
        const sizeStyles = {
            sm: {
                maxHeight: 32,
                paddingVertical: 14,
                paddingHorizontal: 12,
                fontSize: theme.fontSize.sm,
            },
            md: {
                maxHeight: 40,
                paddingVertical: 16,
                paddingHorizontal: 20,
                fontSize: theme.fontSize.md,
            },
            lg: {
                maxHeight: 48,
                paddingVertical: 18,
                paddingHorizontal: 24,
                fontSize: theme.fontSize.lg,
            },
        } as const

        const variantStyles = {
            solid: {
                container: {
                    backgroundColor: disabled
                        ? theme.colors.textDisabled
                        : theme.colors.primary,
                    borderWidth: 0,
                    shadowColor: '#000000',
                    shadowOpacity: disabled ? 0 : 0.2,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: disabled ? 0 : 2,
                },
                label: {
                    color: theme.colors.textInverse,
                },
                indicator: theme.colors.textInverse,
            },
            outline: {
                container: {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: disabled
                        ? theme.colors.border
                        : theme.colors.primary,
                },
                label: {
                    color: theme.colors.textPrimary,
                },
                indicator: theme.colors.textPrimary,
            },
            ghost: {
                container: {
                    backgroundColor: 'transparent' as const,
                    borderWidth: 0,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                label: {
                    color: theme.colors.textSecondary,
                },
                indicator: theme.colors.textSecondary,
            },
        } as const

        return {
            container: {
                ...sizeStyles[size],
                ...variantStyles[variant].container,
                borderRadius: theme.radius.md,
                alignSelf: fullWidth ? 'stretch' : 'flex-start',
            } as ViewStyle,
            label: {
                ...variantStyles[variant].label,
                fontSize: sizeStyles[size].fontSize,
                fontWeight: theme.fontWeight.medium,
                fontFamily: theme.fontFamily.medium,
                lineHeight: sizeStyles[size].fontSize * 1.15,
            },
            indicator: variantStyles[variant].indicator,
            currentSize: sizeStyles[size],
        }
    }, [theme, variant, size, disabled, fullWidth])
}