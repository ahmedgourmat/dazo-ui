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
                minHeight: 32,
                paddingVertical: 6,
                paddingHorizontal: 12,
                fontSize: theme.fontSize.sm,
            },
            md: {
                minHeight: 40,
                paddingVertical: 10,
                paddingHorizontal: 20,
                fontSize: theme.fontSize.md,
            },
            lg: {
                minHeight: 48,
                paddingVertical: 12,
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
                    backgroundColor: theme.colors.backgroundSurface,
                    borderWidth: 1,
                    borderColor: disabled
                        ? theme.colors.border
                        : theme.colors.borderStrong,
                    shadowColor: '#000000',
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 1,
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