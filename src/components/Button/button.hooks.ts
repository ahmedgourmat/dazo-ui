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
                paddingVertical: theme.spacing.xs,
                paddingHorizontal: theme.spacing.sm,
                fontSize: theme.fontSize.sm,
            },
            md: {
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
                fontSize: theme.fontSize.md,
            },
            lg: {
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.lg,
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
                borderRadius: theme.radius.md,
                alignSelf: fullWidth ? 'stretch' : 'flex-start',
            } as ViewStyle,
            label: {
                ...variantStyles[variant].label,
                fontSize: sizeStyles[size].fontSize,
                fontWeight: theme.fontWeight.medium,
                fontFamily: theme.fontFamily.medium,
            },
            indicator: variantStyles[variant].indicator,
            currentSize: sizeStyles[size],
        }
    }, [theme, variant, size, disabled, fullWidth])
}